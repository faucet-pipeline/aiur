let path = require("path");
let assert = require("assert");

let FIXTURES = path.resolve(__dirname, "fixtures");
let EXPECTATIONS = path.resolve(__dirname, "expectations");

exports.MockAssetManager = class MockAssetManager {
	constructor(referenceDir) {
		this.referenceDir = referenceDir;
	}

	// TODO: this is currently a private method
	_report() {
	}
};

exports.assertSame = assert.strictEqual;
exports.assertDeep = assert.deepStrictEqual;

exports.fixturesPath = filepath => path.resolve(FIXTURES, filepath);
exports.fixturesDir = FIXTURES;

exports.expectationsPath = filepath => path.resolve(EXPECTATIONS, filepath);
exports.expectationsDir = EXPECTATIONS;
