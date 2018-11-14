// obfuscated names so the user does not run into 'already defined' errors
import Renderer, { Fragment as _F, createElement as _h } from "complate-stream";
import BufferedStream from "complate-stream/src/buffered-stream";

let renderer = new Renderer();

//  eslint-disable-next-line no-unused-vars
function render(macro) {
	let view = () => _h(_F, null, macro);
	let stream = new BufferedStream();

	return new Promise(resolve => {
		renderer.renderView(view, null, stream, {}, () => {
			let html = stream.read();
			resolve(html);
		});
	});
}
