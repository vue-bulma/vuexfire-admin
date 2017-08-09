<template>
<div class="content has-text-centered">
  <h1 class="is-title is-bold">Login</h1>

  <div class="columns is-vcentered">
    <div class="column is-6 is-offset-3">
      <div class="box">
        <div v-show="error" style="color:red; word-wrap:break-word;">{{ error }}</div>
          <div v-if="this.$store.state.auth.loggedIn" class="loggedInAnimation">
          </div>
          <hr>
          <p class="subtitle">Sign in with any of your linked accounts</p>
          <tabs layout="left" animation="fade" :only-fade="false">
            <tab-pane class="signInTabPane" v-for="item in signInProviderTabs" :key="item.label" :label="item.label" :icon="'fa fa-' + item.icon">
              <div class="padded-box">
                <div class="card">
                  <div class="card-header">
                    <transition name="scaleFade" mode="out-in">
                      <p v-if="!authUI.loginBtnDisabled" class="card-header-title">{{ item.desc }}</p>
                    </transition>
                    <transition name="scaleFade" mode="out-in">
                      <p v-if="authUI.loginBtnDisabled" class="card-header-title">You're signed in.</p>
                    </transition>
                  </div>
                  <transition name="scaleFade" mode="out-in" appear>
                    <div
                    v-if="item.type === 'form' && !authUI.loginBtnDisabled"
                    class="card-content">
                      <user-pass-form></user-pass-form>
                    </div>
                  </transition>
                  <div v-if="item.type === 'button' && !authUI.loginBtnDisabled" class="card-footer">
                    <a
                      :disabled="authUI.loginBtnDisabled"
                      @click="signIn(item.icon)"
                      class="card-footer-item"
                      v-bind:class="{ 'is-loading': authUI.pending }"
                      id="quickstart-sign-in"> <i :class="'fa fa-pull-left fa-' + item.icon"></i> Sign in
                    </a>
                  </div>
                </div>
              </div>
            </tab-pane>
          </tabs>
<!--           <p class="control">
            <button
              @click="signOut"
              class="button"
              id="quickstart-sign-in">{{ authUI.logoutButtonText }}
            </button>
          </p> -->
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { Tabs, TabPane } from 'vue-bulma-tabs'
import UserPassForm from './UserPassForm'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    Tabs,
    TabPane,
    UserPassForm
  },
  data () {
    return {
      signInProviderTabs: [
        {
          icon: 'lock',
          label: 'Email',
          type: 'form',
          desc: 'Sign in with your email and password.'
        },
        {
          icon: 'google',
          label: 'Google',
          type: 'button',
          desc: 'Sign in with google'
        },
        {
          icon: 'facebook',
          label: 'Facebook',
          type: 'button',
          desc: 'Sign in with Facebook'
        },
        {
          icon: 'github',
          label: 'Gitub',
          type: 'button',
          desc: 'Sign in with Github'
        }
      ],
      data: {
        body: {
          username: null,
          password: null
        },
        rememberMe: false
      },
      error: null
    }
  },
  methods: {
    ...mapActions([
      'signIn',
      'signOut'
    ])
  },
  computed: {
    ...mapGetters({
      authUI: 'authUI'
    })
  }
}
</script>

<style lang="scss" scoped>
.is-title {
    text-transform: capitalize;
}
.padded-box {
  padding:1px;
}
.signInTabPane {
    padding: 0;
    margin: 0 !important;
}
.loggedInAnimation {
  margin-bottom:1rem;
  // padding:1rem 2rem;
  // display:inline-block;
  }

.scaleFade-enter-active, .scaleFade-leave-active {
  opacity: 1;
  transform: scale(1);
  transition: all .25s ease-in-out;
}
.scaleFade-enter, .scaleFade-leave-active {
  opacity: 0;
  transform:scale(1.1);
}
</style>
