/* global describe, it */
let generatePageTree = require("../lib/tree");
let Navigation = require("../lib/navigation");
let { assertSame, fixturesPath, fixturesDir } = require("./util");

describe("navigation", () => {
	it("should generate a navigation", async () => {
		let descriptors = require(fixturesPath("pages.js"));
		let tree = generatePageTree(descriptors, fixturesDir);
		await Promise.all(tree.map(async page => page.load()));

		let navigation = new Navigation({ baseURI: "/" });
		let result = navigation.generate(tree);
		assertSame(result, '<ul><li><a href="/">My Style Guide</a></li><li><a href="/atoms">Atoms</a><ul><li><a href="/atoms/button">Button</a></li><li><a href="/atoms/strong">strong</a></li></ul></li></ul>');
	});
});
