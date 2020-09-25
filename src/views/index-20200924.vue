<template>
  <div class="wrapper">
    <div class="content">
      <navbar
        :sidebarTogglable="sidebarTogglable"
        :sidebarActive="sidebarActive"
        :headCollapse="headCollapse"
        @toggleSidebar="toggleSidebar"
        @toggleHeadCollapse="toggleHeadCollapse"
      ></navbar>
      <b-overlay
        :show="loading"
        bg-color="#3b3b3b"
        opacity="1"
        spinner-small
        spinner-variant="secondary"
        class="fetching-overlay"
      >
        <div class="wrapper" v-if="!loading">
          <SampleContainer></SampleContainer>
        </div>
      </b-overlay>
    </div>
    <div v-if="layerActive" class="layer" @click="closeLayer"></div>
    <sidebar
      :sidebarActive="sidebarActive"
      :sidebarTogglable="sidebarTogglable"
      :queryMode="queryMode"
      @toggleSidebar="toggleSidebar"
      @closeLayer="closeLayer"
    ></sidebar>
  </div>
</template>

<script>
import navbar from "@/components/layout/navbar.vue";
import sidebar from "@/components/layout/sidebar.vue";
import SampleContainer from "@/components/shelf/SampleContainer.vue";
import { mapGetters } from "vuex";

export default {
  name: "Index",
  data() {
    return {
      sidebarTogglable: false,
      sidebarActive: false,
      headCollapse: false,
      layerActive: false
    };
  },
  components: {
    navbar,
    sidebar,
    SampleContainer
  },
  mounted() {
    this.$nextTick(() => {
      this.detectiveWidth();
      window.addEventListener("resize", this.detectiveWidth);
    });
  },
  computed: {
    ...mapGetters({
      loading: "loading",
      queryMode: "queryMode"
    })
    // ...mapGetters("TagList", {
    //   selectedTags: "getSelectedTags"
    // }),
    // ...mapGetters("Sample", {
    //   retrieveSamples: "retrieveSamples"
    // })
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
.fetching-overlay {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.layer {
  position: absolute;
  z-index: 99;
  width: 100%;
  height: 100%;
  background-color: rgba($color: #000000, $alpha: 0.8);
}

.conditions-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  height: fit-content;
  min-height: 3rem;
  margin: 0 auto;
  border-bottom: 2px solid #000000;

  .tags {
    display: inline-flex;
    margin: 0.2rem;
    padding: 0.1rem 0.4rem;
    color: #ffffff;
    background-color: #f17f7f;
    border-radius: 0.4rem;
    white-space: nowrap;
    cursor: default;
  }
}
</style>
