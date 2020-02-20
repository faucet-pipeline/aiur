module.exports = class SnippetWrapper {
	constructor({ assetManager, vendor }) {
		this.styles = (vendor.styles || []).slice();
		this.scripts = (vendor.scripts || []).slice();

		let manifest = assetManager.manifest.toJSON();
		Object.values(manifest).forEach(targetAsset => {
			if(targetAsset.includes("snippet") && targetAsset.endsWith("css")) {
				this.styles.push({ href: targetAsset });
			} else if(targetAsset.includes("snippet") && targetAsset.endsWith("js")) {
				this.scripts.push({ src: targetAsset });
			}
		});
	}

	// TODO: consider using lit-html or something like that
	wrap(snippet) {
		let stylesBlock = this.styles.map(style =>
			`<link rel="stylesheet" ${attributeList(style)}>`).join("\n");
		let scriptsBlock = this.scripts.map(script =>
			`<script ${attributeList(script)}></script>`).join("\n");

		return `<!doctype html>
<html>
<head>
${stylesBlock}
</head>
<body>
${snippet}
${scriptsBlock}
</body>
</html>`;
	}
};

function attributeList(attributes) {
	return Object.entries(attributes).map(([key, value]) => `${key}="${value}"`).join(" ");
}
