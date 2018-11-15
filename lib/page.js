let { repr } = require("faucet-pipeline-core/lib/util");
let colonParse = require("metacolon");

module.exports = class Page {
	constructor(slug, sourcePath, children) {
		this.slug = slug || "";
		this.sourcePath = sourcePath;
		this.children = children || null;
	}

	getChild(slug) {
		return this.children.get(slug);
	}

	async load() {
		if(this.body) { // heuristic
			return Promise.resolve(this);
		}

		let { headers, body } = await colonParse(this.sourcePath);
		this.language = headers.language || "en";
		this.title = headers.title || null;
		this.description = headers.description || null;
		this.body = body;
		return this;
	}

	toString() {
		let filepath = repr(this.sourcePath, false);
		let suffix = this.body ? " resolved" : "";
		return `<Page ${repr(this.slug, false)} ${filepath}${suffix}>`;
	}
};
