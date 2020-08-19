<template>
  <div class="navbar">
    <div class="head-bar">
      <div class="main-panel">
        <h2 class="title text-no-wrap mr-2">
          <router-link to="/main">Yaw Liamy VML</router-link>
        </h2>
        <!-- <slot v-if="infoCollapsable === false" name="infoContent"></slot> -->
        <!-- <template v-if="infoCollapsable === true">
          <div class="custom-detail-btn" v-b-toggle.infoContent>
            <span class="when-close">
              Open Detail
              <font-awesome-icon :icon="['fas', 'caret-down']" />
            </span>
            <span class="when-open">
              Close Detail
              <font-awesome-icon :icon="['fas', 'caret-up']" />
            </span>
          </div>
        </template> -->
      </div>
      <div class="side-panel p-2">
        <div class="block-container top h-50">
          <b-button class="mr-2">
            <font-awesome-icon :icon="['fas', 'user']" size="lg" />
          </b-button>
          <b-button class="mr-2" @click="toggleSideMenu">
            <font-awesome-icon :icon="['fas', 'bars']" size="lg" />
          </b-button>
        </div>
        <div class="block-container h-50 px-2">
          <SearchBar @closeLayer="closeLayer"></SearchBar>
        </div>
      </div>
      <div class="side-panel-fold">
        <b-button class="mr-2" variant="primary" @click="toggleSidebar">
          <font-awesome-icon :icon="['fas', 'bars']" size="lg" />
        </b-button>
      </div>
    </div>
    <!-- <b-collapse v-if="infoCollapsable === true" id="infoContent" class="custom-collapse" is-nav>
      <b-card no-body class="custom-card">
        <slot name="infoContent"></slot>
      </b-card>
    </b-collapse> -->
  </div>
</template>

<script>
import SearchBar from "@/components/SearchBar.vue";

export default {
  name: "SubPageNavbar",
  components: {
    SearchBar
  },
  data() {
    return {
      infoCollapsable: false
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.detectiveInfoDisplay();
      window.addEventListener("resize", this.detectiveInfoDisplay);
    });
  },
  destroyed() {
    window.removeEventListener("resize", this.detectiveInfoDisplay);
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener("resize", this.detectiveInfoDisplay);
    next();
  },
  computed: {},
  methods: {
    detectiveInfoDisplay() {
      const windowWidth = window.innerWidth;

      if (windowWidth > 992) {
        this.infoCollapsable = false;
      } else {
        this.infoCollapsable = true;
      }
    },
    toggleSideMenu() {
      this.$emit("toggleSideMenu");
    },
    toggleSidebar() {
      this.$emit("toggleSidebar");
    },
    closeLayer() {
      this.$emit("closeLayer");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/ThemColors.scss";

.navbar {
  .head-bar {
    .side-panel {
      max-width: 16rem;
      min-width: 16rem;
      color: $primary;
      background-color: $secondary;
      height: 100%;
    }

    .side-panel-fold {
      display: none;
    }
  }
}

.custom-detail-btn {
  border-bottom: 2px solid #f2f2f2;
}

.custom-collapse {
  border-top: 2px solid $secondary;
  border-bottom: 2px solid $secondary;
  margin-right: 0.5rem;
  margin-left: 0.5rem;
  z-index: 9999;
}

.block-container {
  display: flex;
  align-items: center;

  &.top {
    justify-content: space-between;
  }
}

::v-deep .custom-card {
  background-color: rgba($color: $primary, $alpha: 0.8);
  border-radius: 0;
  padding: 0.2rem;
}

@media (max-width: 1024px) {
  .navbar {
    .head-bar {
      .side-panel {
        display: none;
      }

      .side-panel-fold {
        display: block;
      }
    }
  }
}
</style>
