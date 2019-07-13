let Prism = require("prismjs");
let loadLanguages = require("prismjs/components/");

module.exports = function(snippet, language) {
	// (temporary) patches for missing languages
	Prism.languages.thymeleaf = Prism.languages.html;

	if(!Prism.languages[language]) {
		loadLanguages([language]);
	}
	return Prism.highlight(snippet, Prism.languages[language], language);
};
