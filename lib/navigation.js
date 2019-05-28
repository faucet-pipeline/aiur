module.exports = class Navigation {
	constructor({ baseURI }) {
		this.baseURI = baseURI;
	}

	generate(tree) {
		let nodes = tree.children;
		if(!nodes) {
			return "";
		}

		let result = [];

		for(let element of nodes.values()) {
			result.push(this.item(element, this.generate(element)));
		}

		return this.list(result);
	}

	// generate the markup for a node and its rendered children, overwrite at will
	item(node, children) {
		const trailingSlash = node.slug.slice(-1) === "/" ? "" : "/";
		return `<li><a href="${this.baseURI}${node.slug}${trailingSlash}">${node.heading}</a>${children}</li>`;
	}

	// generate the markup for a list of nodes, overwrite at will
	list(renderedNodes) {
		return `<ul>${renderedNodes.join("")}</ul>`;
	}
};
