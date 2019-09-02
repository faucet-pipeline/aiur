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
	// TODO make this mess good
	// TODO scripts and styles need to be customly addable
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
};
