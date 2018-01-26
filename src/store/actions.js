import firebase from 'firebase'
import axios from 'axios'

const ACCOUNT_BASEURL = process.env.ACCOUNT_SERVICE_BASE_URL;
const DEVICE_ID = process.env.DEVICE_ID;

export default {
	umsLogin(context, credentials) {
		return new Promise((resolve) => {
			const user = firebase.auth().currentUser;
			if (user) {
				user.getIdToken()
					.then(token => {
						const body = {
					        credentials: {
					            token: token,
					            user_id: credentials.uid
					        },
					        device_id: DEVICE_ID
					    };
					    return axios.post(`${ACCOUNT_BASEURL}/account/login`, body)
					})
			    	.then(loginResult => {
			    		const accessToken = loginResult.data.data.access_token;
			    		context.commit('accessToken', accessToken);
			    		return axios.get(`${ACCOUNT_BASEURL}/account/`, { headers: { Authorization: accessToken } });
			    	})
			    	.then(accInfo => {
			    		if (accInfo) {
		                    const name = user.displayName.split(' ');
		                    const userData = {
		                        email: user.email,
		                        firstName: name.shift(),
		                        lastName: name.join(' ')
		                    };
		                    const mergedData = Object.assign(accInfo.data.data, userData);
		                    context.commit('currentUser', mergedData);
		                    resolve(mergedData);
		                }
			    	})
			    	.catch(err => {
			    		throw err;
			    	});
		    } else {
		    	context.commit('logout', null);
		    	resolve(null);
		    }
		});
		
	},
	updateAccountInfo(context, payload) {
		return new Promise((resolve) => {
			const accessToken = context.getters.accessToken;
			axios.put(`${ACCOUNT_BASEURL}/account/`, payload, { headers: { Authorization: accessToken } })
				.then(result => {
					const userData = context.getters.loggedUser;
					const mergedData = Object.assign(userData, payload);
	                context.commit('currentUser', mergedData);
	                resolve();
				});
		});
	},
	pollAccount(context) {
		let account = web3.eth.accounts[0];
		let accountInterval = setInterval(function() {
			if (web3.eth.accounts[0] !== account) {
				account = web3.eth.accounts[0];
				context.commit('currentWallet', account);
			}
		}, 100);
	}
}
