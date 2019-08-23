"use strict";

exports.title = "Example Styleguide";
exports.language = "en";

// TODO is this a good idea?
// exports.styles = [{
// 	sass: "./components/index.scss"
// }];

// TODO configs for languages
// exports.language = {
// 	thymeleaf: {
//
// 	}
// }

exports.pages = {
	"": "./components/welcome.md",
	atoms: {
		file: "./components/atoms.md",
		children: {
			button: "./components/button/doc.md",
			strong: "./components/strong/doc.md",
			thing: {
				file: "./components/thing/thing.md",
				data: "./components/thing/thing.json"
			}
		}
	}
};
