/* global describe, it, beforeEach, afterEach */
let Site = require("../lib/site");
let { assertSame, fixturesPath, fixturesDir, expectationsPath, MockAssetManager } = require("./util");
let fs = require("fs");
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

	let config = {
		source: fixturesPath("./aiur.config.js"),
		target: "./dist",
		baseURI: "/"
	};

	it("generates index.html file", async () => {
		let site = new Site(config, assetManager);
		await site.generate();
		// XXX: inefficient and somewhat innacurate (due to potential unwanted
		//      files); check directory hierarchy instead
		assertSame(await readFile(fixturesPath("dist/index.html"), "utf8"),
				await readFile(expectationsPath("index.html"), "utf8"));
	});

	it("generates dist/atoms/index.html file", async () => {
		let site = new Site(config, assetManager);
		await site.generate();
		assertSame(await readFile(fixturesPath("dist/atoms/index.html"), "utf8"),
				await readFile(expectationsPath("atoms/index.html"), "utf8"));
	});

	it("generates dist/atoms/button/index.html file", async () => {
		let site = new Site(config, assetManager);
		await site.generate();
		assertSame(await readFile(fixturesPath("dist/atoms/button/index.html"), "utf8"),
				await readFile(expectationsPath("atoms/button/index.html"), "utf8"));
	});

	it("generates dist/atoms/button/0.html file", async () => {
		let site = new Site(config, assetManager);
		await site.generate();
		assertSame(await readFile(fixturesPath("dist/atoms/button/0.html"), "utf8"),
				await readFile(expectationsPath("atoms/button/0.html"), "utf8"));
	});

	it("generates dist/atoms/strong/index.html file", async () => {
		let site = new Site(config, assetManager);
		await site.generate();
		assertSame(await readFile(fixturesPath("dist/atoms/strong/index.html"), "utf8"),
				await readFile(expectationsPath("atoms/strong/index.html"), "utf8"));
	});

	it("generates dist/atoms/strong/0.html file", async () => {
		let site = new Site(config, assetManager);
		await site.generate();
		assertSame(await readFile(fixturesPath("dist/atoms/strong/0.html"), "utf8"),
				await readFile(expectationsPath("atoms/strong/0.html"), "utf8"));
	});
});
