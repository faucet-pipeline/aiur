let fs = require("fs");
let { promisify } = require("faucet-pipeline-core/lib/util");
let readFile = promisify(fs.readFile);
let { Parser } = require("commonmark");
let HtmlRenderer = require("./html_renderer");

module.exports = function(renderers, target, assetManager) {
	let reader = new Parser();
	let writer = new HtmlRenderer({ renderers });

	return function(page, layout) {
		return readFile(assetManager.resolvePath(page.file)).
			then(buf => {
				let parsed = reader.parse(buf.toString());
				let content = writer.render(parsed);
				return { content };
			}).
			catch(error => {
				let content = renderErrorPage(error);
				return { content, error };
			}).
			then(({ content, error }) => {
				return assetManager.writeFile(`${target}/${page.slug}/index.html`,
						layout(page, content), { error });
			});
	};
};

function renderErrorPage(error) {
	return `
		<h1>An Error Occurred</h1>
		<p>${error.message}</p>
	`;
}
