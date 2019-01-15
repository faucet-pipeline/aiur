let aiur = require(".");

// generates a configuration object for faucet-pipeline, merging users' asset
// configuration with aiur's defaults
module.exports = function generateConfig(source, target, referenceDir, assetsConfig) {
	let componentsDir = "./components"; // TODO: customizable
	let baseURI = "/"; // TODO: customizable

	let { watchDirs, sass, plugins } = assetsConfig;

	// merge `watchDirs`
	let defaults = [source, componentsDir];
	watchDirs = watchDirs ? [...new Set(defaults.concat(watchDirs))] : defaults;

	// merge `sass`
	defaults = [{
		source: "aiur/lib/style.scss", // TODO: customizable?
		target: `${target}/style.css`
	}];
	sass = sass ? defaults.concat(sass) : defaults;

	// merge `plugins`
	defaults = {
		aiur: {
			plugin: aiur,
			bucket: "markup"
		}
	};
	plugins = plugins ? Object.assign({}, defaults, plugins) : defaults;

	return Object.assign({}, assetsConfig, {
		watchDirs,
		aiur: [{ source, target, baseURI }],
		sass,
		manifest: { // TODO: customizable?
			baseURI,
			webRoot: target
		},
		plugins
	});
};
