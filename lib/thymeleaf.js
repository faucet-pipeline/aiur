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

module.exports = (template, data) => {
	// o_0 --ugh!
	// TODO:
	// 	 - add possibility to add external stylesheets
	// 	 - maybe keep all stylesheets configurable including main stylesheet?
	// 	 - possibility to add scripts
	template = `<!doctype html>
		<html>
			<head>
			    <link crossorigin="anonymous" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" rel="stylesheet">
				<link href="/style-guide.css" rel="stylesheet">
			</head>
			<body>
				${template}
			</body>
		</html>`;
	return templateEngine.process(template, data);
	//   .then(result => {
	//     // Do something with the result...
	//   });

	// // Render template from file
	// templateEngine.processFile('template.html', { greeting: 'Hello!' })
	//   .then(result => {
	//     // Do something with the result...
	//   });
};
