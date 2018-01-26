<template>
	<div id="app">
      <div v-if="user">
        <div v-if="metamaskReady">
          <flash></flash>
          <div class="loading" v-show="loading"></div>
          <div class="topnav">
            <span class="tokenname">AirToken</span>
          </div>
          <div class="sidenav">
            <app-nav></app-nav>
          </div>
          <div class="main">
              <router-view />
          </div>
        </div>
        <div v-else>
          <metamask></metamask>
        </div>
      </div>
      <div v-else>
        <login></login>
      </div>
	</div>
</template>

<script>
import Vue from 'vue'
import AppNav from '@/components/AppNav';
import Login from '@/components/Login';
import Metamask from '@/components/Metamask';
import Flash from 'vue-flash';
import {getLoggedUser,getCurrentWallet,setInitialAccountAndStartWatching} from './services/ums';

export default {
    name: 'app',
    components: {
        AppNav,
        Flash,
        Login,
        Metamask
    },
    data () {
      return {
        loading: false
      }
    },
    created () {
        const itSelf = this;
        window.events.$on(
            'dapp-loading', (val) => {
                itSelf.loading = val;
            }
        );
        setInitialAccountAndStartWatching();
    },
    computed: {
      user() {
        return getLoggedUser();
      },
      metamaskReady() {
        let currWallet = getCurrentWallet();
        return (!!currWallet);
      }
    }
}

</script>

<style>
#app {
    font-family: 'Roboto', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2C295A;
    padding: 20px;
}

.sidenav {
  height: 100%;
  width: 200px;
  position: fixed;
  top: 80px;
  left: 0;
  background-color: #F5F5F5;
  overflow-x: hidden;
  padding-top: 10px;
}

.topnav {
  height: 56px;
  width: 100%;
  background-color: #2C295A;
  color: #FFFFFF;
  font-size: 32px;
  padding-left: 14px;
  padding-top: 7px;
}

.topnav.tokenname {
  font-size: 32px;
}

/* Page content */
.main {
  margin-left: 220px; /* Same as the width of the sidenav */
  min-width: 650px;
}

h1 {
  font-size: 24px;
}

div.loading {
  background: rgba(0,0,0,.5) url('/static/spinner.gif') no-repeat center;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index:999;
}

a {
  cursor: pointer;
}

.small-spinner {
  background: rgba(0,0,0,.5) url('/static/small-spinner.gif') no-repeat center;
}

</style>
