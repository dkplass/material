<template>
  <b-container class="admin-panel p-2">
    <button class="btn btn-primary" @click="querySample">Get Sample</button>
    <button v-if="renderGoBtn" class="btn btn-primary mx-1" @click="goList">Go List</button>
    <router-view :key="$route.fullPath"></router-view>
  </b-container>
</template>

<script>
export default {
  name: "AdminDemo",
  data() {
    return {};
  },
  computed: {
    renderGoBtn() {
      const _path = this.$route.path;

      if (_path.includes("detail")) {
        return true;
      }

      return false;
    }
  },
  methods: {
    querySample() {
      this.$router.push({ name: "list", query: { SampleNo: "YL-O001", ColorNo: "default" } });
    },
    goList() {
      this.$router.push({ name: "list" });
    }
  }
};
</script>

<style lang="scss" scoped></style>
