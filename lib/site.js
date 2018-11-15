let generatePageTree = require("./tree");
let resolvePath = require("faucet-pipeline-core/lib/util/resolve");
let { abort, repr } = require("faucet-pipeline-core/lib/util");
let mkdirp = require("mkdirp");
let fs = require("fs");
let path = require("path");
let { promisify } = require("util");
let PageRenderer = require("./page_renderer");
let generateLayout = require("./generate_layout");

let writeFile = promisify(fs.writeFile);

let DEFAULTS = {
	language: "en",
	description: "Styleguide", // XXX: ???
	renderers: {
		html: require("./html")
	},
	generateLayout: generateLayout,
	assetPath: "assets",
	baseURI: "/"
};

module.exports = class Site {
	constructor(config, assetManager) {
		// validate essential settings
		let { source, target } = config;
		if(!target) {
			abort(`ERROR: missing ${repr("target", false)} configuration for styleguide`);
		}

		let { referenceDir } = assetManager;
		Object.assign(this, {
			source,
			target: resolvePath(target, referenceDir, { enforceRelative: true }),
			assetPath: config.assetPath || DEFAULTS.assetPath,
			baseURI: config.baseURI || DEFAULTS.baseURI,
			renderers: config.renderers || DEFAULTS.renderers,
			generateLayout: DEFAULTS.generateLayout,
			assetManager
		});
	}

	async generate(filepaths) {
		if(filepaths) {
			// XXX: inefficient; nite-owl already does this internally
			filepaths = new Set(filepaths);

			if(!this.tree.has(...filepaths)) {
				return false;
			}
		} else {
			await mkdirp(this.target);
		}

		let { tree, renderers, generateLayout } = this;
		if(!tree || filepaths === null) {
			tree = await this.load();
		}

		let layout = generateLayout(tree, this.assetManager.manifest);
		let pageRenderer = new PageRenderer({ renderers, layout });

		let dirs = new Set();
		let writes = tree.map(async page => {
			let filepath = path.resolve(this.target, page.slug);
			if(filepaths && !filepaths.has(filepath)) {
				return;
			}

			if(!dirs.has(filepath)) {
				await mkdirp(filepath);
				dirs.add(filepath);
			}

			page.filepath = filepath;

			let html = await pageRenderer.render(page);

			// TODO: Report errors if something goes wrong
			return this.writeFile(`${filepath}/index.html`, html);
		});

		await Promise.all(writes);

		let renderedSnippets = await pageRenderer.renderedSnippets();
		return Promise.all(renderedSnippets.map(({ html, page, slug }) => {
			// TODO: Report errors if something goes wrong
			return this.writeFile(`${page.filepath}/${slug}`, html);
		}));
	}

	// NB: intentionally avoiding assetManager's writeFile because
	//     we do not want fingerprinting or manifest handling
	async writeFile(path, content, { error } = {}) {
		await writeFile(path, content, "utf8");
		// TODO: this is currently a private method
		await this.assetManager._report(path, error);
		if(error && this.assetManager.exitOnError) {
			abort(error);
		}
	}

	// generates a URI for a given slug or `/`-delimited sequence thereof
	pageURI(slugs) {
		return path.join(this.baseURI, `${slugs}.html`); // TODO: validate slugs?
	}

	assetURI(filepath) {
		return path.join(this.baseURI, this.assetPath, filepath); // TODO: validate?
	}

	// loads page hierarchy
	async load() {
		this.tree = generatePageTree(this.source, this.assetManager.referenceDir);
		return this.tree;
	}
};
