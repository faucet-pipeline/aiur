module.exports = {
	"ready": {
		alias: "live",
	}
	"live": {
		short: "live"
		message: "Ready and possibly live in production.",
		shy: true,
		color: "springgreen",
		style: "positive"
	},
	"wip": {
		alias: "dev",
	},
	"dev": {
		short: "dev",
		message: "Final design, yet, under development.",
		shy: false,
		color: "coral",
		style: "negative"
	},
	"prototype": {
		short: "proto",
		message: "Prototype: Under design & discussion.",
		shy: false,
		color: "darkred",
		style: "negative"
	},
	"deprecated": {
		short: "depr",
		message: "Deprecated! Please remove from prod.",
		shy: false,
		color: "darkslategray",
		style: "negative"
	}
};
