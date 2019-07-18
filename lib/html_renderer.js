let { HtmlRenderer } = require("commonmark");
let highlightSnippet = require("./highlight_snippet");
let parse5 = require("parse5");

class ImprovedHtmlRenderer extends HtmlRenderer {
	render(...args) {
		this.snippets = [];
		let html = super.render(...args);
		return { html, snippets: this.snippets };
	}

	// overwriting an existing function that does not adhere to JS naming conventions
	// eslint-disable-next-line camelcase
	code_block(node) {

		let params = {};
		let languageDefinition = node.info.trimEnd();
		let languageDefinitionEnd = languageDefinition.indexOf(" ");
		if (languageDefinitionEnd !== -1) {
			let language = languageDefinition.slice(0, languageDefinitionEnd);
			params.raw = languageDefinition.slice(languageDefinitionEnd, languageDefinition.length)

			params.parsed = parse5.parseFragment("<dummy-tag " + params.raw + " />").childNodes[0].attrs;
			params.string = params.parsed.map(attr => ` ${attr.name}="${attr.value}"`).join("");

			// reassign language without parameter definitions
			// to avoid problems in further processing (3rd party libs)
			node.info = language;
		}

		this.lit(`<component-preview${params.string}>
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
