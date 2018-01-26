// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import {store} from './store'

window.events = new Vue();
window.flash = function(message, type) {
    window.events.$emit('flash', message, type);
};
window.emitLoading = function(val) {
	window.events.$emit('dapp-loading', val);
};

Vue.config.productionTip = false;

window.addEventListener('load', function() {
	new Vue({
		el: '#app',
		router,
		store,
		template: '<App/>',
		components: { App }
	}).$mount();
});
