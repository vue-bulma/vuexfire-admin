import Vue from 'vue'
import * as firebase from 'firebase'
import config from './firebase-setup/config'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueAuth from '@websanova/vue-auth'
import NProgress from 'vue-nprogress'
import { sync } from 'vuex-router-sync'
import App from './App.vue'
import router from './router'
import store from './store'
import * as filters from './filters'
import { TOGGLE_SIDEBAR } from 'vuex-store/mutation-types'
import VeeValidate from 'vee-validate'
import veeValidateConfig from './utils'
// adding firebase to the Vue.prototype allows usage of firebase in your vue components by using this.$firebase
Vue.prototype.$firebase = firebase.initializeApp(config)

Vue.router = router

Vue.use(VeeValidate, veeValidateConfig)
Vue.use(VueAxios, axios)
Vue.use(VueAuth, {
  auth: {
    request: function (req, token) {
      this.options.http._setHeaders.call(this, req, {Authorization: 'Bearer ' + token})
    },
    response: function (res) {
      // Get Token from response body
      return res.data
    }
  },
  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
  loginData: { url: 'http://localhost:6789/login', fetchUser: false },
  refreshData: { enabled: false }
})

Vue.use(NProgress)

// Enable devtools
Vue.config.devtools = true

sync(store, router)

const nprogress = new NProgress({ parent: '.nprogress-container' })

const { state } = store

router.beforeEach((route, redirect, next) => {
  if (state.app.device.isMobile && state.app.sidebar.opened) {
    store.commit(TOGGLE_SIDEBAR, false)
  }
  // Check route meta to see if it requires basic auth
  if (route.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.state.auth.loggedIn) {
      next({
        path: '/login-firebase',
        query: { redirect: route.fullPath }
      })
      store.dispatch('setNotification', {
        'message': 'You are not logged in.',
        'type': 'danger'
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

const app = new Vue({
  router,
  store,
  nprogress,
  ...App
})

export { app, router, store }
