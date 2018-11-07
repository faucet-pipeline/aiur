"use strict";
let path = require("path");

module.exports = {
	styleguide: [{
		source: "./pages.js",
		target: "./dist",
		port: 8080,
		title: "Example Styleguide",
		description: "This is an example styleguide"
	}],
	sass: [{
		source: "./lib/style.scss",
		target: "./dist/style.css"
	}],
	watchDirs: ["./pages.json", "./components", "./lib"],

	// this will not be necessary when this is released
	plugins: {
		styleguide: {
			plugin: path.resolve("./lib"),
			bucket: "markup"
		}
	}
};
