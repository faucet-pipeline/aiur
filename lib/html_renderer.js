let { HtmlRenderer } = require("commonmark");
let Prism = require("prismjs");

class ImprovedHtmlRenderer extends HtmlRenderer {
	constructor(...args) {
		super(...args);
		this.examples = [];
	}

	// overwriting an existing function that does not adhere to JS naming conventions
	// eslint-disable-next-line camelcase
	code_block(node) {
		let highlightedTemplate = this.highlightTemplate(node);
		let exampleURI = this.renderTemplate(node);

		this.lit(`<component-preview>
		  <iframe src="${exampleURI}" class="rendered"></iframe>
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
		let url = `/${this.options.page.slug}/${this.examples.length}.html`;
		let renderer = this.options.renderers[info];
		if(!renderer) {
			throw new Error(`Styleguide ran accross unknown language ${info} (renderer)`);
		}

		this.examples.push(() => renderer(literal).then(rendered => ({ rendered, url })));

		return url;
	}
}

module.exports = ImprovedHtmlRenderer;
