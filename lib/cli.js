let { abort } = require("faucet-pipeline-core/lib/util");
let parseArgs = require("minimist");
let generateConfig = require("./config");
let path = require("path");

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
	let referenceDir = process.cwd();
	argv = parseArgs(argv, {
		boolean: ["watch", "fingerprint", "sourcemaps", "compact"],
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

	let assetConfig = path.resolve(referenceDir, "faucet.config.js"); // TODO: customizable?
	try {
		assetConfig = require(assetConfig);
	} catch(err) {
		if(err.code !== "MODULE_NOT_FOUND") {
			throw err;
		}
		assetConfig = {};
	}

	let { source, target, watch, fingerprint, sourcemaps, compact } = argv;
	return {
		referenceDir,
		config: generateConfig(source, target, referenceDir, assetConfig),
		options: { watch, fingerprint, sourcemaps, compact }
	};
};
