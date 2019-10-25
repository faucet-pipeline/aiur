let hb = require("handlebars");

module.exports = (template, data) => {
	let compiledTemplate = hb.compile(template);
	let result = compiledTemplate(data);
	return Promise.resolve(result);
};
