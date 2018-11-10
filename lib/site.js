let generatePageTree = require("./tree");
let resolvePath = require("faucet-pipeline-core/lib/util/resolve");
let { abort, repr } = require("faucet-pipeline-core/lib/util");
let mkdirp = require("mkdirp");
let fs = require("fs");
let path = require("path");
let { promisify } = require("util");

let readFile = promisify(fs.readFile);
let writeFile = promisify(fs.writeFile);

let DEFAULTS = {
	language: "en",
	description: "Styleguide", // XXX: ???
	renderers: {
		html: template => template
	},
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

		let { tree, layout } = this;
		if(!tree || filepaths === null) {
			tree = await this.load();
		}

		let dirs = new Set();
		let writes = [];
		tree.forEach(async page => {
			let filepath = page.targetPath(this.target);
			if(filepaths && !filepaths.has(filepath)) {
				return;
			}

			let dirPath = path.dirname(filepath);
			if(!dirs.has(dirPath)) {
				await mkdirp(dirPath);
				dirs.add(dirPath);
			}

			let op = page.render(layout).
				then(html => {
					// NB: intentionally avoiding faucet's asset manager because
					//     we do not want fingerprinting or manifest handling
					writeFile(filepath, html, "utf8");
				});
			writes.push(op);
		});
		return Promise.all(writes);
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
