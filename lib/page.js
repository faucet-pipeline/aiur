let fs = require("fs");
let { promisify } = require("faucet-pipeline-core/lib/util");
let readFile = promisify(fs.readFile);

class Page {
	constructor({ title, slug, file, children }, config, resolvePath) {
		this.description = config.description || "Styleguide";
		this.language = config.language || "en";
		this.heading = title;
		this.title = [title, config.title].join(" | ");
		this.slug = slug;
		this.file = file ? resolvePath(file) : false;
		this.children = (children || []).map(child => {
			child.slug = `${slug}/${child.slug}`;
			return new Page(child, config, resolvePath);
		});
	}

	body() {
		return readFile(this.file).then(buf => buf.toString());
	}
}

module.exports = Page;
