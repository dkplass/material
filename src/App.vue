<template>
  <div id="app">
    <router-view />
    <UserInfo></UserInfo>
  </div>
</template>

<script>
import UserInfo from "@/components/UserInfo.vue";

export default {
  components: {
    UserInfo
  },
  created() {
    this.$store.dispatch("Favorite/getFavorite");
  },
  computed: {
    isLogin() {
      return this.$store.state.Authenticate.isLogin;
    }
  }
};
</script>

<style lang="scss">
@import "./assets/css/main.scss";
</style>
