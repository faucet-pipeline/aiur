let Page = require("../lib/page");
let { assertSame, fixturesPath } = require("./util");
let { describe, it } = require("node:test");

describe("page model", () => {
	it("should load metadata from the corresponding file", async () => {
		let config = {
			language: "en",
			title: "My Style Guide",
			description: "A very good styleguide"
		};

		let filepath = fixturesPath("welcome.md");
		let page = new Page("", filepath, null, config);
		assertSame(page.slug, "");
		assertSame(page.sourcePath, filepath);
		assertSame(page.children, null);
		assertSame(page.language, undefined);
		assertSame(page.title, undefined);
		assertSame(page.description, undefined);
		await page.load();
		assertSame(page.language, "en");
		assertSame(page.title, "My Style Guide | My Style Guide");
		assertSame(page.description, "A very good styleguide");
		assertSame(page.body, "welcome to your style guide");

		filepath = fixturesPath("button/doc.md");
		page = new Page("button", filepath, null, config);
		assertSame(page.slug, "button");
		assertSame(page.sourcePath, filepath);
		assertSame(`${page}`, `<Page \`button\` \`${filepath}\`>`);
		await page.load();
		assertSame(page.language, "de");
		assertSame(page.title, "Button | My Style Guide");
		assertSame(page.description, "interactive widget");
		assertSame(`${page}`, `<Page \`button\` \`${filepath}\` resolved>`);

		filepath = fixturesPath("strong/doc.md");
		page = new Page("strong", filepath, null, config);
		page = await page.load();
		assertSame(page.language, "en");
		assertSame(page.title, "strong | My Style Guide");
		assertSame(page.description, "pretty strong component");
		page = await page.load(); // reload
		assertSame(page.language, "en");
	});
});
