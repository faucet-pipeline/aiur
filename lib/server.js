let liveServer = require("live-server");

module.exports = (target, port) => {
	liveServer.start({
		port: port,
		root: target,
		open: false,
		logLevel: 0
	});
	liveServer.watcher.on("ready", () => {
		console.error(`development server listening on ${port}`);
	});
};
