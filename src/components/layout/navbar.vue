<template>
  <div class="navbar" :class="{ 'p-0': sidebarTogglable }">
    <b-button class="ml-2" @click="toggleSidebar" v-if="sidebarTogglable">
      <font-awesome-icon :icon="['fas', 'bars']" />
    </b-button>
    <div class="head-bar mr-2">
      <h2 class="title">Material Ball</h2>
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
.navbar {
  background-color: #ffffff;
  color: #585858;
  min-height: 60px;
  max-height: 60px;
  border-bottom: 2px solid #000000;
}
</style>
