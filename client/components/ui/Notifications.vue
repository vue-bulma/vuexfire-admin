<template>
  <div class="notifications">
      <transition-group  name="notifications" tag="div">
        <notification
          v-for="(item, index) in notifications"
          v-bind:index="index"
          v-bind:key="item.id"
          :type="item.type"
          :message="item.message"
          :container="'.notifications'"
          :direction="'right'"
          :duration="item.duration"
          :id="item.id"
          @closed-by-user="destroyNotification(item)"
          @closed-automatically="destroyNotification(item)"
          class="notification-item"
          >
        </notification>
      </transition-group>
  </div>
</template>

<script>
import Notification from 'vue-bulma-notification'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Notification
  },
  computed: mapGetters({
    notifications: 'notifications'
  }),
  methods: {
    ...mapActions([
      'destroyNotification'
    ])
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

.notifications-item {
  display: inline-block;
  margin-right: 10px;
}
.notifications-enter-active, .notifications-leave-active {
  transition: all .5s;
}
.notifications-enter /* .notifications-leave-active for <2.1.8 */ {
  opacity: 0;
  transform: translateX(30px);
}
.notifications-leave-to {
  opacity:0;
  transform: translateX(-30px);
}
.notifications-leave {
  opacity:1;
  transform: translateX(30px);
}
.notifications-move {
  transition: transform .25s;
}
</style>
