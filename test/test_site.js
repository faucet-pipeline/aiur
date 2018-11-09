/* global describe, it, beforeEach, afterEach */
let Site = require("../lib/site");
let { assertSame, fixturesPath, fixturesDir, MockAssetManager } = require("./util");
let assert = require("assert");

let assetManager = new MockAssetManager(fixturesDir);

describe("site model", () => {
	let { exit } = process;
	beforeEach(() => {
		process.exit = code => {
			throw new Error(`exit ${code}`);
		};
	});
	afterEach(() => {
		process.exit = exit;
	});

	it("enforces essential configuration", async () => {
		let config = {};

		let fn = () => new Site(config, assetManager);
		assert.throws(fn, /exit 1/); // aborts due to missing `source` configuration

		config.source = "./pages.js";
		assert.throws(fn, /exit 1/); // aborts due to missing `target` configuration

		config.target = "dist";
		assert.throws(fn, /exit 1/); // aborts due to non-relative `target` configuration

		config.target = "./dist";
		let site = fn();
		assertSame(site.source, fixturesPath("pages.js"));
		assertSame(site.target, fixturesPath("dist"));
		assertSame(`${site}`, `<Site \`${fixturesPath("pages.js")}\`>`);
	});

	it("loads page hierarchy from file", async () => {
		let config = {
			source: "./pages.js",
			target: "./dist"
		};

		let site = new Site(config, assetManager);
		await site.load();
		assertSame(`${site}`, `<Site \`${fixturesPath("pages.js")}\`>`);
	});

	it("generates URIs", async () => {
		let config = {
			source: "./pages.js",
			target: "./dist"
		};

		let site = new Site(config, assetManager);
		assertSame(site.pageURI("atoms/button"), "/atoms/button.html");
		assertSame(site.assetURI("bundle.css"), "/assets/bundle.css");

		config.baseURI = "/path/to";
		site = new Site(config, assetManager);
		assertSame(site.pageURI("atoms/button"), "/path/to/atoms/button.html");
		assertSame(site.assetURI("styles/bundle.css"),
				"/path/to/assets/styles/bundle.css");

		config.baseURI += "/"; // trailing slash
		config.assetPath = "/static/";
		site = new Site(config, assetManager);
		assertSame(site.pageURI("atoms/button"), "/path/to/atoms/button.html");
		assertSame(site.assetURI("scripts/bundle.js"),
				"/path/to/static/scripts/bundle.js");
	});
});
