export default {
	loggedUser(state) {
		return state.currentUser;
	},
	accessToken(state) {
		return state.accessToken;
	},
	gasPrice(state) {
		return state.gasPrice;
	},
	currentWallet(state) {
		return state.currentWallet;
	}
}
