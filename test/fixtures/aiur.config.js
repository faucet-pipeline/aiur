"use strict";

exports.meta = {
	robots: "noindex"
};

exports.pages = {
	"": "./welcome.md",
	atoms: {
		file: "./atoms.md",
		children: {
			button: "./button/doc.md",
			strong: "./strong/doc.md"
		}
	}
};

exports.language = "en";
