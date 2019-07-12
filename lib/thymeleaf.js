let fs = require("fs");
let path = require("path");

let TemplateEngine = require("thymeleaf");

let templateEngine = new TemplateEngine.TemplateEngine({
	...TemplateEngine.STANDARD_CONFIGURATION,
	templateResolver: templateName => {
		// TODO make base directory configurable?
		let templatePath = path.resolve(process.env.PWD, templateName);
		return fs.readFileSync(templatePath);
	}
});

module.exports = template => {

	// console.log(template);

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
