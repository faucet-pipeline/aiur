let { Parser } = require("commonmark");
let HtmlRenderer = require("./html_renderer");

module.exports = function(renderers, target, assetManager) {
	let reader = new Parser();

	return function(page, layout) {
		let writer = new HtmlRenderer({ page, renderers });

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
			}).
			then(() => {
				return Promise.all(writer.examples.map(renderExample => {
					renderExample().then(({ rendered, url }) => {
						return assetManager.writeFile(`${target}/${url}`,
								rendered);
					});
				}));
			});
	};
};

function renderErrorPage(error) {
	return `
		<h1>An Error Occurred</h1>
		<p>${error.message}</p>
	`;
}
