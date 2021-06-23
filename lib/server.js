let { _parseHost } = require("faucet-pipeline-core/lib/server");

exports.live = (config, root) => {
	let LiveServer = require("five-server").default;
	let [host, port] = _parseHost(config);

	new LiveServer().start({ port, host, root, open: false });
};
