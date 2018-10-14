class Page {
	constructor({ title, slug, file, children }, config) {
		this.description = config.description || "Styleguide";
		this.language = config.language || "en";
		this.heading = title;
		this.title = [title, config.title].join(" | ");
		this.slug = slug;
		this.file = file;
		this.children = (children || []).map(child => {
			child.slug = `${slug}/${child.slug}`;
			return new Page(child, config);
		});
	}
}

module.exports = Page;
