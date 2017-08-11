<template>
  <div class="notes">
      <div class="loadingDog">
        <transition name="loadingDog">
        <p v-if="loadingNotes === true" class="title"><img src="~assets/480.gif" /></p> 
        </transition>
      </div>
      <!-- Incomplete notes -->
      <!-- <transition-group name="scaleFade"> -->
      <article class="media" v-if="!completed" v-for="(note, index) in incompletedNotes"
          v-bind:index="index"
          v-bind:key="note.id"
          >
          <div class="media-content">
            <div class="content">
              <h3 class="h3">{{note.title}}</h3>
              <div v-html="note.text" class="content"></div>
            </div>
            <nav class="level is-mobile">
              <div class="level-left">
                    <p class="field">
                    <button type="button" @click="complete(note)" class="button is-warning is-small"  v-if="!note.completed">
                        <span class="icon">
                            <i class="fa fa-check"></i>
                        </span>
                        <span>Complete</span>
                    </button>
                    <button type="button" @click="complete(note)" class="button is-primary is-small" v-if="note.completed">
                        <span class="icon">
                            <i class="fa fa-check"></i>
                        </span>
                        <span>Completed</span>
                    </button>
                    <!-- <button type="button" @click="edit(note)" class="button is-light is-small">
                        <span class="icon">
                            <icon name="pencil"></icon>
                        </span>
                        <span>Edit</span>
                    </button> -->
                    </p>
              </div>
            </nav>
          </div>
          <div class="media-right">
            <button class="delete" @click="removeNote(note)"></button>
          </div>
        </article>
        <!-- </transition-group> -->
      <!-- Completed Notes -->
      <!-- <transition-group name="scaleFade"> -->
      <article class="media notes-completed" v-if="completed" v-for="(note, index) in completedNotes"
          v-bind:index="index"
          v-bind:key="note.id"
          >
          <div class="media-content">
            <div class="media-left">
            </div>
            <div class="content">
              <h3 class="title is-6">{{note.title}}</h3>
              <small v-html="note.text" class="text">
              </small>
            </div>
            <nav class="level is-mobile">
              <div class="level-left">
                    <p class="field">
                    <button type="button" @click="complete(note)" class="button is-warning is-small"  v-if="!note.completed">
                        <span class="icon">
                            <i class="fa fa-check"></i>
                        </span>
                        <span>Complete</span>
                    </button>
                    <button type="button" @click="complete(note)" class="button is-primary is-small" v-if="note.completed">
                        <span class="icon">
                            <i class="fa fa-check"></i>
                        </span>
                        <span>Completed</span>
                    </button>
                    <!-- <button type="button" @click="edit(note)" class="button is-light is-small">
                        <span class="icon">
                            <icon name="pencil"></icon>
                        </span>
                        <span>Edit</span>
                    </button> -->
                    </p>
              </div>
            </nav>
          </div>
          <div class="media-right">
            <button class="delete" @click="removeNote(note)"></button>
          </div>
        </article>
        <!-- </transition-group> -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import firebase from 'firebase'
import * as refTypes from '../../firebase-setup/ref-types'

export default {
  props: {
    completed: {
      type: Boolean,
      required: false
    }
  },
  methods: {
    complete: function (note) {
      const key = note['.key']
      const uid = this.user.uid
      const ref = firebase.database().ref(refTypes.NOTES + '/' + uid).child(key)

      ref.update({
        completed: !note.completed
      })
    },
    incomplete: function (note) {
      const key = note['.key']
      const uid = this.user.uid
      const ref = firebase.database().ref(refTypes.NOTES + '/' + uid).child(key)

      ref.update({
        completed: false
      })
    },
    ...mapActions([
      'removeNote',
      'isLoading'
    ])
  },
  computed: {
    incompletedNotes: function () {
      return this.notes.filter(function (note) {
        return note.completed === false
      })
    },
    completedNotes: function () {
      return this.notes.filter(function (note) {
        return note.completed === true
      })
    },
    ...mapGetters({
      notes: 'notes',
      loadingNotes: 'loadingNotes',
      user: 'user'
    })
  },
  beforeCreate () {
    this.$store.dispatch('isLoading')
  },
  updated () {
    this.$store.dispatch('isLoading')
  }
}
</script>

<style lang="scss" scoped>
div.notes {
  position:relative;
}

.notes-completed .title, .notes-completed .text {
  text-decoration: line-through;
}


.loadingDog-enter-active, .loadingDog-leave-active {
  opacity: 1;
  transform: scale(1);
  transition: all .25s ease-in-out;
}
.loadingDog-enter, .loadingDog-leave-active {
  opacity: 0;
  transform:scale(1.1);
}
</style>
