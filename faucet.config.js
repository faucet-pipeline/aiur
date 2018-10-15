"use strict";
let path = require("path");

module.exports = {
	styleguide: [{
		source: "./pages.json",
		target: "./dist",
		port: 8080,
		title: "Example Styleguide",
		description: "This is an example styleguide"
	}],
	static: [{
		source: "./lib/style.css",
		target: "./dist/style.css"
	}],
	watchDirs: ["./pages.json", "./components"],

	// this will not be necessary when this is released
	plugins: {
		styleguide: {
			plugin: path.resolve("./lib"),
			bucket: "markup"
		}
	}
};
