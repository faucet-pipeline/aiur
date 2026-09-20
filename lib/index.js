let Site = require("./site");

exports.key = "aiur";
exports.bucket = "markup";

exports.plugin = (config, assetManager, options) => {
	let sites = config.map(siteConfig => new Site(siteConfig, assetManager));

	return filepaths => {
		let builds = sites.map(site => site.generate(filepaths));
		return Promise.all(builds);
	};
};
