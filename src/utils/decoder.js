export {decodeJwt}

function decodeJwt (token) {
	let parsed = {
		data: {
		}
	}
	if (!!token) {
		var base64Url = token.split('.')[1];
    	var base64 = base64Url.replace('-', '+').replace('_', '/');
    	parsed = JSON.parse(window.atob(base64));
	}
    
    return parsed;
};