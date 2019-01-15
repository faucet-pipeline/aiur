/* global describe, it */
let PageRenderer = require("../lib/page_renderer");
let { assertSame } = require("./util");

class FauxPage {
	constructor({ body }) {
		this.body = body;
	}

	async load() {
	}
}

describe("page renderer", () => {
	it("should render a simple page", async () => {
		let renderers = [];
		let layout = (_, x) => x;
		let page = new FauxPage({ body: "**foo**" });
		let pageRenderer = new PageRenderer({ renderers, layout });
		let result = await pageRenderer.render(page);

		assertSame(result.trim(), "<p><strong>foo</strong></p>");
	});

	it("should render a page with a snippet", async () => {
		let renderers = { html: x => `rendered: ${x}` };
		let layout = (_, x) => x;
		let page = new FauxPage({ body: "```html\n<hr>\n```" });
		let pageRenderer = new PageRenderer({ renderers, layout });
		let result = await pageRenderer.render(page);

		assertSame(result.trim(), '<component-preview>\n\t<iframe src="0.html" class="rendered"></iframe>\n\t<pre><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>hr</span><span class="token punctuation">></span></span>\n</pre>\n</component-preview>');

		let renderedSnippets = await pageRenderer.renderedSnippets();
		assertSame(renderedSnippets.length, 1);

		let renderedSnippet = renderedSnippets[0];
		assertSame(renderedSnippet.html.trim(), "rendered: <hr>");
		assertSame(renderedSnippet.page, page);
		assertSame(renderedSnippet.slug, "0.html");
	});
});
