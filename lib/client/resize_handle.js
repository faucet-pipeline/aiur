// TODO enhance with touches: https://github.com/stbaer/ev-pos/blob/master/src/index.js
// TODO consider snap feature? snap to edges? stepped resize?

function betterParseInt(string) {
	let parsed = parseInt(string);
	return isNaN(parsed) ? 0 : parsed;
}

export default class ResizeHandle extends HTMLElement {
	connectedCallback() {
		this.init();
	}

	adoptedCallback() {
		this.init();
	}

	init() {
		this._target = document.querySelector("#" + this.getAttribute("for"));
		if(this._target) {
			this.addEventListener("mousedown", this.startDrag.bind(this));
			document.addEventListener("mouseup", this.stopDrag.bind(this));
			document.addEventListener("mousemove", this.drag.bind(this));
			let directions = this.getAttribute("direction").toLowerCase();
			this._useDirectionX = directions.indexOf("x") > -1 ? true : false;
			this._useDirectionY = directions.indexOf("y") > -1 ? true : false;
			if(this.hasAttribute("remember") && this.hasAttribute("id")) {
				this._rememberState = true;
				this._storageId = "resize-handle#" + this.id;
				this.recallState();
			}
		}
	}

	startDrag(event) {
		event.preventDefault();
		let targetsComputedStyle = window.getComputedStyle(this._target);
		this._targetsBoxSizing = targetsComputedStyle.getPropertyValue("box-sizing");

		if(this._targetsBoxSizing === "content-box") {
			this._targetsOriginWidth = this._target.offsetWidth -
				betterParseInt(targetsComputedStyle.getPropertyValue("padding-left")) -
				betterParseInt(targetsComputedStyle.getPropertyValue("padding-right")) -
				betterParseInt(targetsComputedStyle.getPropertyValue("border-left-width")) -
				betterParseInt(targetsComputedStyle.getPropertyValue("border-right-width"));
			this._targetsOriginHeight = this._target.offsetHeight -
				betterParseInt(targetsComputedStyle.getPropertyValue("padding-top")) -
				betterParseInt(targetsComputedStyle.getPropertyValue("padding-bottom")) -
				betterParseInt(targetsComputedStyle.getPropertyValue("border-top-width")) -
				betterParseInt(targetsComputedStyle.getPropertyValue("border-bottom-width"));
		} else {
			this._targetsOriginWidth = this._target.offsetWidth;
			this._targetsOriginHeight = this._target.offsetHeight;
		}

		this._mouseOriginX = event.pageX;
		this._mouseOriginY = event.pageY;

		this._isBeingDragged = true;
		window.requestAnimationFrame(() => this.classList.add("dragging"));

		this.dispatchEvent(new CustomEvent("resizestart", {
			detail: {
				directionX: this._useDirectionX,
				directionY: this._useDirectionY,
				targetWidth: this._useDirectionX ? this._target.style.width : undefined,
				targetHeight: this._useDirectionY ? this._target.style.height : undefined,
				pageX: event.pageX,
				pageY: event.pageY,
			}
		}));
	}

	drag(event) {
		if(this._isBeingDragged) {
			window.requestAnimationFrame(() => {
				let deltaX = event.pageX - this._mouseOriginX;
				let deltaY = event.pageY - this._mouseOriginY;
				if(this._useDirectionX) {
					this._target.style.width = this._targetsOriginWidth + deltaX + "px";
				}
				if(this._useDirectionY) {
					this._target.style.height = this._targetsOriginHeight + deltaY + "px";
				}
			});
		}
	}

	stopDrag(event) {
		if(this._isBeingDragged) {
			this._isBeingDragged = false;
			window.requestAnimationFrame(() => this.classList.remove("dragging"));

			this.rememberState(this._target.style.width, this._target.style.height);

			this.dispatchEvent(new CustomEvent("resizeend", {
				detail: {
					directionX: this._useDirectionX,
					directionY: this._useDirectionY,
					targetWidth: this._useDirectionX ? this._target.style.width : undefined,
					targetHeight: this._useDirectionY ? this._target.style.height : undefined,
					pageX: event.pageX,
					pageY: event.pageY,
				}
			}));
		}
	}

	rememberState(width, height) {
		if(this._rememberState) {
			localStorage.setItem(this._storageId, JSON.stringify({ width, height }));
		}
	}

	recallState() {
		if(this._rememberState) {
			let state = JSON.parse(localStorage.getItem(this._storageId));
			if(state && state.width !== "") {
				this._target.style.width = state.width;
			}
			if(state && state.height !== "") {
				this._target.style.height = state.height;
			}
		}
	}
}

