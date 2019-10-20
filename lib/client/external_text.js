/* global HTMLElement, fetch */
// TODO use "find" attribute with css selector to extract parts of external page
// TODO overall proper embedding process ...

export default class ExternalText extends HTMLElement {
	connectedCallback() {
		this._wrapElementType = this.getAttribute("wrap");
		this._src = this.getAttribute("src");
		this._embedTarget = this;

		this.prepareEmbed();
		this.loadExternal();
	}

	prepareEmbed() {
		if(this._wrapElementType !== null) {
			let bed = document.createElement(this._wrapElementType);
			this.append(bed);
			this._embedTarget = bed;
		}
	}

	async loadExternal() {
		let response = await fetch(this._src);
		let externalText = await response.text();
		this.embedExternal(externalText);
	}

	embedExternal(body) {
		body = body.replace(/^<!DOCTYPE[^>[]*(\[[^]]*\])?>/gm, "").trim();
		body = body.replace(/(<!--.*?-->)|(<!--[\S\s]+?-->)|(<!--[\S\s]*?$)/g, "");
		if(body.includes("<body")) {
			body = body.replace("//").split("<body>")[1].split("</body>")[0].trim();
		}
		body = body.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
		this._embedTarget.innerText = body;
	}
}
