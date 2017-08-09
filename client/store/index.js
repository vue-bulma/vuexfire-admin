import Vue from 'vue'
import Vuex from 'vuex'
import {firebaseMutations} from 'vuexfire'
// import { firebaseAction } from 'vuexfire'
import pkg from 'package'
import * as actions from './actions'
import * as getters from './getters'
import createPersistedState from 'vuex-persistedstate'
// Modules
import app from './modules/app'
import menu from './modules/menu'
import auth from './modules/auth'
import notes from './modules/notes'
import notifications from './modules/notifications'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,  // process.env.NODE_ENV !== 'production',
  actions,
  getters,
  modules: {
    app,
    menu,
    auth,
    notifications,
    notes
  },
  state: {
    pkg
  },
  plugins: [createPersistedState()],
  mutations: {
    ...firebaseMutations
  }
})

export default store
