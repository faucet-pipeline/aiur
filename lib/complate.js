let path = require("path");
let { readFileSync } = require("fs");
let { VirtualBundle } = require("faucet-pipeline-js/lib/bundle/virtual");
let requireFromString = require("require-from-string");

// a plugin loads the highlighter for the language
let loadLanguages = require("prismjs/components/");
loadLanguages(["jsx"]);

let rendering = readFileSync(path.resolve(__dirname, "complateRendering.js"), "utf8");

let bundle = new VirtualBundle("./", {
	format: "CommonJS",
	jsx: { pragma: "createElement" }
}, {
	browsers: {}
});

module.exports = function(snippet) {
	return new Promise((resolve, reject) => {
		// TODO: FND has something more sophisticated somewhere
		let [ imports, macro ] = snippet.split("\n\n", 2);
		let viewCode = `${imports}\n${rendering}\nmodule.exports = () => render(${macro});`;

		bundle.compile(viewCode).then(({ code, error }) => {
			if(error) {
				return reject(error);
			}

			let render = requireFromString(code);
			render().then(resolve);
		});
	});
};
