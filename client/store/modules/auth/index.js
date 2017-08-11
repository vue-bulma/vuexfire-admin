import Vue from 'vue'
import * as types from '../../mutation-types'
import firebase from 'firebase'
import router from '../../../router'
import { onReject } from './utils'
import * as getters from './getters'

const state = {
  user: {
    uid: null,
    displayName: null,
    email: null,
    roles: {},
    authProviders: {
      'google.com': {
        id: 'google.com',
        linked: false,
        pending: false
      },
      'facebook.com': {
        id: 'facebook.com',
        linked: false,
        pending: false
      },
      'github.com': {
        id: 'github.com',
        linked: false,
        pending: false
      },
      'password': {
        id: 'password',
        linked: false,
        info: '',
        pending: false
      }
    }
  },
  loggedIn: false,
  UI: {
    pending: false,
    reAuthRequired: false,
    loginBtnDisabled: false,
    loginBtnText: 'Sign in with Goggle',
    logoutButtonText: 'Logout',
    signedInMessage: 'Your signed in'
  },
  error: null,
  reAuth: {
    info: {},
    reAuthTriggeredBy: null
  },
  notification: {
    show: false,
    text: '',
    type: ''
  }
}

const mutations = {
  [types.SET_USER] (state, user) {
    if (user) { // Send through the bits of the user that we need.
      state.user.uid = user.uid
      state.user.displayName = user.displayName
      state.user.email = user.email
    } else {
      state.user.uid = null
      state.user.displayName = null
      state.user.email = null
    }
  },
  [types.SET_LOGGED_IN] (state, isLoggedIn) {
    state.loggedIn = isLoggedIn
  },
  [types.SET_UI_LOGIN_DISABLED] (state, loginBtnDisabled) {
    state.UI.loginBtnDisabled = loginBtnDisabled
  },
  [types.SET_UI_LOGIN_BTN_TEXT] (state, text) {
    state.UI.loginBtnText = text
  },
  [types.SET_AUTH_PENDING] (state, isAuthPending) {
    state.UI.pending = isAuthPending
  },
  [types.SET_ERROR] (state, error) {
    state.error = error
  },
  [types.SET_USERS_LINKED_AUTH_PROVIDERS] (state, provider) {
    // state.user.authProviders.push(provider)
    var providers = state.user.authProviders
    Vue.set(providers, provider.id, provider)
  },
  [types.SET_PASSWORD_AUTH_LINKING_PENDING] (state, isPending) {
    // state.user.authProviders.push(provider)
    state.user.authProviders.password.pending = isPending
  },
  [types.REAUTH_REQUIRED] (state, isRequired) {
    state.UI.reAuthRequired = isRequired
  },
  [types.REAUTH_TRIGGERED_BY] (state, reAuthCause) {
    state.reAuth.reAuthTriggeredBy = reAuthCause
  },
  [types.REAUTH_INFO] (state, info) {
    state.reAuth.info = info
  }
}

const actions = {
  signInWithPass ({commit, dispatch, getters}, credentials) {
    commit(types.SET_AUTH_PENDING, true)
    const auth = firebase.auth()
    const email = credentials.email
    const pass = credentials.pass
    // If there's no current user
    if (!firebase.auth().currentUser) {
      auth.signInWithEmailAndPassword(email, pass).then(function (result) {
        // Disable login button
        commit(types.SET_UI_LOGIN_DISABLED, true)
        // Set logged in within auth state
        commit(types.SET_LOGGED_IN, true)
        // Add the signed-in user info to state
        commit(types.SET_USER, result.user)

        // Finish authing
        commit(types.SET_AUTH_PENDING, false)
        commit(types.SET_UI_LOGIN_BTN_TEXT, 'Logged in with Google.')
        router.replace('/')
        // Dispatch the default notification for logging in
        dispatch('setNotification', getters.defaultNotifications.loggedInMessage)
      }).catch(function (error) {
        // Handle Errors here.
        commit(types.SET_ERROR, error)
        // [START_EXCLUDE]
        if (error.code === 'auth/account-exists-with-different-credential') {
          dispatch('setNotification', getters.defaultNotifications.accountExistsDifferentWithCredential)
          // If you are using multiple auth providers on your app you should handle linking
          // the user's accounts here.
        } else if (error.code === 'auth/wrong-password') {
          console.error(error)
          dispatch('setNotification', {
            type: 'danger',
            message: error.message,
            duration: 5000
          })
        } else {
          console.log(error)
        }
        // [END_EXCLUDE]
      })
      // [END signin]
    }
  },
  reAuth ({commit, dispatch, getters}, providerId) {
    commit(types.SET_AUTH_PENDING, true)
    const auth = firebase.auth()
    const provider = {}

    if (providerId === 'google.com') {
      provider.type = new firebase.auth.GoogleAuthProvider()
    } else if (providerId === 'facebook.com') {
      provider.type = new firebase.auth.FacebookAuthProvider()
    } else if (providerId === 'github.com') {
      provider.type = new firebase.auth.GithubAuthProvider()
    } else {
      provider.type = new firebase.auth.GoogleAuthProvider()
    }

    auth.currentUser.reauthenticateWithPopup(provider.type).then(function (result) {
      // Disable login button
      commit(types.SET_UI_LOGIN_DISABLED, true)
      // Set logged in within auth state
      commit(types.SET_LOGGED_IN, true)
      // Add the signed-in user info to state
      commit(types.SET_USER, result.user)
      // Finish authing
      commit(types.SET_AUTH_PENDING, false)
      commit(types.REAUTH_REQUIRED, false)

      // If reauth was triggered while trying to set password, try again now that we have re-authed the user
      if (getters.reAuthTriggeredBy === 'linkEmailAuthProvider') {
        dispatch('linkEmailAuthProvider', getters.reAuthInfo)
        commit(types.REAUTH_INFO, null)
      }
      commit(types.REAUTH_TRIGGERED_BY, null)
      // Dispatch the default notification for logging in
      dispatch('setNotification', getters.defaultNotifications.reAuthSuccess)
    }).catch(function (error) {
      // Handle Errors here.
      dispatch('setNotification', {
        type: 'danger',
        message: error.message,
        duration: 5000
      })
    })
  },
  linkEmailAuthProvider ({commit, dispatch}, credentials) {
    commit(types.SET_PASSWORD_AUTH_LINKING_PENDING, true)
    const auth = firebase.auth()
    const email = credentials.email
    const pass = credentials.pass
    const credential = firebase.auth.EmailAuthProvider.credential(email, pass)
    auth.currentUser.linkWithCredential(credential).then(function (user) {
      dispatch('setNotification', {
        type: 'success',
        message: 'Email account & password has been linked.',
        duration: 5000
      })
      var provider = {
        id: 'password',
        info: null,
        linked: true,
        pending: false
      }
      commit(types.SET_PASSWORD_AUTH_LINKING_PENDING, false)
      commit(types.SET_USERS_LINKED_AUTH_PROVIDERS, provider)
    }, function (error) {
      // If it's auth/requires-recent-login, prompt the user to re-authenicate
      if (error.code === 'auth/requires-recent-login') {
        dispatch('setNotification', {
          type: 'info',
          message: 'Please reauthenticate.' + error.message,
          duration: 5000
        })
        commit(types.REAUTH_REQUIRED, true)
        const reAuthInfo = {}
        // Temporarily commit the email & pass to store, prior to re-authing
        reAuthInfo.email = email
        reAuthInfo.pass = pass
        commit(types.REAUTH_INFO, reAuthInfo)
        commit(types.REAUTH_TRIGGERED_BY, 'linkEmailAuthProvider')
        commit(types.SET_PASSWORD_AUTH_LINKING_PENDING, false)
      } else {
        // Otherwise, set the error
        dispatch('setNotification', {
          type: 'danger',
          message: error.message,
          duration: 5000
        })
        commit(types.SET_PASSWORD_AUTH_LINKING_PENDING, false)
      }
    })
  },
  linkAuthProvider ({commit, dispatch}, providerId) {
    const auth = firebase.auth()
    const provider = {}

    if (providerId === 'google.com') {
      provider.type = new firebase.auth.GoogleAuthProvider()
    } else if (providerId === 'facebook.com') {
      provider.type = new firebase.auth.FacebookAuthProvider()
    } else if (providerId === 'github.com') {
      provider.type = new firebase.auth.GithubAuthProvider()
    } else {
      provider.type = new firebase.auth.GoogleAuthProvider()
    }

    auth.currentUser.linkWithPopup(provider.type).then(function (result) {
      // Accounts successfully linked.
      // var credential = result.credential
      // var user = result.user
      // ...
      dispatch('setNotification', {
        type: 'success',
        message: providerId + ' account has been linked.',
        duration: 5000
      })
      var provider = {
        id: providerId,
        info: null,
        linked: true,
        pending: false
      }
      commit(types.SET_USERS_LINKED_AUTH_PROVIDERS, provider)
    }).catch(function (error) {
        // Handle Errors here.
        // ...
      dispatch('setNotification', {
        type: 'danger',
        message: error.message,
        duration: 5000
      })
    })
  },
  unlinkAuthProvider ({commit, dispatch}, providerId) {
    var auth = firebase.auth()
    auth.currentUser.unlink(providerId).then(function () {
      var provider = {
        id: providerId,
        info: null,
        linked: false,
        pending: false
      }
      commit(types.SET_USERS_LINKED_AUTH_PROVIDERS, provider)
      dispatch('setNotification', {
        type: 'warning',
        message: providerId + ' account has been unlinked.',
        duration: 5000
      })
    }).catch(function (error) {
      dispatch('setNotification', {
        type: 'danger',
        message: error.message,
        duration: 5000
      })
    })
  },
  setAuthProviders ({commit}) {
    var auth = firebase.auth()
    var providerData = auth.currentUser.providerData
    for (var key in providerData) {
      if (providerData.hasOwnProperty(key)) {
        // console.log(providerData[key].providerId)
        var providerInfo = providerData[key]
        var providerId = providerData[key].providerId
        var provider = {
          id: providerId,
          info: providerInfo,
          linked: true,
          pending: false
        }
        commit(types.SET_USERS_LINKED_AUTH_PROVIDERS, provider)
      }
    }
  },
  onAuthStateNotAuthenticated ({commit}, user) {
    commit(types.SET_USER, user)
    commit(types.SET_UI_LOGIN_DISABLED, false)
    commit(types.SET_AUTH_PENDING, false)
  },
  onAuthStateAuthenticated ({commit, dispatch}, user) {
    dispatch('setAuthProviders')
    if (user) {
      // User is signed in.
      // Check if the user exists in /users ref.  Returns true or false.
      var ref = firebase.database().ref('users/' + user.uid).once('value')

      ref.then(function (snapshot) {
        var userIdInDatabase = snapshot.hasChild('uid') // true
        if (userIdInDatabase) {
          console.log('User ref exists.')
          // Update firebase ref users/uid/loggedIn boolean to true
          const userRef = firebase.database().ref('users/' + user.uid)
          userRef.update({'loggedIn': 'true'})
        } else {
          console.log('User ref does not exist. Creating...')
          // Update firebase ref users/uid/loggedIn boolean to true (this also creates the parent UID object)
          const userRef = firebase.database().ref('users/').child(user.uid)
          userRef.update({'loggedIn': 'true', 'uid': user.uid}).catch(onReject).then(function () {
            console.log('User ref created.')
          })
        }
      })
    }

    commit(types.SET_USER, user)
    commit(types.SET_AUTH_PENDING, false)
    commit(types.SET_LOGGED_IN, true)
    commit(types.SET_UI_LOGIN_DISABLED, true)
    commit(types.SET_UI_LOGIN_BTN_TEXT, 'Logged in with Google.')
  },
  setUser ({commit, dispatch}, user) {
    commit(types.SET_USER, user)
  },
  setLoggedIn ({commit, dispatch}, isLoggedIn) {
    commit(types.SET_LOGGED_IN, isLoggedIn)
  },
  setUIloginDisabled ({commit, dispatch}, loginBtnDisabled) {
    commit(types.SET_UI_LOGIN_DISABLED, loginBtnDisabled)
  },
  setUIloginBtnText ({commit, dispatch}, string) {
    commit(types.SET_UI_LOGIN_BTN_TEXT, string)
  },
  setAuthPending ({commit, dispatch}, authPending) {
    commit(types.SET_AUTH_PENDING, authPending)
  },
  setError ({commit, dispatch}, error) {
    commit(types.SET_ERROR, error)
  },
  signOut ({getters, commit, dispatch, state}) {
    // Update firebase ref users/uid/loggedIn boolean to false
    const userRef = firebase.database().ref('users/' + getters.user.uid)
    userRef.update({'loggedIn': 'false'})

    // Set the auth.user state to null
    commit(types.SET_USER, null)

    // Set logged in within auth state
    commit(types.SET_LOGGED_IN, false)
    commit(types.SET_UI_LOGIN_BTN_TEXT, 'Sign in with Google.')

    // Signout of Firebase
    firebase.auth().signOut()
    router.push('/') // Redirect to home after logout

    // Dispatch the default notification for logging out
    dispatch('setNotification', getters.defaultNotifications.loggedOutMessage)
  },
  googleSignIn ({getters, commit, dispatch, state}) {
    commit(types.SET_AUTH_PENDING, true)

    // If there's no current user
    if (!firebase.auth().currentUser) {
      // [START createprovider]
      var provider = new firebase.auth.GoogleAuthProvider()
      // [END createprovider]
      // [START signin]
      firebase.auth().signInWithPopup(provider).then(function (result) {
        // Disable login button
        commit(types.SET_UI_LOGIN_DISABLED, true)
        // Set logged in within auth state
        commit(types.SET_LOGGED_IN, true)
        // Add the signed-in user info to state
        commit(types.SET_USER, result.user)

        // Finish authing
        commit(types.SET_AUTH_PENDING, false)
        commit(types.SET_UI_LOGIN_BTN_TEXT, 'Logged in with Google.')

        // Dispatch the default notification for logging in
        dispatch('setNotification', getters.defaultNotifications.loggedInMessage)
      }).catch(function (error) {
        // Handle Errors here.
        commit(types.SET_ERROR, error)
        // [START_EXCLUDE]
        if (error.code === 'auth/account-exists-with-different-credential') {
          dispatch('setNotification', getters.defaultNotifications.accountExistsDifferentWithCredential)
          // If you are using multiple auth providers on your app you should handle linking
          // the user's accounts here.
          console.error(error)
        } else {
          console.error(error)
        }
        // [END_EXCLUDE]
      })
      // [END signin]
    }
  },
  signIn ({getters, commit, dispatch, state}, signInMethod) {
    commit(types.SET_AUTH_PENDING, true)

    // If there's no current user
    if (!firebase.auth().currentUser) {
      const provider = {}
      if (signInMethod === 'google') {
        provider.type = new firebase.auth.GoogleAuthProvider()
      } else if (signInMethod === 'facebook') {
        provider.type = new firebase.auth.FacebookAuthProvider()
      } else if (signInMethod === 'github') {
        provider.type = new firebase.auth.GithubAuthProvider()
      } else {
        provider.type = new firebase.auth.GoogleAuthProvider()
      }

      // [START createprovider]
      // var provider = new firebase.auth.GoogleAuthProvider()
      // [END createprovider]
      // [START signin]
      firebase.auth().signInWithPopup(provider.type).then(function (result) {
        // Disable login button
        commit(types.SET_UI_LOGIN_DISABLED, true)
        // Set logged in within auth state
        commit(types.SET_LOGGED_IN, true)
        // Add the signed-in user info to state
        commit(types.SET_USER, result.user)

        // Finish authing
        commit(types.SET_AUTH_PENDING, false)
        commit(types.SET_UI_LOGIN_BTN_TEXT, 'Logged in with Google.')

        // Dispatch the default notification for logging in
        dispatch('setNotification', getters.defaultNotifications.loggedInMessage)
      }).catch(function (error) {
        // Handle Errors here.
        commit(types.SET_ERROR, error)
        // [START_EXCLUDE]
        if (error.code === 'auth/account-exists-with-different-credential') {
          dispatch('setNotification', getters.defaultNotifications.accountExistsDifferentWithCredential)
          // If you are using multiple auth providers on your app you should handle linking
          // the user's accounts here.
        } else if (error.code === 'auth/wrong-password') {
          console.error(error)
          dispatch('setNotification', {
            type: 'danger',
            message: error.message,
            duration: 5000
          })
        } else {
          console.log(error)
        }
        // [END_EXCLUDE]
      })
      // [END signin]
    }
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}
