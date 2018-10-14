let { HtmlRenderer } = require("commonmark");
let Prism = require("prismjs");

class ImprovedHtmlRenderer extends HtmlRenderer {
	// overwriting an existing function that does not adhere to JS naming conventions
	// eslint-disable-next-line camelcase
	code_block(node) {
		let highlightedTemplate = this.highlightTemplate(node);
		let renderedTemplate = this.renderTemplate(node);

		this.lit(`<component-preview>
		  <div class="rendered">${renderedTemplate}</div>
		  <pre>${highlightedTemplate}</pre>
		</component-preview>`);
	}

	highlightTemplate({ info, literal }) {
		let language = Prism.languages[info];
		if(!language) {
			throw new Error(`Styleguide ran accross unknown language ${info} (highlighter)`);
		}
		return Prism.highlight(literal, language, info);
	}

	renderTemplate({ info, literal }) {
		let renderer = this.options.renderers[info];
		if(!renderer) {
			throw new Error(`Styleguide ran accross unknown language ${info} (renderer)`);
		}
		return renderer(literal);
	}
}

module.exports = ImprovedHtmlRenderer;
