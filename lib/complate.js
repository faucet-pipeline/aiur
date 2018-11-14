let path = require("path");
let { readFileSync } = require("fs");
let { VirtualBundle } = require("faucet-pipeline-js/lib/bundle/virtual");
let requireFromString = require("require-from-string");
let rendering = readFileSync(path.resolve(__dirname, "complate_rendering.js"), "utf8");

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
