export default class ComponentPreview extends HTMLElement {
	connectedCallback() {
		this._previewFrame = this.querySelector("." + this.getAttribute("preview")) ||
			this.querySelector("#" + this.getAttribute("preview"));
		this.setHeight();
		this._previewFrame.addEventListener("load", event =>
			this.fitPreviewFrame(event.target, 16));
	}

	setHeight() {
		let height = this.getAttribute("height");
		if(height !== null) {
			this.style.Height = height + "px";
		}
	}

	fitPreviewFrame(frame, addHeight) {
		if(!this.hasAttribute("height")) {
			let frameBody = frame.contentWindow.document.body;
			let bodyDisplay = frameBody.style.display;
			frameBody.style.display = "inline-block";
			let height = frameBody.offsetHeight;
			frameBody.style.display = bodyDisplay;
			frame.style.height = height + addHeight + "px";
		}
	}
}
