<template>
  <div class="notifications">
  </div>
</template>

<script>
import Vue from 'vue'
import Notification from 'vue-bulma-notification'

const NotificationComponent = Vue.extend(Notification)

const openNotification = (propsData = {
  title: '',
  message: '',
  type: '',
  direction: '',
  duration: 4500,
  container: '.notifications'
}) => {
  return new NotificationComponent({
    el: document.createElement('div'),
    propsData
  })
}

export default {
  components: {
    Notification
  },

  mounted () {
    openNotification({
      message: this.$store.state.auth.notification.text,
      // type: this.$store.state.auth.notification.type,
      type: this.$store.state.auth.notification.type,
      duration: this.$store.state.auth.notification.duration
    })
  },

  methods: {
    openNotificationWithType (type) {
      openNotification({
        title: 'This is a title',
        message: 'This is the message.',
        type: type
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.styles-box .notification {
  margin-bottom: 20px;
}

.button {
  margin: 5px 0 0;
}
</style>
