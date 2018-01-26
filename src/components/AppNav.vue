<template>
	<div class="app-nav">
		<div class="links">
			<router-link to="/" class="navbar-brand">My Wallet</router-link>
			<router-link to="/transfer" class="navbar-brand">Transfer</router-link>
			<router-link to="/investments" class="navbar-brand">My Investments</router-link>
			<router-link to="/loans" class="navbar-brand">New Loans</router-link>
			<router-link to="/settings" class="navbar-brand">Settings</router-link>
			<router-link to="/contact" class="navbar-brand">Contact us</router-link>
			<a class="navbar-brand" @click="logout">Logout</a>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import Popover from 'vue-js-popover'
import firebase from 'firebase'
import {removeLoggedUser} from '../services/ums'

Vue.use(Popover)

export default {
	name: 'app-nav',
	methods: {
		logout() {
			firebase.auth().signOut().then(() => {
				removeLoggedUser();
			});
		}
	}
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

div.logo {
	width: 100px;
	height: 100px;
	background: url('/static/logo-airtoken-big.png') no-repeat center;
	background-size: contain;
	margin: auto;
}

div.links {
	padding-top: 10px;
	margin: auto;
}

a {
	width: 100%;
	text-align: center;
	cursor: pointer;
	font-size: 15px;
	color: #2C295A;
}
a:hover,
a.router-link-exact-active {
	cursor: pointer;
	font-weight: bold;
}

div.profile-popover {
	bottom: 0;
	position: absolute;
	width: 50%;
	margin: 0 auto;
}

.profile {
	border: none;
	width: 50px;
	height: 50px;
	background: url('/static/profile-icon.png') no-repeat center;
	background-size: contain;
	cursor: pointer;
}
div[data-popover="profile"] {
	padding: 0;

}
ul {
	padding-left: 0;
	list-style: none;
}
.short {
	font-size: 12px;
}
ul li {
	font-size: 12px;
}

</style>