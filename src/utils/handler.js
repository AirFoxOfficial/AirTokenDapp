/* eslint-disable */

export {errorHandler}

function errorHandler(params) {
	if (params.hasOwnProperty('emitLoading')) {
		emitLoading(params.emitLoading);
	}
	flash(params.message, params.level);
	if (!params.hideLog) {
		console.error(params.message);
	}
}