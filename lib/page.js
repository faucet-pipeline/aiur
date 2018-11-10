let { repr } = require("faucet-pipeline-core/lib/util");
let colonParse = require("metacolon");
let path = require("path");

module.exports = class Page {
	constructor(slug, sourcePath, children) {
		this.slug = slug;
		this.sourcePath = sourcePath;
		this.children = children || null;
	}

	render(layout) {
		return Promise.resolve("TBD"); // TODO
	}

	getChild(slug) {
		return this.children.get(slug);
	}

	async load() {
		if(this.body) { // heuristic
			return Promise.resolve(this);
		}

		let { headers, body } = await colonParse(this.sourcePath);
		// XXX: secondary fallbacks YAGNI?
		this.language = headers.lang || headers.language || null;
		this.title = headers.title || null;
		this.description = headers.desc || headers.description || null;
		this.body = body;
		return this;
	}

	toString() {
		let filepath = repr(this.sourcePath, false);
		let suffix = this.body ? " resolved" : "";
		return `<Page ${repr(this.slug, false)} ${filepath}${suffix}>`;
	}

	targetPath(referenceDir) {
		let slug = this.slug || "index";
		return path.resolve(referenceDir, `${slug}.html`);
	}
};
