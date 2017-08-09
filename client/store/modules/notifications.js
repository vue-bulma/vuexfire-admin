import * as types from '../mutation-types'
import {generateUuid} from './utils'

// State
const state = {
  items: [],
  defaultNotifications: {
    loggedInMessage: {
      id: 'loggedInMessage',
      message: 'You\'re logged in.',
      type: 'primary',
      duration: 5000
    },
    loggedOutMessage: {
      id: 'loggedInMessage',
      message: 'You\'re logged out.',
      type: 'primary',
      duration: 5000
    },
    reAuthenticated: {
      id: 'reAuthenticated',
      message: 'You have been reauthenticated.',
      type: 'primary',
      duration: 5000
    },
    reAuthSuccess: {
      id: 'reAuthSuccess',
      message: 'You have been reauthenticated.',
      type: 'primary',
      duration: 5000
    },
    accountExistsDifferentWithCredential: {
      id: 'accountExistsDifferentWithCredential',
      message: 'You have already signed up with a different auth provider for that email.',
      type: 'danger',
      duration: 5000
    }
  }
}

// Mutations
const mutations = {
  [types.SET_NOTIFICATION] (state, notification) {
    state.items.push(notification)
  },
  [types.DISMISS_NOTIFICATION] (state) {
    state.show = false
  },
  [types.DESTROY_NOTIFICATION] (state, notification) {
    var index = state.items.indexOf(notification)
    if (index > -1) {
      state.items.splice(index, 1)
    }
  }
}

// Getters
const getters = {
  notifications: (state) => state.items,
  defaultNotifications: (state) => state.defaultNotifications
}

// Actions
const actions = {
  setNotification ({dispatch, commit}, {message, type, uuid, duration}) {
    commit(types.SET_NOTIFICATION, {message: message, type: type, id: generateUuid(), duration: duration})
  },
  dismissNotification ({commit}) {
    commit(types.DISMISS_NOTIFICATION)
  },
  destroyNotification ({commit}, notification) {
    commit(types.DESTROY_NOTIFICATION, notification)
  }
}

// Export
export default {
  state,
  mutations,
  getters,
  actions
}
