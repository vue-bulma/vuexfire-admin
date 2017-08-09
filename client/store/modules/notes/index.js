import { firebaseAction } from 'vuexfire'
import * as types from '../../mutation-types'
import * as firebase from 'firebase'
import * as refTypes from '../../../firebase-setup/ref-types'
// Firebase Setup

// Set Messages refx
const state = {
  notes: [],
  newNote: {},
  newNoteContents: {},
  UI: {
    loading: false
  }
}

const mutations = {
  [types.SET_NEW_NOTE_CONTENTS] (state, noteContents) {
    state.newNoteContents = noteContents
  },
  [types.SET_NEW_NOTE] (state, note) {
    state.newNote = note
  },
  [types.ADD_NOTE] (state, note) {
    state.notes.push(note)
  },
  [types.NOTES_LOADING] (state, isLoading) {
    state.UI.loading = isLoading
  }
}

const getters = {
  newNote: state => state.newNote,
  newNoteContents: state => state.newNoteContents,
  notes: state => state.notes,
  loadingNotes: state => state.UI.loading
}

const actions = {
  // On change of add note input, calls GET_NOTE mutation with data from add not input
  setNoteContents ({commit}, noteContents) {
    commit(types.SET_NEW_NOTE_CONTENTS, noteContents)
  },
  setNewNote ({commit}, note) {
    commit(types.SET_NEW_NOTE, note)
  },
  isLoading ({commit, state}) {
    var notesInStore = state.notes
    if (notesInStore === undefined || notesInStore.length === 0) {
      commit(types.NOTES_LOADING, true)
    } else {
      commit(types.NOTES_LOADING, false)
    }
  },
  addNote ({commit, getters, state}) {
    var uid = getters.user.uid
    var userNotes = firebase.database().ref(refTypes.NOTES).child(uid)
    // Push to firebase
    userNotes.push({
      title: state.newNote.title,
      text: state.newNoteContents,
      completed: false
    })
  },
  removeNote ({commit, getters}, note) {
    var uid = getters.user.uid
    var notes = firebase.database().ref(refTypes.NOTES).child(uid)
    notes.child(note['.key']).remove()
  },
  setNotesRef: firebaseAction(({ bindFirebaseRef, rootState }, ref) => {
    bindFirebaseRef(refTypes.NOTES, ref)
  }),
  initNotesRef ({dispatch, rootState}) { // Init notes ref in App.vue
    dispatch('isLoading')
    // var userNotes = firebase.database().ref(refTypes.NOTES)
    // firebase.database().ref(refTypes.NOTES).orderByChild('uid').equalTo(rootState.auth.user.uid).once('value', function (snapshot) {
    //   console.log(snapshot.val())
    // })
    // var userNotes = firebase.database().ref(refTypes.NOTES)
    var userNotes = firebase.database().ref(refTypes.NOTES).child(rootState.auth.user.uid)
    console.log(rootState.auth.user.uid)
    dispatch('setNotesRef', userNotes)
    dispatch('isLoading')
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
