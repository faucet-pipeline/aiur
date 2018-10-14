function generateNavigation(pages) {
	if(pages.length === 0) {
		return "";
	}

	let lis = pages.map(page =>
		`<li>${generateTitle(page)}${generateNavigation(page.children)}</li>`).
		join("\n");

	return `<ul>${lis}</ul>`;
}

function generateTitle(page) {
	return page.file ? `<a href="/${page.slug}">${page.heading}</a>` :
		`${page.heading}`;
}

module.exports = generateNavigation;
