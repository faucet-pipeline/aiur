let { repr } = require("faucet-pipeline-core/lib/util");
let colonParse = require("metacolon");

module.exports = class Page {
	constructor(slug, sourcePath, children, { language, title, description }) {
		this.slug = slug || "";
		this.sourcePath = sourcePath;
		this.children = children || null;
		this.config = { language, title, description };
	}

	getChild(slug) {
		return this.children.get(slug);
	}

	async load() {
		if(this.body) { // heuristic
			return Promise.resolve(this);
		}

		let { headers, body } = await colonParse(this.sourcePath);
		this.language = headers.language || this.config.language;
		this.heading = headers.title;
		this.title = [headers.title, this.config.title].filter(x => x).join(" | ");
		this.description = headers.description || this.config.description;
		this.body = body;
		return this;
	}

	toString() {
		let filepath = repr(this.sourcePath, false);
		let suffix = this.body ? " resolved" : "";
		return `<Page ${repr(this.slug, false)} ${filepath}${suffix}>`;
	}
};
