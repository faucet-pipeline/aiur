module.exports = async (navigation, manifest) => {
	return (page, content) => `<!doctype html>
  <html lang="${page.language}">
	<head>
	  <meta charset="utf-8">
	  <title>${page.title || ""}</title>
      <meta name="description" content="${page.description || ""}">
      <meta name="viewport" content="width=device-width,initial-scale=1">
	  <link href="${manifest.get("dist/style-aiur.css")}" rel="stylesheet">
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
