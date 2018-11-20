"use strict";
let path = require("path");

module.exports = {
	styleguide: [{
		source: require("./pages"),
		target: "./dist",
		renderers: {
			html: require("./lib/html"),
			jsx: require("./lib/complate")
		}
	}],
	sass: [{
		source: "./lib/style.scss",
		target: "./dist/style.css"
	}],
	watchDirs: ["./pages.json", "./components", "./lib"],

	// TODO: this will be read from the site configuration
	manifest: {
		baseURI: "/",
		webRoot: "./dist"
	},

	// this will not be necessary when this is released
	plugins: {
		styleguide: {
			plugin: path.resolve("./lib"),
			bucket: "markup"
		}
	}
};
