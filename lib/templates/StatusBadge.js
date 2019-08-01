let statuses = ["prototype", "wip", "ready", "deprecated"];

module.exports = status => {
	if(status && statuses.indexOf(status.toLowerCase()) > -1) {
		return `<span class="aiur-status aiur-status-${status}">${status}</span>`;
	}
	return "";
};
