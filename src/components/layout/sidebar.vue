<template>
  <div id="sidebar" :class="{ active: sidebarActive }">
    <div class="sidebar-head p-2">
      <!-- <b-button class="mr-2" v-if="!sidebarTogglable">
        <font-awesome-icon :icon="['fas', 'bars']" />
      </b-button> -->
      <div class="block-container h-50">
        <b-button class="px-1">
          <font-awesome-icon :icon="['fas', 'user']" size="lg" />
        </b-button>
        <b-button class="px-1" @click="routerTo">
          <font-awesome-icon :icon="['fas', 'heart']" size="lg" />
        </b-button>
      </div>
      <div class="block-container h-50 px-2">
        <SearchBar @closeLayer="closeLayer"></SearchBar>
      </div>
    </div>
    <SidebarContent @closeLayer="closeLayer" :queryMode="queryMode"></SidebarContent>
  </div>
</template>

<script>
import SearchBar from "@/components/SearchBar.vue";
import SidebarContent from "@/components/layout/SidebarContent.vue";

export default {
  name: "sidebar",
  components: {
    SearchBar,
    SidebarContent
  },
  props: {
    sidebarActive: Boolean,
    sidebarTogglable: Boolean,
    queryMode: Boolean
  },
  data() {
    return {};
  },
  methods: {
    routerTo() {
      this.$router.push({ name: "favorite" });
      this.closeLayer();
    },
    closeLayer() {
      this.$emit("closeLayer");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/ThemColors.scss";

* {
  scrollbar-width: thin;
  scrollbar-color: #f2f2f2 #000000;
}

*::-webkit-scrollbar {
  width: 12px;
}

*::-webkit-scrollbar-track {
  background: #f2f2f2;
}

*::-webkit-scrollbar-thumb {
  background-color: #000000;
  border-radius: 20px;
  border: 3px solid #f2f2f2;
}

.btn:focus,
.btn.focus {
  outline: 0;
  box-shadow: none;
}

.block-container {
  display: flex;
  align-items: center;
}

.tag-search-area {
  padding: 0.4rem;
}
</style>
