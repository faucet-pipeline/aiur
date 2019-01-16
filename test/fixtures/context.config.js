"use strict";

let config = require("./aiur.config.js");
let { context } = require("./env.js");

module.exports = exports = Object.assign({}, config); // inherit from default config
// expose context object, making it accessible to aiur
exports.context = context;
// implement URI resolver
context.uri = resolveURI;

function resolveURI(type, ...args) {
	switch(type) {
	case "pages":
		var [slug] = args; // eslint-disable-line no-var
		return context.pageURI(slug);
	case "static-assets":
		var [filename] = args; // eslint-disable-line no-var
		return context.assetURI(filename);
	default:
		throw new Error(`invalid URI: ${type}`);
	}
}
