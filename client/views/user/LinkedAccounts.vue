<template>
  <div>
    <transition name="scaleFade" mode="out-in" appear>
      <div v-if="!authProviders.password.linked" class="message is-warning">
        <div class="message-header">
          <p><i class="fa fa-warning"></i> No password set</p>
        </div>
        <div class="message-body">
        <p>To allow logging in with just your email, you need to set a password to access your account with.</p>
        <hr>
        <transition name="scaleFade" mode="out-in" appear>
          <div v-if="passwordAuthLinkingPending" class="loading-pane padded has-text-centered" key="loading">
            <i class="fa fa-spinner fa-spin fa-lg"></i>
          </div>
          <pass-form v-if="!passwordAuthLinkingPending" v-on:confirmed-password="linkAuthProviderWithCredential($event)" key="form"></pass-form>
        </transition>
        </div>
      </div>
    </transition>
    <hr>
    <p class="subtitle">Linked Acounts</p>
      <transition name="scaleFadeUp" mode="out-in" appear>
    <div class="field is-grouped is-grouped-multiline">
        <div class="control"
            v-for="(provider, index) in authProviders"
            v-bind:index="index"
            v-bind:key="provider.id"
          >
          <div class="tags has-addons">
            <span class="tag icon">
                <i class="fa fa-home" :class="{
                  'fa-facebook': provider.id === 'facebook.com',
                  'fa-google': provider.id === 'google.com',
                  'fa-github': provider.id === 'github.com',
                  'fa-lock': provider.id === 'password',
                   }">
                </i>
            </span>
            <span v-if="provider.id !== 'password'" class="tag is-default">{{ provider.id }}</span>
            <span v-if="provider.id === 'password'" class="tag is-default"> Email / Password</span>
            <transition name="scaleFade" mode="out-in" appear>
              <span v-if="provider.linked === true" class="tag is-success" key="linked">Linked</span>
              <span v-if="provider.linked === false" class="tag is-dark"  key="unlinked">Unlinked</span>
            </transition>
            <transition name="scaleFade" mode="out-in" appear>
              <a v-if="provider.linked === false && provider.id !== 'password'" class="tag is-warning" @click="linkAuthProvider(provider.id)" key="link">Link</a>
              <a v-if="provider.linked === true" class="tag is-delete" @click="unlinkAuthProvider(provider.id)" key="unlink"></a>
            </transition>
          </div>
        </div>
    </div>
      </transition>
    <re-authenticate-modal :visible="reAuthRequired"></re-authenticate-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PassForm from './PassForm'
import ReAuthenticateModal from './modals/ReAuthenticate'

export default {

  name: 'LinkedAccounts',
  components: {
    PassForm,
    ReAuthenticateModal
  },
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters({
      authProviders: 'authProviders',
      passwordAuthLinkingPending: 'passwordAuthLinkingPending',
      user: 'user',
      reAuthRequired: 'reAuthRequired'
    })
  },
  methods: {
    ...mapActions([
      'linkAuthProvider',
      'linkEmailAuthProvider',
      'unlinkAuthProvider'
    ]),
    linkAuthProviderWithCredential (event) {
      const email = this.user.email
      const pass = event
      const credential = {
        'email': email,
        'pass': pass
      }
      this.linkEmailAuthProvider(credential)
    }
  }
}
</script>

<style lang="css" scoped>

.padded {
  padding:10px;
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

.scaleFadeUp-enter-active, .scaleFadeUp-leave-active {
  opacity: 1;
  transform: scale(1.0);
  transition: all .25s ease-in-out;
}
.scaleFadeUp-enter, .scaleFadeUp-leave-active {
  opacity: 0;
  transform:scale(0.9);
}
</style>
