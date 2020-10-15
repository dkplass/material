<template>
  <div class="wrapper admin-panel">
    <SideBar :sidebarTogglable="sidebarTogglable"></SideBar>
    <div class="content">
      <router-view :key="$router.path"></router-view>
    </div>
  </div>
</template>

<script>
import SideBar from "@/components/admin/SideBar.vue";
import { DetectiveWidth } from "@/mixins/mixin.adminDetectiveWidth";

export default {
  name: "AdminLayout",
  components: {
    SideBar
  },
  mixins: [DetectiveWidth],
  data() {
    return {};
  }
};
</script>

<style lang="scss">
@import "@/assets/css/admin.scss";
</style>
