function fit(frame, addHeight) {
	let frameChildren = Array.from(frame.contentWindow.document.body.children);
	let height = frameChildren.reduce((height, frameChild) => height + frameChild.clientHeight, 0);
	frame.style.height = height + addHeight + "px";
}

export default function fitFrames(iframeSelector, additionalHeight) {
	let addHeight = additionalHeight || 0;
	let iframes = Array.from(document.querySelectorAll(iframeSelector));
	iframes.forEach(frame => frame.addEventListener("load", event => fit(event.target, addHeight)));
}
