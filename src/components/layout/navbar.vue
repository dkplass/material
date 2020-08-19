<template>
  <div class="navbar">
    <div class="head-bar">
      <div class="main-panel">
        <h2 class="title text-no-wrap mr-2">
          <router-link to="/main">Yaw Liamy VML</router-link>
          <!-- <img src="@/assets/logo.svg" alt="Logo" class="logo" width="100%" /> -->
        </h2>
      </div>
      <!-- <span
        v-if="sidebarTogglable"
        class="config mx-3 h-100"
        v-b-toggle.head-collapse
        variant="primary"
        @click="toggleHeadCollapse"
      >
        <font-awesome-icon :icon="['fas', 'cog']" />
      </span> -->
    </div>
    <b-button class="mr-2" variant="primary" @click="toggleSidebar" v-if="sidebarTogglable">
      <font-awesome-icon :icon="['fas', 'bars']" size="lg" />
    </b-button>
    <!-- <div class="tool-area" v-if="sidebarTogglable">
      <b-button class="mr-2 toggle-btn" @click="toggleSidebar">
        <font-awesome-icon :icon="['fas', 'bars']" />
      </b-button>
    </div> -->
    <!-- <b-collapse v-model="headCollapse" id="head-collapse" class="w-100">
      <b-card>
        <div class="search-area">
          <b-input></b-input>
        </div>
        <div class="user">
          <font-awesome-icon :icon="['fa', 'user']" :style="{ color: '#000000' }" size="2x" />
        </div>
      </b-card>
    </b-collapse>

    <div v-if="!sidebarTogglable" class="search-area">
      <b-input></b-input>
    </div>
    <div v-if="!sidebarTogglable" class="user">
      <font-awesome-icon :icon="['fa', 'user']" :style="{ color: '#000000' }" size="2x" />
    </div> -->
  </div>
</template>

<script>
export default {
  name: "navbar",
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
