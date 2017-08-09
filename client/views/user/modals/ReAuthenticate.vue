<template>
  <modal :visible="visible" @close="close">
    <div class="box">
        <div class="content">
        <transition name="scaleFade" mode="out-in" appear>
          <div v-if="authUI.pending" class="loading-pane padded has-text-centered" key="loading">
            <p class="subtitle has-text-centered">Re-authenticating</p>
            <i class="fa fa-spinner fa-spin fa-lg"></i>
          </div>
          <div  v-if="!authUI.pending" key="tabs">
            <p class="subtitle has-text-centered">Re-authenticate by signing in with one of your linked accounts</p>
            <tabs layout="left" animation="fade" :only-fade="false">
              <tab-pane class="signInTabPane" v-for="item in signInProviderTabs" :key="item.label" :label="item.label" :icon="'fa fa-' + item.icon">
                <div class="padded-box">
                  <div class="card">
                    <div class="card-header">
                      <transition name="scaleFade" mode="out-in">
                        <p v-if="authUI.loginBtnDisabled" class="card-header-title">{{ item.desc }}</p>
                      </transition>
                    </div>
                    <div
                    v-if="item.type === 'form' && !authUI.loginBtnDisabled"
                    class="card-content">
                      <user-pass-form></user-pass-form>
                      <div class="control">
                      </div>
                    </div>
                    <div class="card-footer">
                      <a
                        @click="reAuth(item.icon)"
                        class="button is-primary card-footer-item"
                        v-if="item.type === 'button'"
                        v-bind:class="{ 'is-loading': authUI.pending }"
                        id="quickstart-sign-in"> <i :class="'fa fa-pull-left fa-' + item.icon"></i> Reauthenticate
                      </a>
                    </div>
                  </div>
                </div>
              </tab-pane>
            </tabs>
          </div>
        </transition>
        </div>
    </div>
  </modal>
</template>

<script>
import { Modal } from 'vue-bulma-modal'
import { Tabs, TabPane } from 'vue-bulma-tabs'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    Modal,
    Tabs,
    TabPane
  },
  data () {
    return {
      signInProviderTabs: [
        {
          icon: 'google',
          label: 'Google',
          type: 'button',
          desc: 'Reauthenticate with google'
        },
        {
          icon: 'facebook',
          label: 'Facebook',
          type: 'button',
          desc: 'Reauthenticate with Facebook'
        },
        {
          icon: 'github',
          label: 'Gitub',
          type: 'button',
          desc: 'Reauthenticate with Github'
        }
      ]
    }
  },
  props: {
    visible: Boolean
  },
  methods: {
    close () {
      this.$emit('close')
    },
    ...mapActions([
      'reAuth'
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
.padded-box {
  padding:1px;
}
.signInTabPane {
    padding: 0;
    margin: 0 !important;
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
