module.exports = (tree, manifest) => {
	let navigation = generateNavigation(tree);

	return (page, content) => `<!doctype html>
  <html lang="${page.language}">
	<head>
	  <meta charset="utf-8">
	  <title>${page.title}</title>
      <meta name="description" content="${page.description}">
      <meta name="viewport" content="width=device-width,initial-scale=1">
	  <link href="${manifest.get("dist/style.css")}" rel="stylesheet">
	</head>
	<body>
	  <nav>${navigation}</nav>
	  <main>
		  <h1>${page.title}</h1>
		  ${content}
	  </main>
	</body>
  </html>`;
};

// TODO: Implement a real generateNavigation function
function generateNavigation(tree) {
	return `<ul>
		<li><a href="/">Home</a></li>
		<li>
			<a href="/atoms">Atoms</a>
			<ul>
				<li><a href="/atoms/button">Button</a></li>
				<li><a href="/atoms/strong">Strong</a></li>
			</ul>
		</li>
	</ul>`;
}

// function generateNavigation(pages) {
// 	if(pages.length === 0) {
// 		return "";
// 	}

// 	let lis = pages.map(page =>
// 		`<li>${generateTitle(page)}${generateNavigation(page.children)}</li>`).
// 		join("\n");

// 	return `<ul>${lis}</ul>`;
// }

// function generateTitle(page) {
// 	return page.file ? `<a href="/${page.slug}">${page.heading}</a>` :
// 		`${page.heading}`;
// }
