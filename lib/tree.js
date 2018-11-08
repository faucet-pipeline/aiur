let Page = require("./page");
let resolvePath = require("faucet-pipeline-core/lib/util/resolve");

module.exports = generatePageTree;

// turns a recursive tree of `slug: { file, children }` entries into a map of
// corresponding `Page` nodes, whereas each page might contain a map of children
function generatePageTree(descriptors, referenceDir) {
	let root = new Map();
	Object.entries(descriptors).forEach(([slug, descriptor]) => {
		let page = generatePage(slug, descriptor, referenceDir);
		root.set(slug, page);
	});
	return root;
}

// turns a descriptor object into a `Page`, recursively resolving child pages
function generatePage(slug, descriptor, referenceDir) {
	if(descriptor.substr) { // shortcut
		descriptor = { file: descriptor };
	}
	let { file, children } = descriptor;

	let filepath = resolvePath(file, referenceDir);
	return new Page(slug, filepath, children && generatePageTree(children, referenceDir));
}
