module.exports = page => {
	let metas = "";
	metas += page.slug ? page.slug : "";
	metas += page.version ? " v" + page.version : "";
	metas += page.tags ? " • tags: " + page.tags : "";
	if(metas !== "") {
		return `<div class="aiur-doc-meta">${metas}</div>`;
	}
	return "";
};
