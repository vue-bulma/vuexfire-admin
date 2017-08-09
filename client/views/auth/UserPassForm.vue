<template>
  <form  method="post" action="/login" id="login" v-on:submit.prevent autocomplete="on">
    <div class="field">
      <label for="email">Email</label>
      <p class="has-icon has-icon-right" :class="{ 'control': true }">
  <!--         <input
          v-validate="'required|email'"
          :class="{'input': true,
          'is-danger': errors.has('email')}"
          name="email" type="text" placeholder="Email"> -->
          <input
            id="email" name="email" type="email" placeholder="Email" autocomplete="email"
            v-model="email"
            v-validate="'required|email'"
            :class="{'input': true,
            'is-danger': errors.has('email'),
            'is-success': emailFlags.dirty && !errors.has('email')
            }"
          >
          <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
          <span v-show="errors.has('email')" class="icon is-small">
            <i class="fa fa-warning"></i>
          </span>
          <span v-show="emailFlags.dirty && !errors.has('email')" class="icon is-small">
            <i class="fa fa-check"></i>
          </span>
      </p>
    </div>
    <div class="field">
      <label for="password">Password</label>
      <p class="control has-icon has-icon-right">
          <input
            name="password" id="password" autocomplete="password" type="password" placeholder="Password"
            v-model="password"
            v-validate="'required|min:8'"
            :class="{'input': true, 'is-danger': errors.has('password') }"
          >
          <span v-show="errors.has('password')" class="icon is-small">
            <i class="fa fa-warning"></i>
          </span>
          <span v-show="errors.has('password')" class="help is-danger">{{ errors.first('password') }}</span>
      </p>
    </div>
    <div class="field">
    <p class="control">
      <input type="submit"
      v-bind:class="{ 'is-loading': authUI.pending }"
      @click="signInWithPass(credentials)"
      class="button is-primary"
      >
    </p>
    </div>
  </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { mapFields } from 'vee-validate'

export default {

  name: 'UserPassForm',
  data () {
    return {
      'email': '',
      'password': ''
    }
  },
  methods: {
    ...mapActions([
      'signInWithPass'
    ])
  },
  computed: {
    credentials () {
      return {
        'email': this.email,
        'pass': this.password
      }
    },
    ...mapGetters({
      'authUI': 'authUI'
    }),
    ...mapFields({
      'emailFlags': 'email',
      'passwordFlags': 'password'
    })
  }
}
</script>

<style lang="css" scoped>
</style>
