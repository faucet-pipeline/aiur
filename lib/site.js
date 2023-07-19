let generatePageTree = require("./tree");
let resolvePath = require("faucet-pipeline-core/lib/util/resolve");
let { abort, reportFileStatus } = require("faucet-pipeline-core/lib/util");
let { mkdirp } = require("mkdirp");
let { writeFile } = require("node:fs/promises");
let path = require("path");
let PageRenderer = require("./page_renderer");
let SnippetWrapper = require("./snippet_wrapper");
let generateLayout = require("./generate_layout");
let Navigation = require("./navigation");

let DEFAULTS = {
	renderers: {
		handlebars: require("./handlebars"),
		html: require("./html")
	},
	generateLayout
};

module.exports = class Site {
	constructor({ source, target, baseURI }, assetManager) {
		let { referenceDir } = assetManager;
		Object.assign(this, {
			source: resolvePath(source, referenceDir),
			target: resolvePath(target, referenceDir, { enforceRelative: true }),
			baseURI,
			// TODO: either make this configurable or autoload renderers on use
			renderers: DEFAULTS.renderers,
			// TODO: make this configurable, but first find a simpler contract
			generateLayout: DEFAULTS.generateLayout,
			assetManager
		});
		this.dirs = new Set();
	}

	async generate(filepaths) {
		let tree = await this.tree();
		// TODO: no longer necessary when we can use nite-owl 4.0.0
		filepaths = new Set(filepaths);

		if(filepaths.size) {
			if(!tree.has(...filepaths) && !filepaths.has(this.source)) {
				return false;
			}
		} else {
			await mkdirp(this.target);
		}

		let { renderers, generateLayout } = this;

		let preperations = tree.map(async page => {
			let filepath = path.resolve(this.target, page.slug);

			if(!this.dirs.has(filepath)) {
				await mkdirp(filepath);
				this.dirs.add(filepath);
			}

			// eslint-disable-next-line require-atomic-updates
			page.filepath = filepath;

			return page.load();
		});
		await Promise.all(preperations);

		let navigation = new Navigation({ baseURI: this.baseURI });
		let layout = await generateLayout(navigation.generate(tree), this.assetManager.manifest);
		let pageRenderer = new PageRenderer({ renderers, layout });

		let writes = tree.map(async page => {
			let html = await pageRenderer.render(page);

			// TODO: Report errors if something goes wrong
			return this.writeFile(`${page.filepath}/index.html`, `${html}\n`);
		});

		await Promise.all(writes);

		let snippetWrapper = new SnippetWrapper({
			assetManager: this.assetManager,
			vendor: require(this.source).vendor || {}
		});

		let renderedSnippets = await pageRenderer.renderedSnippets();
		return Promise.all(renderedSnippets.map(({ html, page, slug }) => {
			// TODO: Report errors if something goes wrong
			return this.writeFile(`${page.filepath}/${slug}`, snippetWrapper.wrap(html));
		}));
	}

	// NB: intentionally avoiding assetManager's writeFile because
	//     we do not want fingerprinting or manifest handling
	async writeFile(path, content, { error } = {}) {
		await writeFile(path, content, "utf8");
		await reportFileStatus(path, this.referenceDir, error);
		if(error && this.assetManager.exitOnError) {
			abort(error);
		}
	}

	// loads page hierarchy
	async tree() {
		let config = load(this.source);
		return generatePageTree(config, this.referenceDir);
	}

	get referenceDir() {
		return this.assetManager.referenceDir;
	}
};

// require, but purge the cache beforehand
function load(modulePath) {
	delete require.cache[require.resolve(modulePath)];
	return require(modulePath);
}
