export default class TabsConstrol extends HTMLElement {
	connectedCallback() {
		window.requestAnimationFrame(() => {
			this.setAttribute("role", "tablist");
			this._triggers = Array.from(this.querySelectorAll("[role=\"tab\"]"));
			this._triggers.forEach(trigger => trigger.setAttribute("tabindex", 0));
			this._targetMap = new Map();
			this._triggers.forEach(triggerElement => {
				let triggerTargetId = "#" + triggerElement.getAttribute("aria-controls");
				let triggerTargetElement = document.querySelector(triggerTargetId);
				this._targetMap.set(triggerTargetId, triggerTargetElement);
				triggerElement.addEventListener("click", e => this.switch(e.target));
			});

			this._triggers.forEach(triggerElement => {
				if(triggerElement.getAttribute("aria-selected") !== "true") {
					this._targetMap.
						get("#" + triggerElement.getAttribute("aria-controls")).
						setAttribute("hidden", "true");
				}
			});
		});
	}

	switch(clickedElement) {
		if(clickedElement.getAttribute("aria-selected") === "true") {
			return;
		}
		window.requestAnimationFrame(() => {
			this._triggers.forEach(trigger => trigger.setAttribute("aria-selected", "false"));
			clickedElement.setAttribute("aria-selected", "true");
			this._targetMap.forEach(targetElement => targetElement.setAttribute("hidden", "true"));
			let clickTargetElement = this._targetMap.get("#" + clickedElement.getAttribute("aria-controls"));
			clickTargetElement.removeAttribute("hidden");
		});
	}
}
