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

	let { source, target, watch, fingerprint, sourcemaps, compact } = argv;
	return {
		referenceDir,
		config: generateConfig(source, target, referenceDir),
		options: { watch, fingerprint, sourcemaps, compact }
	};
};

function generateConfig(source, target, referenceDir) {
	let componentsDir = "./components"; // TODO: customizable
	let baseURI = "/"; // TODO: customizable

	return { // TODO: extensible (e.g. `js`)
		watchDirs: [source, componentsDir], // TODO: extensible (e.g. `./lib`)
		aiur: [{ source, target, baseURI }],
		sass: [{ // TODO: extensible/customizable
			source: "aiur/lib/style.scss",
			target: `${target}/style.css`
		}],
		manifest: { // TODO: customizable?
			baseURI,
			webRoot: target
		},
		plugins: { // TODO: extensible
			aiur: {
				plugin: aiur,
				bucket: "markup"
			}
		}
	};
}
