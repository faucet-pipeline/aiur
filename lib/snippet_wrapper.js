// TODO: consider using lit-html or something like that
let wrap = (snippet, stylesBlock, scriptsBlock) => `<!doctype html>
<html>
<head>
${stylesBlock}
</head>
<body>
${snippet}
${scriptsBlock}
</body>
</html>`;

function generateStylesBlock(styles) {
	if(styles) {
		return styles.map(style => `<link rel="stylesheet" ${Object.keys(style).map(styleAttrKey => `${styleAttrKey}="${style[styleAttrKey]}"`).join(" ")}>`).join("\n");
	}
	return "";
}

function generateScriptsBlock(scripts) {
	if(scripts) {
		return scripts.map(script => `<script type="text/javascript" ${Object.keys(script).map(scriptAttrKey => `${scriptAttrKey}="${script[scriptAttrKey]}"`).join(" ")}></script>`).join("\n");
	}
	return "";
}

module.exports = class SnippetRenderer {
	constructor({ targetAssets, vendorAssets }) {
		let assets = {
			styles: [],
			scripts: []
		};

		if(vendorAssets.styles) {
			assets.styles = assets.styles.concat(vendorAssets.styles);
		}

		if(vendorAssets.scripts) {
			assets.scripts = assets.scripts.concat(vendorAssets.scripts);
		}

		targetAssets.forEach(targetAsset => {
			if(targetAsset.indexOf("style-guide") > -1) {
				assets.styles.push({ href: targetAsset });
			} else if(targetAsset.indexOf("script-guide") > -1) {
				assets.scripts.push({ src: targetAsset });
			}
		});

		this.stylesBlock = generateStylesBlock(assets.styles) || "";
		this.scriptsBlock = generateScriptsBlock(assets.scripts) || "";
	}

	wrap(snippet) {
		return wrap(snippet, this.stylesBlock, this.scriptsBlock);
	}
};
