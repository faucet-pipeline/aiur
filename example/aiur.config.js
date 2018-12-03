"use strict";

exports.title = "Example Styleguide";
exports.language = "en";

exports.pages = {
	"": "./components/welcome.md",
	atoms: {
		file: "./components/atoms.md",
		children: {
			button: "./components/button/doc.md",
			strong: "./components/strong/doc.md"
		}
	}
};
