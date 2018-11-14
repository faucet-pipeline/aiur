let { HtmlRenderer } = require("commonmark");
let highlightSnippet = require("./highlight_snippet");

class ImprovedHtmlRenderer extends HtmlRenderer {
	render(...args) {
		this.examples = [];
		let html = super.render(...args);
		return { html, examples: this.examples };
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
		let slug = `${this.examples.length}.html`;
		this.examples.push({ language: info, snippet: literal, slug });
		return slug;
	}

	highlightedBlock({ info, literal }) {
		return highlightSnippet(literal, info);
	}
}

module.exports = ImprovedHtmlRenderer;
