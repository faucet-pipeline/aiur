"use strict";

exports.title = "Example Styleguide";
exports.language = "en";
exports.meta = {
	robots: "noindex"
};

exports.vendor = {
	styles: [{
		crossorigin: "anonymous",
		integrity: "sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU",
		href: "https://use.fontawesome.com/releases/v5.5.0/css/all.css"
	}],
	scripts: []
};

exports.pages = {
	"": {
		file: "./components/welcome.md",
		children: {
			languages: {
				file: "./languages/languages.md",
				data: "./languages/languages.data.js"
			}
		}
	},
	atoms: {
		file: "./components/atoms.md",
		children: {
			button: "./components/button/doc.md",
			strong: "./components/strong/doc.md"
		}
	}
};

exports.watchDirs = ["./components", "./languages"];
