let { abort } = require("faucet-pipeline-core/lib/util");
let parseArgs = require("minimist");
let aiur = require(".");

let HELP = `
Usage:
  $ aiur [options]

Options:
  -h, --help
	display this help message
  -w, --watch
    monitor the file system for changes to recompile automatically
  -s, --source
    aiur configuration file (default: ./aiur.config.js)
  -t, --target
    put the generated files here (default: ./dist)
  --fingerprint
    add unique hash to file names
  --sourcemaps
    generate source maps (where supported)
  --compact
    reduce output size (where supported)
`.trim();

module.exports = function parseCLI(argv = process.argv.slice(2), help = HELP) {
	argv = parseArgs(argv, {
		boolean: ["watch", "fingerprint", "sourcemaps", "compact"],
		string: ["serve"],
		alias: {
			s: "source",
			t: "target",
			w: "watch",
			h: "help"
		},
		default: {
			source: "./aiur.config.js",
			target: "./dist"
		}
	});

	if(argv.help) {
		abort(help, 0);
	}

	if(argv.watch && argv.fingerprint) { // for convenience
		console.error("you might consider disabling fingerprinting in watch " +
				"mode to avoid littering your file system with obsolete bundles");
	}

	let { source, target } = argv;
	// TODO: allow users to overwrite this in a custom faucet.config.js
	let baseURI = "/";
	let config = {
		aiur: [{
			source,
			target,
			baseURI
		}],

		// TODO: make this configurable
		sass: [{
			source: "aiur/lib/style.scss",
			target: `${target}/style-aiur.css`
		}, {
			// TODO espacially this should be configurable ...
			source: "./index.scss",
			target: `${target}/style-guide.css`
		}],

		// TODO: allow users to overwrite this in a custom faucet.config.js
		watchDirs: [source, "./components"],

		manifest: {
			baseURI,
			webRoot: target
		},

		plugins: {
			aiur: {
				plugin: aiur,
				bucket: "markup"
			}
		}
	};

	let options = {
		watch: argv.watch,
		fingerprint: argv.fingerprint,
		sourcemaps: argv.sourcemaps,
		compact: argv.compact,
		serve: argv.serve
	};

	return { referenceDir: process.cwd(), config, options };
};
