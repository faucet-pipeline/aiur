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

		assertSame(result.trim(), `<tabs-control role="tablist">
	<button role="tab" aria-selected="true" aria-controls="_0-html-frame">
		Preview
	</button>
	<button role="tab" aria-selected="false" aria-controls="_0-html-pre">
		Source
	</button>
	<button role="tab" aria-selected="false" aria-controls="_0-html-post">
		HTML
	</button>
</tabs-control>
<component-preview preview="rendered" class="component-preview" >
	<iframe id="_0-html-frame" class="component-preview-frame rendered" src="0.html"></iframe>
	<pre hidden id="_0-html-pre" class="component-preview-pre-code"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>hr</span><span class="token punctuation">></span></span>
</pre>
	<external-text hidden id="_0-html-post" class="component-preview-post-code" src="0.html" wrap="pre"></external-text>
</component-preview>`);

		let renderedSnippets = await pageRenderer.renderedSnippets();
		assertSame(renderedSnippets.length, 1);

		let renderedSnippet = renderedSnippets[0];
		assertSame(renderedSnippet.html.trim(), "rendered: <hr>");
		assertSame(renderedSnippet.page, page);
		assertSame(renderedSnippet.slug, "0.html");
	});
});
