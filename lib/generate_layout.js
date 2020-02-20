let StatusBadge = require("./templates/StatusBadge");
let Meta = require("./templates/Meta");

module.exports = async (navigation, manifest) => {
	return (page, content) => `<!doctype html>
<html lang="${page.language}">
	<head>
		<meta charset="utf-8">
		<title>${page.title || ""}</title>
		<meta name="description" content="${page.description || ""}">
		<meta name="viewport" content="width=device-width,initial-scale=1">
		<link href="${manifest.get("style-aiur.css")}" rel="stylesheet">
	</head>
	<body id="aiur">
		<nav id="aiur-nav">
			<resize-handle id="aiur-nav-resize-handle" for="aiur-nav" direction="x" remember></resize-handle>
			${navigation}
		</nav>
		<main id="aiur-doc">${Meta(page)}
		<h1>${page.heading}${StatusBadge(page.status)}</h1>
		${content}
		</main>
		<script src="${manifest.get("script-aiur.js")}"></script>
	</body>
</html>`;
};
