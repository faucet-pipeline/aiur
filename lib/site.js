let generatePageTree = require("./tree");
let resolvePath = require("faucet-pipeline-core/lib/util/resolve");
let { abort, reportFileStatus, loadExtension } = require("faucet-pipeline-core/lib/util");
let mkdirp = require("mkdirp");
let fs = require("fs");
let path = require("path");
let { promisify } = require("util");
let PageRenderer = require("./page_renderer");
let generateLayout = require("./generate_layout");
let Navigation = require("./navigation");

let writeFile = promisify(fs.writeFile);

let DEFAULTS = {
	renderers: {
		html: require("./html"),
		jsx: require("./complate")
	},
	generateLayout
};

module.exports = class Site {
	constructor({ source, target, baseURI }, assetManager) {
		let { referenceDir } = assetManager;
		source = resolvePath(source, referenceDir);
		Object.assign(this, {
			source,
			target: resolvePath(target, referenceDir, { enforceRelative: true }),
			config: reload(source),
			baseURI: baseURI.replace(/\/$/, ""), // trim trailing slash, if any
			// TODO: either make this configurable or autoload renderers on use
			renderers: DEFAULTS.renderers,
			// TODO: make this configurable, but first find a simpler contract
			generateLayout: DEFAULTS.generateLayout,
			assetManager
		});
		this.dirs = new Set();

		// support for externalized pages -- XXX: fugly
		let { config } = this;
		let { pages } = config;
		if(typeof pages === "string") {
			let filepath = resolvePath(pages, referenceDir, { enforceRelative: true });
			let ext = pages.split(".").pop();
			let load = (ext === "yaml" || ext === "yml") ? loadYAML : require;
			config.pages = load(filepath);
			config.pages._referenceDir = path.dirname(filepath); // XXX: hacky
		}

		this.pageURI = this.pageURI.bind(this);
		this.assetURI = this.assetURI.bind(this);

		let { context } = this.config;
		if(context) {
			context.pageURI = this.pageURI;
			context.assetURI = this.assetURI;
		}
	}

	pageURI(slug) {
		return `${this.baseURI}/${slug}`;
	}

	assetURI(filename) {
		let uri = this.assetManager.manifest.get(`dist/${filename}`);
		if(!uri) {
			throw new Error(`unknown asset: \`${filename}\``);
		}
		return uri;
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

			page.filepath = filepath;

			return page.load();
		});
		await Promise.all(preperations);

		let nav = new Navigation(this.pageURI);
		let layout = await generateLayout(nav.generate(tree), this.assetURI);
		let pageRenderer = new PageRenderer({ renderers, layout });

		let writes = tree.map(async page => {
			let html = await pageRenderer.render(page);

			// TODO: Report errors if something goes wrong
			return this.writeFile(`${page.filepath}/index.html`, `${html}\n`);
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
		await reportFileStatus(path, this.referenceDir, error);
		if(error && this.assetManager.exitOnError) {
			abort(error);
		}
	}

	// loads page hierarchy
	async tree() {
		let { config, referenceDir } = this;
		// account for pages-specific reference directory (in case of
		// externalized pages configuration)
		let { _referenceDir } = config.pages;
		if(config.pages._referenceDir) {
			referenceDir = _referenceDir;
			let pages = Object.assign({}, config.pages);
			delete pages._referenceDir;
			config = Object.assign({}, config, { pages });
		}
		return generatePageTree(config, referenceDir);
	}

	get referenceDir() {
		return this.assetManager.referenceDir;
	}
};

function loadYAML(filepath) {
	let yaml = loadExtension("js-yaml", "failed to activate YAML support");
	let data = fs.readFileSync(filepath, "utf8");
	return yaml.safeLoad(data);
}

// require, but purge the cache beforehand
function reload(modulePath) {
	delete require.cache[require.resolve(modulePath)];
	return require(modulePath);
}
