let generatePageTree = require("./tree");
let resolvePath = require("faucet-pipeline-core/lib/util/resolve");
let { abort, repr } = require("faucet-pipeline-core/lib/util");
let fs = require("fs");
let path = require("path");
let { promisify } = require("util");

let readFile = promisify(fs.readFile);

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
	}

	toString() {
		let suffix = this.body ? " resolved" : "";
		return `<Site ${repr(this.source, false)}${suffix}>`;
	}
};

// reads page descriptors from file (either JSON or JavaScript)
function loadTree(filepath) {
	if(filepath.endsWith(".json")) {
		return readFile(filepath).
			then(JSON.parse);
	}

	let descriptors = require(filepath);
	return Promise.resolve(descriptors);
}
