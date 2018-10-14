let generateNavigation = require("./generate_navigation");

module.exports = pages => {
	let navigation = generateNavigation(pages);

	return (page, content) => `<!doctype html>
  <html lang="${page.language}">
	<head>
	  <meta charset="utf-8">
	  <title>${page.title}</title>
      <meta name="description" content="${page.description}">
      <meta name="viewport" content="width=device-width,initial-scale=1">
	  <link href="/style.css" rel="stylesheet">
	  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism.css" integrity="sha256-/Kfdz9pXGPe+bFF+TtxHqbg6F9c3Rb0jN48uy+2b/do=" crossorigin="anonymous" />
	</head>
	<body>
	  <nav>${navigation}</nav>
	  <main>
		  <h1>${page.heading}</h1>
		  ${content}
	  </main>
	</body>
  </html>`;
};
