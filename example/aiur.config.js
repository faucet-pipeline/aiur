"use strict";

exports.title = "Example Styleguide";
exports.language = "en";

exports.sass = [{
	source: "./index.scss"
}];

exports.js = [{
	source: "./index.js"
}];

exports.vendor = {
	styles: [{
		crossorigin: "anonymous",
		integrity: "sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU",
		href: "https://use.fontawesome.com/releases/v5.5.0/css/all.css"
	}],
	scripts: []
};

exports.renderers = {
	lymetheaf: [
		require("lymetheaf"),
		{
			prefix: __dirname
		}
	]
}

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
			strong: "./components/strong/doc.md",
			thing: {
				file: "./components/thing/thing.md",
				data: "./components/thing/thing.json"
			}
		}
	}
};
