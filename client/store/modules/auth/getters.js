const user = state => state.user
const authProviders = state => state.user.authProviders
const passwordAuthLinkingPending = state => state.user.authProviders.password.pending
const authStatus = state => state.loggedIn
const authUI = state => state.UI
const reAuthRequired = state => state.UI.reAuthRequired
const reAuthTriggeredBy = state => state.reAuth.reAuthTriggeredBy
const reAuthInfo = state => state.reAuth.info

export {
  user,
  authProviders,
  authStatus,
  authUI,
  passwordAuthLinkingPending,
  reAuthRequired,
  reAuthTriggeredBy,
  reAuthInfo
}
