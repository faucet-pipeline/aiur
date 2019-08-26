function fit(frame, addHeight) {
	let bodyDisplay = frame.contentWindow.document.body.style.display;
	frame.contentWindow.document.body.style.display = "inline-block";
	let height = frame.contentWindow.document.body.offsetHeight;
	frame.contentWindow.document.body.style.display = bodyDisplay;
	frame.style.height = height + addHeight + "px";
}

export default function fitFrames(iframeSelector, additionalHeight) {
	let addHeight = additionalHeight || 0;
	let iframes = Array.from(document.querySelectorAll(iframeSelector));
	iframes.forEach(frame => frame.addEventListener("load", event => fit(event.target, addHeight)));
}
