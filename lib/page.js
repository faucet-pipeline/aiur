let colonParse = require("metacolon");

class Page {
	constructor({ slug, file, children }, config, resolvePath) {
		this.slug = slug;
		this.file = resolvePath(file);
		this.children = (children || []).map(child => {
			child.slug = `${slug}/${child.slug}`;
			return new Page(child, config, resolvePath);
		});
		this.config = config;
	}

	readHeaders() {
		return colonParse(this.file).
			then(({ headers }) => {
				this.description = headers.description || this.config.description;
				this.language = headers.language || this.config.language;
				this.heading = headers.title;
				this.title = [headers.title, this.config.title].join(" | ");
				return Promise.all(this.children.map(child => child.readHeaders()));
			});
	}

	body() {
		return colonParse(this.file).then(({ body }) => body);
	}
}

module.exports = Page;
