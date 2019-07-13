let fs = require("fs");
let path = require("path");

let TemplateEngine = require("thymeleaf");

let templateEngine = new TemplateEngine.TemplateEngine({
	...TemplateEngine.STANDARD_CONFIGURATION,
	templateResolver: templateName => {
		// TODO somehow fetch and use (possibly) configurable base dir
		let templatePath = path.resolve(process.env.PWD, templateName);
		return fs.readFileSync(templatePath);
	}
});

module.exports = template => {

	// o_0 --ugh!
	template = `<!doctype html>
		<html>
			<head>
				<link href="/style-guide.css" rel="stylesheet">
			</head>
			${template}
		</html>`;

	return templateEngine.process(template, { greeting: 'Hello!' });
	//   .then(result => {
	//     // Do something with the result...
	//   });

	// // Render template from file
	// templateEngine.processFile('template.html', { greeting: 'Hello!' })
	//   .then(result => {
	//     // Do something with the result...
	//   });
}
