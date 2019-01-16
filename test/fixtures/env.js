// application-specific context; this will be populated (i.e. mutated) at
// runtime by the respective application
exports.context = {
	uri: toBeDefined // signature is `(uriIdentifier, params)`
};

function toBeDefined() {
	throw new Error("application context is not defined");
}
