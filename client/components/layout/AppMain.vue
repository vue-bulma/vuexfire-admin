<template>
  <section class="app-main" :style="[hiddenSidebarStyle]">
    <div class="container is-fluid is-marginless app-content">
      <levelbar></levelbar>
      <transition
        mode="out-in"
        enter-active-class="fadeIn"
        leave-active-class="fadeOut"
        appear>
        <router-view class="animated"></router-view>
      </transition>
    </div>
  </section>

</template>

<script>
// import firebase from 'firebase'
import Levelbar from './Levelbar'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      sidebar: 'sidebar'
    }),
    hiddenSidebarStyle () {
      return this.sidebar.hidden ? { 'margin-left': 0 } : null
    }
  },
  components: {
    Levelbar
  },
  created: function () {
    // Setup Firebase onAuthStateChanged handler
    //
    // https://firebase.google.com/docs/reference/js/firebase.auth.Auth
    // https://firebase.google.com/docs/reference/js/firebase.auth.Auth#onAuthStateChanged
    // var user = this.$store.getters.getUser;
    this.$firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        this.$store.dispatch('onAuthStateAuthenticated', user)
      } else {
        this.$store.dispatch('setUIloginDisabled', false)
        this.$store.dispatch('setUser', null)
        this.$store.dispatch('setAuthPending', false)
        // https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signInAnonymously
        // firebase.auth().signInAnonymously().catch(console.error)
      }
    }.bind(this))
  }
}
</script>

<style lang="scss">
@import '~bulma/sass/utilities/variables';
@import '~bulma/sass/utilities/mixins';

.app-main {
  padding-top: 50px;
  margin-left: 180px;
  transform: translate3d(0, 0, 0);

  @include mobile() {
    margin-left: 0;
  }

}

.app-content {
  padding: 20px;
}

.notifications {
  position:fixed;
  right:0;
  top:0;
  bottom:0;
}
</style>
