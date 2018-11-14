let Prism = require("prismjs");
let loadLanguages = require("prismjs/components/");

module.exports = function(snippet, language) {
	if(!Prism.languages[language]) {
		loadLanguages([language]);
	}
	return Prism.highlight(snippet, Prism.languages[language], language);
};
