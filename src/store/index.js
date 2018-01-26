import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'

import getters from './getters';
import mutations from './mutations';
import actions from './actions';

const tenMinutes = new Date(new Date().getTime() + 10 * 60 * 1000);

const persistedStateOpts = {
	storage: {
		getItem: key => Cookies.get(key),
		setItem: (key, value) => Cookies.set(key, value, { expires: tenMinutes, secure: true }),
		removeItem: key => Cookies.remove(key)
	}
}

Vue.use(Vuex);

export const store = new Vuex.Store({
	plugins: [createPersistedState()],
	state: {
		currentUser: null,
		accessToken: '',
		gasPrice: null,
		currentWallet: ''
	},
	getters,
	mutations,
	actions
});
