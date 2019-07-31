module.exports = status => {
	return ["prototype", "wip", "ready"].indexOf(status) > -1 ? `<span class="aiur-status aiur-status-${status}">${status}</span>` : "";
};
