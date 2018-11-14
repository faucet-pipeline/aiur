/* global describe, it, beforeEach, afterEach */
let Site = require("../lib/site");
let { assertSame, fixturesPath, fixturesDir, expectationsPath, MockAssetManager } = require("./util");
let fs = require("fs");
let assert = require("assert");
let { promisify } = require("util");
let rimraf = promisify(require("rimraf"));

let readFile = promisify(fs.readFile);

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
		return rimraf(fixturesPath("dist"));
	});

	it("generates HTML files", async () => {
		let config = {
			source: "./pages.js",
			target: "./dist" // FIXME: use temporary directory instead
		};

		let site = new Site(config, assetManager);
		await site.generate();
		// XXX: inefficient and somewhat innacurate (due to potential unwanted
		//      files); check directory hierarchy instead
		assertSame(await readFile(fixturesPath("dist/index.html"), "utf8"),
				await readFile(expectationsPath("index.html"), "utf8"));

		assertSame(await readFile(fixturesPath("dist/atoms/index.html"), "utf8"),
				await readFile(expectationsPath("atoms/index.html"), "utf8"));

		assertSame(await readFile(fixturesPath("dist/atoms/index.html"), "utf8"),
				await readFile(expectationsPath("atoms/index.html"), "utf8"));

		assertSame(await readFile(fixturesPath("dist/atoms/button/index.html"), "utf8"),
				await readFile(expectationsPath("atoms/button/index.html"), "utf8"));

		assertSame(await readFile(fixturesPath("dist/atoms/button/0.html"), "utf8"),
				await readFile(expectationsPath("atoms/button/0.html"), "utf8"));

		assertSame(await readFile(fixturesPath("dist/atoms/strong/index.html"), "utf8"),
				await readFile(expectationsPath("atoms/strong/index.html"), "utf8"));

		assertSame(await readFile(fixturesPath("dist/atoms/strong/0.html"), "utf8"),
				await readFile(expectationsPath("atoms/strong/0.html"), "utf8"));
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
