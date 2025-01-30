let { repr } = require("faucet-pipeline-core/lib/util");
let metacolon = import("metacolon");

module.exports = class Page {
	constructor(slug, sourcePath, children, { language, title, description, meta }, dataPath) {
		this.slug = slug || "";
		this.sourcePath = sourcePath;
		this.children = children || null;
		this.config = { language, title, description, meta };
		this.dataPath = dataPath;
	}

	getChild(slug) {
		return this.children.get(slug);
	}

	async load() {
		if(this.body) { // heuristic
			return Promise.resolve(this);
		}

		let { colonParse } = await metacolon;
		let { headers, body } = await colonParse(this.sourcePath, { trim: true });
		if(this.dataPath) {
			this.data = require(this.dataPath);
		}
		let title = headers.get("title");
		this.language = headers.get("language") || this.config.language;
		this.heading = title;
		this.title = [title, this.config.title].filter(x => x).join(" | ");
		this.description = headers.get("description") || this.config.description;
		this.meta = this.buildMeta();
		this.status = headers.get("status");
		this.version = headers.get("version");
		this.tags = headers.get("tags");
		this.body = body.trim();
		return this;
	}

	buildMeta() {
		return Object.entries(this.config.meta || {}).map(x => `<meta name="${x[0]}" content="${x[1]}">`).join("\n");
	}

	toString() {
		let filepath = repr(this.sourcePath, false);
		let suffix = this.body ? " resolved" : "";
		return `<Page ${repr(this.slug, false)} ${filepath}${suffix}>`;
	}
};
