let path = require("path");
let assert = require("assert");

let FIXTURES = path.resolve(__dirname, "fixtures");

exports.assertSame = assert.strictEqual;
exports.assertDeep = assert.deepStrictEqual;

exports.fixturesPath = filepath => path.resolve(FIXTURES, filepath);
exports.fixturesDir = FIXTURES;
