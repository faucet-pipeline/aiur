/* global describe, it */
let generatePageTree = require("../lib/tree");
let { assertDeep, assertSame, fixturesPath, fixturesDir } = require("./util");

describe("page hierarchy", () => {
	it("should turn page descriptors into a tree of pages", async () => {
		let descriptors = require(fixturesPath("pages.js"));
		let tree = generatePageTree(descriptors, fixturesDir);

		assertSame(tree.size, 2);
		assertDeep(Array.from(tree.keys()), ["", "atoms"]);

		let page = tree.get("");
		assertSame(page.slug, "");
		assertSame(page.filepath, fixturesPath("welcome.md"));
		assertSame(page.children, null);

		page = tree.get("atoms");
		assertSame(page.slug, "atoms");
		assertSame(page.filepath, fixturesPath("atoms.md"));
		assertSame(page.children.size, 2);
		assertDeep(Array.from(page.children.keys()), ["button", "strong"]);
		await page.load();
		assertSame(page.title, "Atoms");
		assertSame(page.body, "indivisible units");

		let sub = page.children.get("button");
		assertSame(sub, page.getChild("button"));
		assertSame(sub.slug, "button");
		assertSame(sub.filepath, fixturesPath("button/doc.md"));
		assertSame(sub.children, null);

		sub = page.getChild("strong");
		assertSame(sub.slug, "strong");
		assertSame(sub.filepath, fixturesPath("strong/doc.md"));
		assertSame(sub.children, null);
	});
});
