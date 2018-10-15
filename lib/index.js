let fs = require("fs");
let { abort, promisify } = require("faucet-pipeline-core/lib/util");
let readFile = promisify(fs.readFile);
let generateLayout = require("./generate_layout");
let generateRenderer = require("./generate_renderer");
let Page = require("./page");

module.exports = (config, assetManager, opts) => {
	let runners = config.map(runnerConfig =>
		makeRunner(runnerConfig, assetManager));

	return filepaths => Promise.all(runners.map(runner => runner(filepaths)));
};

function makeRunner(config, assetManager) {
	if(!config.source || !config.target) {
		abort("ERROR: Styleguide configuration requires both target and source");
	}

	let source = assetManager.resolvePath(config.source);
	let target = assetManager.resolvePath(config.target, { enforceRelative: true });
	config.description = config.description || "Styleguide";
	config.language = config.language || "en";

	if(config.port) {
		let server = require("./server");
		server(target, config.port);
	}

	let renderers = {
		html: template => template
	};
	let renderPage = generateRenderer(renderers, target, assetManager);

	let shouldRenderPage = (file, changedFiles) => {
		if(!changedFiles) {
			return true;
		}

		return changedFiles.includes(assetManager.resolvePath(file));
	};

	return filepaths => {
		if(filepaths && filepaths.includes(source)) {
			// if the `target` file changes, rebuild all
			filepaths = undefined;
		}

		return readFile(source).
			then(raw => {
				let pages = JSON.parse(raw).
					map(rawPage => new Page(rawPage, config, assetManager.resolvePath));

				return Promise.all(pages.map(page => {
					return page.readHeaders().
						catch(_ => {
							console.error(`Could not read headers in ${page.file}`);
						});
				})).
					then(() => pages);
			}).then(pages => {
				let layout = generateLayout(pages);

				return Promise.all(
						pages.
							reduce((accumulator, page) => {
								return accumulator.concat(page, page.children);
							}, []).
							map(page => {
								if(!shouldRenderPage(page.file, filepaths)) {
									return Promise.resolve(null);
								}

								return renderPage(page, layout);
							})
				);
			});
	};
}
