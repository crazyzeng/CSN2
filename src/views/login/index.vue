<template>
  <div class="th-login-container">
    <blue-login v-if="getThemeType() == 'blue'"></blue-login>
    <white-login v-else-if="getThemeType() == 'white'"></white-login>
  </div>
</template>

<script>
import BlueLogin from './components/BlueLogin/index.vue'
import WhiteLogin from './components/WhiteLogin/index.vue'
import loginBgUrl from '@/assets/theme/loginBg.png'
export default {
  name: 'Login',
  components: { BlueLogin, WhiteLogin },
  computed: {
    getLoginBgUrl() {
      return loginBgUrl
    }
  },
  methods: {
    getThemeType() {
      return this.$store.getters.themeType
    }
  }
}
</script>

<style lang="scss" scoped>
.th-login-container {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-repeat: no-repeat;
  background-position: center;
  overflow: hidden;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  // background: url('@/assets/theme/loginBg.png');
}
</style>
