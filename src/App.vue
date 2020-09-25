<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  created() {
    this.$store.dispatch("Favorite/getFavorite");
  }
};
</script>

<style lang="scss">
@import "./assets/css/main.scss";
</style>
