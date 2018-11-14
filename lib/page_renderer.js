let { Parser } = require("commonmark");
let HtmlRenderer = require("./html_renderer");

// TODO: Write tests
module.exports = class PageRenderer {
	constructor({ renderers, layout }) {
		this.reader = new Parser();
		this.writer = new HtmlRenderer();
		this.renderers = renderers;
		this.layout = layout;
		this.examples = [];
	}

	async render(page) {
		await page.load();
		let parsed = this.reader.parse(page.body);
		let { html, examples } = this.writer.render(parsed);
		this.examples = this.examples.concat(examples.map(example =>
			Object.assign({ page }, example)));
		return this.layout(page, html);
	}

	renderedExamples() {
		return Promise.all(this.examples.map(example => this.renderExample(example)));
	}

	async renderExample({ page, slug, language, snippet }) {
		let renderer = this.renderers[language];
		if(!renderer) {
			throw new Error(`Styleguide ran across unknown language ${language} (renderer)`);
		}
		let html = await renderer(snippet);
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
