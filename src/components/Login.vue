<template>
	<div class="container">
	    <div class="omb_login">
	    	<h3 class="omb_authTitle">Login</h3>
			<div class="row omb_row-sm-offset-3 omb_socialButtons">
	    	    <div class="col-xs-6 col-sm-2">
			        <a class="btn btn-lg btn-block omb_btn-facebook" @click="signIn('facebook')">
				        <i class="fa fa-facebook visible-xs"></i>
				        <span class="hidden-xs">Facebook</span>
			        </a>
		        </div>
	        	<div class="col-xs-6 col-sm-2">
			        <a class="btn btn-lg btn-block omb_btn-google" @click="signIn('google')">
				        <i class="fa fa-google-plus visible-xs"></i>
				        <span class="hidden-xs">Google</span>
			        </a>
		        </div>	
			</div>

			<div class="row omb_row-sm-offset-3 omb_loginOr">
				<div class="col-xs-12 col-sm-6">
					<hr class="omb_hrOr">
					<span class="omb_spanOr">or</span>
				</div>
			</div>

			<div class="row omb_row-sm-offset-3">
				<div class="col-xs-12 col-sm-6">	
				    <form class="omb_loginForm" action="" autocomplete="off" method="POST">
						<div class="input-group">
							<span class="input-group-addon"><i class="fa fa-user"></i></span>
							<input type="text" class="form-control" name="username" placeholder="email address" v-model="email">
						</div>
						<span class="help-block"></span>
											
						<div class="input-group">
							<span class="input-group-addon"><i class="fa fa-lock"></i></span>
							<input type="password" class="form-control" name="password" placeholder="Password" v-model="password">
						</div>

						<button class="btn btn-lg btn-primary btn-block" type="button" @click="signIn('')">Login</button>
					</form>
				</div>
	    	</div>    	
		</div>
    </div>
</template>

<script>
import Vue from 'vue'
import firebase from 'firebase'
import {errorHandler} from '../utils/handler';
import {setLoggedUser, removeLoggedUser, doUmsLogin, userKycCompleted} from '../services/ums';

export default {
	name: 'login',
	data () {
		return {
			showInput: false,
			email: '',
			password: ''
		}
	},
	methods: {
		signIn: function(providerName) {
			if (!providerName) {
				firebase.auth().signInWithEmailAndPassword(this.email, this.password)
					.then(result => {
		        		if(result && result.user) {
		        			return doUmsLogin(result.user);
		        		} else {
		        			throw new Error('user not found');
		        		}
					})
					.then(result => {
						if (!result) {
							throw new Error('error while doing firebase login');
						} else {
							let pathTo = '/account';
							let queryTo = this.$route.query;
							if (userKycCompleted()) {
								pathTo = this.$route.query.redirect || '/';
								queryTo = null;
							}
							this.$router.push({ path: pathTo, query: queryTo });
						}
						
					})
					.catch(err => {
			        	errorHandler({
	                        message: `Error while loggin in: ${err.message}`,
	                        level: 'error',
	                        emitLoading: false
	                    });
			        });
			} else {
				let provider;
				switch(providerName) {
					case 'google':
						provider = new firebase.auth.GoogleAuthProvider();
						break;
					case 'facebook':
						provider = new firebase.auth.FacebookAuthProvider();
						break;
					default:
						provider = new firebase.auth.GoogleAuthProvider();
				}
		        
		        provider.addScope('email');
		        firebase.auth().signInWithPopup(provider)
		        	.then(result => {
		        		if(result && result.user) {
		        			return doUmsLogin(result.user);
		        		} else {
		        			throw new Error('user not found');
		        		}
					})
					.then(result => {
						if (!result) {
							throw new Error('error while doing firebase login');
						} else {
							let pathTo = '/account';
							let queryTo = this.$route.query;
							if (userKycCompleted()) {
								pathTo = this.$route.query.redirect || '/';
								queryTo = null;
							}
							this.$router.push({ path: pathTo, query: queryTo });
						}
					})
					.catch(err => {
			        	errorHandler({
	                        message: `Error while loggin in: ${err.message}`,
	                        level: 'error',
	                        emitLoading: false
	                    });
			        });
			}
		}
	}
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

a {
	cursor: pointer;
}

@media (min-width: 768px) {
    .omb_row-sm-offset-3 div:first-child[class*="col-"] {
        margin-left: 25%;
    }
}

.omb_login .omb_authTitle {
    text-align: center;
	line-height: 300%;
}
	
.omb_login .omb_socialButtons a {
	color: white; // In yourUse @body-bg 
	opacity:0.9;
}
.omb_login .omb_socialButtons a:hover {
    color: white;
	opacity:1;    	
}
.omb_login .omb_socialButtons .omb_btn-facebook {background: #3b5998;}
.omb_login .omb_socialButtons .omb_btn-twitter {background: #00aced;}
.omb_login .omb_socialButtons .omb_btn-google {background: #c32f10;}

.omb_login .omb_loginOr {
	position: relative;
	font-size: 1.5em;
	color: #aaa;
	margin-top: 1em;
	margin-bottom: 1em;
	padding-top: 0.5em;
	padding-bottom: 0.5em;
}
.omb_login .omb_loginOr .omb_hrOr {
	background-color: #cdcdcd;
	height: 1px;
	margin-top: 0px !important;
	margin-bottom: 0px !important;
}
.omb_login .omb_loginOr .omb_spanOr {
	display: block;
	position: absolute;
	left: 50%;
	top: -0.6em;
	margin-left: -1.5em;
	background-color: white;
	width: 3em;
	text-align: center;
}			

.omb_login .omb_loginForm .input-group.i {
	width: 2em;
}
.omb_login .omb_loginForm  .help-block {
    color: red;
}

@media (min-width: 768px) {
    .omb_login .omb_forgotPwd {
        text-align: right;
		margin-top:10px;
 	}		
}

</style>