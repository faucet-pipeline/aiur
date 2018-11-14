let generatePageTree = require("./tree");
let resolvePath = require("faucet-pipeline-core/lib/util/resolve");
let { abort, repr } = require("faucet-pipeline-core/lib/util");
let mkdirp = require("mkdirp");
let fs = require("fs");
let path = require("path");
let { promisify } = require("util");
let PageRenderer = require("./page_renderer");
let generateLayout = require("./generate_layout");

let readFile = promisify(fs.readFile);
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
		if(!source) {
			abort(`ERROR: missing ${repr("source", false)} configuration for styleguide`);
		}
		if(!target) {
			abort(`ERROR: missing ${repr("target", false)} configuration for ` +
					`styleguide ${repr("source", false)}`);
		}

		let { referenceDir } = assetManager;
		Object.assign(this, {
			source: resolvePath(source, referenceDir),
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

			// rebuild all if page hierarchy changes (inefficient, but that's alright)
			if(filepaths.has(this.source)) {
				filepaths = null;
			}

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

		let layout = generateLayout(tree);
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

			// NB: intentionally avoiding faucet's asset manager because
			//     we do not want fingerprinting or manifest handling
			// TODO: This also results in no output on the CLI incl. no status
			// message when it fails
			return writeFile(`${filepath}/index.html`, html, "utf8");
		});

		await Promise.all(writes);

		let renderedExamples = await pageRenderer.renderedExamples();
		return Promise.all(renderedExamples.map(({ html, page, slug }) => {
			return writeFile(`${page.filepath}/${slug}`, html, "utf8");
		}));
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
		let descriptors = await loadTree(this.source);
		this.tree = generatePageTree(descriptors, this.assetManager.referenceDir);
		return this.tree;
	}

	toString() {
		let suffix = this.body ? " resolved" : "";
		return `<Site ${repr(this.source, false)}${suffix}>`;
	}
};

// reads page descriptors from file (either JSON or JavaScript)
function loadTree(filepath) {
	if(filepath.endsWith(".json")) {
		return readFile(filepath, "utf8").
			then(JSON.parse);
	}

	let descriptors = require(filepath);
	return Promise.resolve(descriptors);
}
