let Site = require("./site");

module.exports = (config, assetManager, options) => {
	let sites = config.map(siteConfig => new Site(siteConfig, assetManager));
	return filepaths => {
		let builds = sites.map(site => site.generate(filepaths));
		return Promise.all(builds);
	};
};
