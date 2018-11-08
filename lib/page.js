let { repr } = require("faucet-pipeline-core/lib/util");
let colonParse = require("metacolon");

module.exports = class Page {
	constructor(slug, filepath, children) {
		this.slug = slug;
		this.filepath = filepath;
		this.children = children || null;
	}

	getChild(slug) {
		return this.children.get(slug);
	}

	async load() {
		if(this.body) { // heuristic
			return Promise.resolve(this);
		}

		let { headers, body } = await colonParse(this.filepath);
		// XXX: secondary fallbacks YAGNI?
		this.language = headers.lang || headers.language || null;
		this.title = headers.title || null;
		this.description = headers.desc || headers.description || null;
		this.body = body;
		return this;
	}

	toString() {
		let suffix = this.body ? " resolved" : "";
		return `<Page ${repr(this.slug, false)} ${repr(this.filepath, false)}${suffix}>`;
	}
};
