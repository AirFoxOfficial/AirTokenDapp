export default {
	currentUser(state, newUser) {
		state.currentUser = newUser;
	},
	logout(state) {
		state.currentUser = null;
		state.accessToken = null;
	},
	accessToken(state, token) {
		state.accessToken = token;
	},
	gasPrice(state, price) {
		state.gasPrice = price;
	},
	currentWallet(state, wallet) {
		state.currentWallet = wallet;
	}
}
