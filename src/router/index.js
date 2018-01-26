import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Settings from '@/components/Settings'
import ErrorPage from '@/components/ErrorPage'
import Transfer from '@/components/Transfer'
import TransactionDetails from '@/components/TransactionDetails'
import Login from '@/components/Login'
import Account from '@/components/Account'
import Contact from '@/components/Contact'
import firebase from 'firebase'
import {errorHandler} from '../utils/handler'
import {getLoggedUser, setLoggedUser, removeLoggedUser, getUserAccountInfo, userKycCompleted, doUmsLogin} from '../services/ums'

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const FIREBASE_AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN;
const FIREBASE_DB_URL = process.env.FIREBASE_DB_URL;
const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    databaseURL: FIREBASE_DB_URL
};
firebase.initializeApp(firebaseConfig);

let proceed = false;

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/',
            name: 'Home',
            component: Home,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/account',
            name: 'Account',
            component: Account,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/settings',
            name: 'Settings',
            component: Settings,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/transfer',
            name: 'Transfer',
            component: Transfer,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/tx/:hash',
            name: 'TransactionDetails',
            component: TransactionDetails,
            props: true,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '/contact',
            name: 'Contact',
            component: Contact,
            meta: {
                requireAuth: true
            }
        },
        {
            path: '*',
            name: 'Error',
            component: ErrorPage,
            meta: {
                requireAuth: true
            }
        }
    ]
});

router.beforeEach((to, from, next) => {
    const userInfo = getLoggedUser();
    if (userInfo) {
        next();
    } else {
        if (to.matched.some(route => route.meta.requireAuth)) {
            next({
                path: '/login',
                query: {
                    redirect: to.fullPath
                }
            });
        } else {
            next();
        }
    }
});

export default router
