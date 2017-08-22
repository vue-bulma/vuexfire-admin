<template>
  <div>
    <div class="field">
      <label class="label">Set Password</label>
      <div class="control has-icon has-icon-right">
        <input
        name="password"
        v-validate="'required|min:8'"
        class="is-small password"
        :class="{'input': true, 'is-danger': errors.has('password') }" type="password" placeholder="Password">
        <span v-show="errors.has('password')" class="icon is-small">
          <i class="fa fa-warning"></i>
        </span>
        <span v-show="errors.has('password')" class="help is-danger">{{ errors.first('password') }}</span>
      </div>
    </div>
    <div class="field has-addons">
      <div class="control has-icon has-icon-right">
        <input
        name="confirm"
        v-model="confirmedPass"
        v-validate="'required|min:8|confirmed:.password'"
        v-on:keyup.13="setConfirmedPass"
        class="is-small confirm-password"
        :class="{'input': true, 'is-danger': errors.has('confirm') }" type="password" placeholder="Confirm">
        <span v-show="errors.has('confirm')" class="icon is-small">
          <i class="fa fa-warning"></i>
        </span>
        <span v-show="errors.has('confirm')" class="help is-danger">{{ errors.first('confirm') }}</span>
      </div>
      <div class="control">
        <button @click="setConfirmedPass" class="button is-default is-small"
        :disabled="!isFormDirty || isFormDirty && confirmFlags.pristine || isFormDirty && confirmFlags.invalid"
        >
           Set
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapFields } from 'vee-validate'

export default {

  name: 'PassForm',
  data () {
    return {
      'confirmedPass': ''
    }
  },
  computed: {
    ...mapFields({
      'passwordFlags': 'password',
      'confirmFlags': 'confirm'
    }),
    isFormDirty () {
      return Object.keys(this.fields).some(key => this.fields[key].dirty)
    }
  },
  methods: {
    setConfirmedPass (event) {
      this.$emit('confirmed-password', this.confirmedPass)
    }
  }
}
</script>

<style lang="css" scoped>
</style>
