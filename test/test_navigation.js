let generatePageTree = require("../lib/tree");
let Navigation = require("../lib/navigation");
let { assertSame, fixturesPath, fixturesDir } = require("./util");
let { describe, it } = require("node:test");

describe("navigation", () => {
	it("should generate a navigation", async () => {
		let { pages } = require(fixturesPath("aiur.config.js"));
		let tree = generatePageTree({ pages }, fixturesDir);
		await Promise.all(tree.map(async page => page.load()));

		let navigation = new Navigation({ baseURI: "/" });
		let result = navigation.generate(tree);
		assertSame(result, "<ul><li><a href=\"/\">My Style Guide</a></li><li><a href=\"/atoms/\">Atoms</a><ul><li data-tags=\"clickable, please-review\"><a href=\"/atoms/button/\">Button<span class=\"aiur-status aiur-status-wip\">wip</span></a></li><li><a href=\"/atoms/strong/\">strong</a></li></ul></li></ul>");
	});
});
