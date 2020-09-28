<template>
  <div class="wrapper">
    <div class="content">
      <navbar
        :sidebarTogglable="sidebarTogglable"
        :sidebarActive="sidebarActive"
        :headCollapse="headCollapse"
        @toggleSidebar="toggleSidebar"
        @toggleHeadCollapse="toggleHeadCollapse"
      >
      </navbar>
      <router-view :key="$route.path"></router-view>
    </div>
    <div v-if="layerActive" class="layer" @click="closeLayer"></div>
    <sidebar
      :sidebarActive="sidebarActive"
      :sidebarTogglable="sidebarTogglable"
      @toggleSidebar="toggleSidebar"
      @closeLayer="closeLayer"
    ></sidebar>
  </div>
</template>

<script>
import navbar from "@/components/layout/navbar.vue";
import sidebar from "@/components/layout/sidebar.vue";
import { DetectiveWidth } from "@/mixins/mixin.detectiveWidth";

export default {
  name: "MainLayout",
  components: {
    navbar,
    sidebar
  },
  mixins: [DetectiveWidth],
  data() {
    return {
      sidebarActive: false,
      headCollapse: false,
      layerActive: false
    };
  },
  methods: {
    toggleSidebar() {
      // 判斷 sidebar 能否開關
      if (this.sidebarTogglable === false) return;

      if (this.headCollapse === true) {
        this.sidebarActive = true;
        this.headCollapse = false;
        return;
      }

      this.sidebarActive = !this.sidebarActive;
      this.layerActive = !this.layerActive;
    },
    toggleHeadCollapse() {
      if (this.sidebarActive === true) {
        this.headCollapse = true;
        this.sidebarActive = false;
        return;
      }

      this.headCollapse = !this.headCollapse;
      this.layerActive = !this.layerActive;
    },
    closeLayer() {
      this.sidebarActive = false;
      this.headCollapse = false;
      this.layerActive = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.layer {
  position: absolute;
  z-index: 99;
  width: 100%;
  height: 100%;
  background-color: rgba($color: #000000, $alpha: 0.8);
}
</style>
