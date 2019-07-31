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
		let trailingSlash = node.slug && node.slug.slice(-1) !== "/" ? "/" : "";
		let tagsTag = node.tags ? ` data-tags="${node.tags}"` : "";
		let statusBadge = ["prototype", "wip", "ready"].indexOf(node.status) > -1 ? `<span class="aiur-status aiur-status-${node.status}">${node.status}</span>` : "";
		return `<li${tagsTag}><a href="${this.baseURI}${node.slug}${trailingSlash}">${node.heading}</a>${children}${statusBadge}</li>`;
	}

	// generate the markup for a list of nodes, overwrite at will
	list(renderedNodes) {
		return `<ul>${renderedNodes.join("")}</ul>`;
	}
};
