let Page = require("./page");
let resolvePath = require("faucet-pipeline-core/lib/util/resolve");

module.exports = generatePageTree;

// turns a recursive tree of `slug: { file, children }` entries into a map of
// corresponding `Page` nodes, whereas each page might contain a map of children
function generatePageTree(config, referenceDir, { root, parent } = {}) {
	let entries = new Map();
	let topLevel = !root;
	if(topLevel) {
		root = new Tree(entries);
	}

	Object.entries(config.pages).forEach(([slug, descriptor]) => {
		let page = generatePage(parent ? `${parent}/${slug}` : slug, descriptor,
				config, referenceDir, root);
		entries.set(slug, page);
	});

	return topLevel ? root : entries;
}

// turns a descriptor object into a `Page`, recursively resolving child pages
function generatePage(slug, descriptor, config, referenceDir, root) {
	if(descriptor.substr) { // shortcut
		descriptor = { file: descriptor };
	}
	let { file, children, data } = descriptor;
	let filepath = resolvePath(file, referenceDir);
	let datapath = data ? resolvePath(data, referenceDir) : data;
	let page = new Page(slug, filepath, children &&	generatePageTree({ ...config, pages: children }, referenceDir, { root, parent: slug }), config, datapath);
	root.index(page);
	return page;
}

class Tree {
	constructor(children) {
		this.children = children;
		this._pages = new Map(); // pages by source path
	}

	index(page) {
		this._pages.set(page.sourcePath, page);
	}

	has(...sourcePaths) {
		return sourcePaths.some(sourcePath => {
			return this.includesPage(sourcePath);
		});
	}

	includesPage(sourcePath) {
		return this._pages.has(sourcePath);
	}

	getPage(slugs) {
		if(!slugs.includes("/")) {
			return this.getChild(slugs);
		}

		return slugs.split("/").reduce((memo, slug) => {
			return memo.getChild(slug);
		}, this);
	}

	getChild(slug) {
		return this.children.get(slug);
	}

	// iterates over all pages, including nested ones
	map(callback) {
		let result = [];
		for(let page of this._pages.values()) {
			result.push(callback(page));
		}
		return result;
	}
}
