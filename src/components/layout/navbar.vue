<template>
  <div class="navbar">
    <div class="head-bar">
      <div class="main-panel">
        <h2 class="title text-no-wrap mr-2">
          <router-link to="/main">Yaw Liamy VML</router-link>
          <!-- <img src="@/assets/logo.svg" alt="Logo" class="logo" width="100%" /> -->
        </h2>
        <ResultDisplay></ResultDisplay>
      </div>
    </div>
    <b-button class="mr-2" variant="primary" @click="toggleSidebar" v-if="sidebarTogglable">
      <font-awesome-icon :icon="['fas', 'bars']" size="lg" />
    </b-button>
  </div>
</template>

<script>
import ResultDisplay from "@/components/ResultDisplay.vue";

export default {
  name: "navbar",
  components: {
    ResultDisplay
  },
  props: {
    sidebarTogglable: Boolean,
    sidebarActive: Boolean,
    headCollapse: Boolean
  },
  methods: {
    toggleSidebar() {
      // const $el = document.getElementById("sidebar");
      // $el.classList.toggle("active");

      this.$emit("toggleSidebar");
    },
    toggleHeadCollapse() {
      this.$emit("toggleHeadCollapse");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/ThemColors.scss";

.navbar {
  flex-wrap: nowrap;
}

.tool-area {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  height: 7rem;
  width: 16rem;
  background-color: $secondary;
}

.toggle-btn {
  height: 36px;
}
</style>
