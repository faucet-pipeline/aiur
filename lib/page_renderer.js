let { Parser } = require("commonmark");
let HtmlRenderer = require("./html_renderer");

module.exports = class PageRenderer {
	constructor({ renderers, renderersConfigs, layout }) {
		this.reader = new Parser();
		this.writer = new HtmlRenderer();
		this.renderers = renderers;
		this.renderersConfigs = renderersConfigs;
		this.layout = layout;
		this.snippets = [];
	}

	async render(page) {
		await page.load();
		let parsed = this.reader.parse(page.body);
		let { html, snippets } = this.writer.render(parsed);
		this.snippets = this.snippets.concat(snippets.map(snippet =>
			Object.assign({ page }, snippet)));
		return this.layout(page, html);
	}

	renderedSnippets() {
		return Promise.all(this.snippets.map(snippet => this.renderSnippet(snippet)));
	}

	async renderSnippet({ page, slug, language, snippet }) {
		let renderer = this.renderers[language];
		let rendererConfig = this.renderersConfigs[language];
		if(!renderer) {
			throw new Error(`Styleguide ran across unknown language ${language} (renderer)`);
		}
		let html = await renderer(snippet, page.data, rendererConfig);
		return { html, page, slug };
	}

	// TODO:
	// function renderErrorPage(error) {
	// 	return `
	// 		<h1>An Error Occurred</h1>
	// 		<p>${error.message}</p>
	// 	`;
	// }
};
