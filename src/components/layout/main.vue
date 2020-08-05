<template>
  <div class="wrapper">
    <navbar
      :sidebarTogglable="sidebarTogglable"
      :sidebarActive="sidebarActive"
      :headCollapse="headCollapse"
      @toggleSidebar="toggleSidebar"
      @toggleHeadCollapse="toggleHeadCollapse"
    ></navbar>
    <div class="content">
      <div v-if="layerActive" class="layer" @click="closeLayer"></div>
      <sidebar :sidebarActive="sidebarActive" @toggleSidebar="toggleSidebar"></sidebar>
      <router-view :key="timer" />
    </div>
  </div>
</template>

<script>
import navbar from "@/components/layout/navbar.vue";
import sidebar from "@/components/layout/sidebar.vue";

export default {
  name: "home",
  data() {
    return {
      sidebarTogglable: false,
      sidebarActive: false,
      headCollapse: false,
      layerActive: false,
      timer: ""
    };
  },
  components: {
    navbar,
    sidebar
  },
  watch: {
    "$route.params": {
      handler() {
        // console.log(v)
        this.handleLoaded();
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.$store.dispatch("TagList/getTags");
  },
  mounted() {
    this.$nextTick(() => {
      this.detectiveWidth();
      window.addEventListener("resize", this.detectiveWidth);
    });
  },
  methods: {
    detectiveWidth() {
      const windowWidth = window.innerWidth;
      if (windowWidth > 1024) {
        this.sidebarTogglable = false;
      } else {
        this.sidebarTogglable = true;
      }
    },
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
    handleLoaded() {
      this.timer = new Date().getTime();
    },
    closeLayer() {
      this.sidebarActive = false;
      this.headCollapse = false;
      this.layerActive = false;
    }
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener("resize", this.detectiveWidth);
    next();
  }
};
</script>

<style lang="scss" scoped>
.layer {
  position: absolute;
  z-index: 99;
  width: 100%;
  height: calc(100% - 60px);
  background-color: rgba($color: #000000, $alpha: 0.8);
}
</style>
