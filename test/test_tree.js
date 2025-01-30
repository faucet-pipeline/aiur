let generatePageTree = require("../lib/tree");
let { assertDeep, assertSame, fixturesPath, fixturesDir } = require("./util");
let { repr } = require("faucet-pipeline-core/lib/util");
let { describe, it } = require("node:test");

describe("page hierarchy", () => {
	it("should turn page descriptors into a tree of pages", async () => {
		let { pages } = require(fixturesPath("aiur.config.js"));
		let tree = generatePageTree({ pages }, fixturesDir);

		assertSame(tree.children.size, 2);
		assertDeep(Array.from(tree.children.keys()), ["", "atoms"]);

		let page = tree.getPage("");
		assertSame(page.slug, "");
		assertSame(page.sourcePath, fixturesPath("welcome.md"));
		assertSame(page.children, null);

		page = tree.getChild("atoms");
		assertSame(page.slug, "atoms");
		assertSame(page.sourcePath, fixturesPath("atoms.md"));
		assertSame(page.children.size, 2);
		assertDeep(Array.from(page.children.keys()), ["button", "strong"]);
		await page.load();
		assertSame(page.title, "Atoms");
		assertSame(page.body, "indivisible units");

		let sub = page.getChild("button");
		assertSame(sub, page.getChild("button"));
		assertSame(sub.slug, "atoms/button");
		assertSame(sub.sourcePath, fixturesPath("button/doc.md"));
		assertSame(sub.children, null);

		sub = page.getChild("strong");
		assertSame(sub.slug, "atoms/strong");
		assertSame(sub.sourcePath, fixturesPath("strong/doc.md"));
		assertSame(sub.children, null);

		assertSame(tree.getPage("atoms/strong"), sub);
		let filepaths = new Set(["welcome.md", "atoms.md", "button/doc.md",
			"strong/doc.md"].map(fixturesPath));
		assertDeep(new Set(tree._pages.keys()), filepaths);
		filepaths.forEach(filepath => {
			assertSame(tree.includesPage(filepath), true,
					`tree does not include ${repr(filepath, false)}`);
		});
	});
});
