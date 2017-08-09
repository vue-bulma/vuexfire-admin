import firebase from 'firebase'
import store from '../../../store'
//
//
// Functions and Helpers for auth store.

//
// Check if a user exists in the /users ref
//
const checkUserExists = function (userId) {
  var ref = firebase.database().ref('users/' + userId)

  var checkUserId = ref.once('value')
  .then(function (snapshot) {
    var userIdInDatabase = snapshot.hasChild('uid') // true
    console.log(userIdInDatabase)
    if (userIdInDatabase) {
      // console.log('User Database Record:')
      // console.log(snapshot.child(userId).val())
      return true
    } else {
      // console.log('User Database Record:')
      // console.log(snapshot.child(userId).val())
      return false
    }
  })
  // console.log(checkUserId)
  checkUserId.then(function (result) {
    // console.log(result)
    store.dispatch('setNotification', {
      type: 'primary',
      message: 'checkUserExists(): ' + result
    })
    return result
  })
  // if (checkUserId) {
  //   return true
  // } else {
  //   return false
  // }
}

// Function to call if access denied.
function onReject (rejection) {
  store.dispatch('setNotification', {
    type: 'danger',
    message: rejection.message
  })
}

export {
  checkUserExists,
  onReject
}
