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
		let delimiter = "\n\n";
		let [imports, ...view] = snippet.split(delimiter);
		view = view.join(delimiter);
		view = `${imports}\n${rendering}\nmodule.exports = () => render(${view});`;

		bundle.compile(view).then(({ code, error }) => {
			if(error) {
				return reject(error);
			}

			let render = requireFromString(code);
			render().then(resolve);
		});
	});
};
