let { abort, repr } = require("faucet-pipeline-core/lib/util");
let aiur = require(".");
let parseArgs = require("minimist");
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
  --baseuri
    base uri path the files are served from (default: /)
  --fingerprint
    add unique hash to file names
  --sourcemaps
    generate source maps (where supported)
  --compact
    reduce output size (where supported)
  --serve [HOST:]PORT
    serve generated files via HTTP
  --liveserve [HOST:]PORT
    serve generated files via HTTP with live reload
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
			target: "./dist",
			baseuri: "/"
		}
	});

	if(argv.help) {
		abort(help, 0);
	}

	if(argv.watch && argv.fingerprint) { // for convenience
		console.error("you might consider disabling fingerprinting in watch " +
				"mode to avoid littering your file system with obsolete bundles");
	}

	let { source, target, baseuri } = argv;
	let rawConfig = require(path.resolve(process.cwd(), source));
	let watchDirs = rawConfig.watchDirs || [];

	let config = {
		aiur: [{
			source,
			target,
			baseURI: baseuri
		}],

		sass: [{
			source: "aiur/lib/style.scss",
			target: `${target}/style-aiur.css`
		}],

		js: [{
			source: "aiur/lib/client/index.js",
			target: `${target}/script-aiur.js`
		}],

		watchDirs: [source, ...watchDirs],

		manifest: {
			baseURI: baseuri,
			key: "short",
			webRoot: target
		},

		plugins: [
			{
				bucket: "markup",
				key: "aiur",
				plugin: aiur
			}
		]
	};

	Object.entries(rawConfig.snippetAssets || {}).forEach(([pipeline, entries]) => {
		if(!config[pipeline]) {
			config[pipeline] = [];
		}

		entries.forEach(entry => config[pipeline].push({
			...entry,
			target: resolveSnippetPath(entry.target, target)
		}));
	});

	let options = {
		watch: argv.watch,
		fingerprint: argv.fingerprint,
		sourcemaps: argv.sourcemaps,
		compact: argv.compact,
		serve: argv.serve,
		liveserve: argv.liveserve
	};

	return { referenceDir: process.cwd(), config, options };
};

function resolveSnippetPath(filepath, referenceDir) {
	if(!filepath) {
		abort("ERROR: snippetAssets must have a target");
	}
	if(!filepath.startsWith("./")) {
		abort(`ERROR: targets for snippetAssets must be relative: ${repr(filepath)}`);
	}
	return `${referenceDir}/snippet/${filepath.substring(2)}`;
}
