let path = require("path");
let assert = require("assert");

let FIXTURES = path.resolve(__dirname, "fixtures");
let EXPECTATIONS = path.resolve(__dirname, "expectations");

class MockManifest {
	get(path) {
		return path.replace("dist", "");
	}

	toJSON() {
		return {
			"dist/style-guide-0.css": "style-guide-0.css",
			"dist/style-guide-1.css": "style-guide-1.css",
			"dist/script-guide-1.css": "script-guide-1.css"
		};
	}
}

exports.MockAssetManager = class MockAssetManager {
	constructor(referenceDir) {
		this.referenceDir = referenceDir;
		this.manifest = new MockManifest();
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
