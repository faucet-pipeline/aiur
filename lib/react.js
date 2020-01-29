let { VirtualBundle } = require("faucet-pipeline-js/lib/bundle/virtual");

let bundle = new VirtualBundle("./", {
	jsx: { pragma: "React.createElement" },
	externals: {
		react: "React",
		"react-dom": "ReactDOM",
		"prop-types": "PropTypes"
	}
}, {
	browsers: {}
});

module.exports = function(snippet) {
	return new Promise((resolve, reject) => {
		// TODO: FND has something more sophisticated somewhere
		let [imports, macro] = snippet.split("\n\n", 2);

		let viewCode = renderMacro(macro, imports, "root");

		bundle.compile(viewCode).then(({ code, error }) => {
			if(error) {
				return reject(error);
			}

			resolve(`
			  <!doctype html>
			  <html lang="en">
			  <head>
			    <meta charset="utf-8">
				<title>Example</title>
			  </head>
			  <body>
			  <div id="root"></div>
			  <script
			    src="https://unpkg.com/react@16/umd/react.development.js"
			    crossorigin></script>
			  <script
			    src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"
			    crossorigin></script>
			  <script
				src="https://unpkg.com/prop-types@15.7/prop-types.js"
				crossorigin></script>

			  <script>${code}</script>
			  </body>
			  </html>
			`);
		});
	});
};

function renderMacro(macro, imports, rootId) {
	return `${imports}
		import ReactDOM from "react-dom";
		ReactDOM.render(${macro}, document.getElementById("${rootId}"));`;
}
