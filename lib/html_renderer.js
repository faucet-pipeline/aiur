let { HtmlRenderer } = require("commonmark");
let highlightSnippet = require("./highlight_snippet");

class ImprovedHtmlRenderer extends HtmlRenderer {
	render(...args) {
		this.snippets = [];
		let html = super.render(...args);
		return { html, snippets: this.snippets };
	}

	// overwriting an existing function that does not adhere to JS naming conventions
	// eslint-disable-next-line camelcase
	code_block(node) {
		this.lit(`<component-preview>
	<iframe src="${this.renderedBlockURI(node)}" class="rendered"></iframe>
	<pre>${this.highlightedBlock(node)}</pre>
</component-preview>`);
	}

	renderedBlockURI({ info, literal }) {
		let slug = `${this.snippets.length}.html`;
		this.snippets.push({ language: info, snippet: literal, slug });
		return slug;
	}

	highlightedBlock({ info, literal }) {
		return highlightSnippet(literal, info);
	}
}

module.exports = ImprovedHtmlRenderer;
