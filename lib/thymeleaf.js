let fs = require("fs");
let path = require("path");
let TemplateEngine = require("thymeleaf");

let templateEngine = new TemplateEngine.TemplateEngine({
	...TemplateEngine.STANDARD_CONFIGURATION,
	templateResolver: templateName => {
		// TODO make base dir configurable here
		let templatePath = path.resolve(process.env.PWD, templateName);
		return fs.readFileSync(templatePath);
	}
});

module.exports = (template, data) => {
	let output = templateEngine.process(template, data);
	// thymeleafjs wraps non <html> wrapped markup in <html> ... remove it
	return output.then(out => {
		if(out.includes("<html><head></head><body>")) {
			out = out.replace("<html><head></head><body>", "").replace("</body></html>", "");
		}
		return out;
	});
};
