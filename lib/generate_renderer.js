let { Parser } = require("commonmark");
let HtmlRenderer = require("./html_renderer");

module.exports = function(renderers, target, assetManager) {
	let reader = new Parser();
	let writer = new HtmlRenderer({ renderers });

	return function(page, layout) {
		return page.body().
			then(body => {
				let parsed = reader.parse(body);
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
