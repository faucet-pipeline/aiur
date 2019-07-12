let TemplateEngine = require("thymeleaf");

let templateEngine = new TemplateEngine.TemplateEngine(TemplateEngine.STANDARD_CONFIGURATION);


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
