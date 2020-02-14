/* global HTMLElement */
export default class ComponentPreview extends HTMLElement {
	connectedCallback() {
		this._previewFrame = this.querySelector("." + this.getAttribute("preview")) ||
			this.querySelector("#" + this.getAttribute("preview"));
		this.setDimensions();
		this._previewFrame.addEventListener("load", event => this.fitPreviewFrame());
	}

	setDimensions() {
		let height = this.getAttribute("height");
		let width = this.getAttribute("width");
		if(height) this._previewFrame.style.height = parseInt(height) + "px";
		if(width) this._previewFrame.style.width = parseInt(width) + "px";
	}

	fitPreviewFrame() {
		if(!this.hasAttribute("height")) {
			let frameBody = this._previewFrame.contentWindow.document.body;
			let bodyDisplay = frameBody.style.display;
			frameBody.style.display = "inline-block";
			let height = frameBody.offsetHeight;
			frameBody.style.display = bodyDisplay;
			// TODO: fix me: 16, a magic number for now to prevent scrollbars
			this._previewFrame.style.height = height + 16 + "px";
		}
	}
}
