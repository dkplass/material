<template>
  <div class="wrapper">
    <div class="content">
      <subnavbar
        @toggleSideMenu="toggleSideMenu"
        @toggleSidebar="toggleSidebar"
        @closeLayer="closeLayer"
        :sideMenuToggle="sideMenuToggle"
      >
        <div slot="infoContent" class="info-content">
          <div class="text-panel">
            <h4 class="m-0">
              {{ data && data.ItemNo !== null ? data.ItemNo : "" }} /
              {{ data && data.SampleNo !== null ? data.SampleNo : "" }}
            </h4>
            <div class="badge-area">
              <b-badge class="cutome-badge mr-1" v-for="(tag, index) in badgeList" :key="index">
                {{ tag.trim() }}
              </b-badge>
            </div>
          </div>
          <div>
            <button class="btn download-button" @click="download">
              <font-awesome-icon :icon="['fas', 'download']" />
              <span class="mx-1">.sbsar</span>
            </button>
          </div>
        </div>
      </subnavbar>
      <div
        id="sidebar"
        class="side-menu"
        :class="{ active: sideMenuToggle }"
        v-if="sidebarTogglable === false"
      >
        <SidebarContent></SidebarContent>
      </div>
      <swiper ref="mySwiper" class="swiper" :options="swiperOption" @slideChange="test">
        <swiper-slide>
          <div
            :style="{ backgroundImage: `url(${imgListLarge[0]})` }"
            class="slider-background-first"
          ></div>
        </swiper-slide>
        <swiper-slide>
          <div
            :style="{ backgroundImage: `url(${imgListLarge[1]})` }"
            class="slider-background-second"
          ></div>
        </swiper-slide>
        <swiper-slide>
          <div
            :style="{ backgroundImage: `url(${imgListLarge[2]})` }"
            class="slider-background-third"
          ></div>
        </swiper-slide>
        <swiper-slide>
          <model-viewer
            src="https://raw.githubusercontent.com/dkplass/dkplass.github.io/master/YL-O009_M0545.glb"
            camera-controls=""
            alt="A 3D model"
          ></model-viewer>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
    <div v-if="layerActive" class="layer" @click="closeLayer"></div>
    <sidebar
      v-if="sidebarTogglable === true"
      :sidebarActive="sidebarActive"
      :sidebarTogglable="sidebarTogglable"
      @toggleSidebar="toggleSidebar"
      @closeLayer="closeLayer"
    ></sidebar>
  </div>
</template>

<script>
import sidebar from "@/components/layout/sidebar.vue";
import subnavbar from "@/components/layout/subpagenav.vue";
import SidebarContent from "@/components/layout/SidebarContent.vue";
// import { Swiper, SwiperSlide } from "vue-awesome-swiper";
// import "swiper/css/swiper.css";

export default {
  name: "sample",
  components: {
    sidebar,
    subnavbar,
    SidebarContent
    // Swiper,
    // SwiperSlide
  },
  data() {
    return {
      data: null,

      sideMenuToggle: false,

      fallbackImg: "http://182.52.70.198:8080/MaterialImg/ImageNotFound.png",
      imgListLarge: [],

      publicPath: "",
      downloadUrl: "",
      downloadFileName: "",

      swiperOption: {
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        slidesPerView: 1,
        allowTouchMove: true,
        // observer: true,
        // observeParents: true,
        centeredSlides: true
        // lazy: {
        //   loadPrevNext: false
        // }
      },

      sidebarTogglable: false,
      sidebarActive: false,
      layerActive: false,
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (!to.params.data || !from.name) {
        vm.$router.push({ name: "main" });
      } else {
        next();
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener("resize", this.detectiveWidth);
    next();
  },
  mounted() {
    this.$nextTick(() => {
      this.detectiveWidth();
      window.addEventListener("resize", this.detectiveWidth);
    });

    this.data = this.$route.params.data;

    this.createdData();
  },
  computed: {
    badgeList() {
      if (!this.data) return [];

      let list = this.data.Tags.split(",") || [];

      if (!list) {
        list = [];
      }

      if (list.length > 10) {
        list.length = 10;
      }

      return list;
    },
    swiper() {
      return this.$refs.mySwiper.$swiper;
    }
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
    createdData() {
      if (!this.data) {
        this.imgListLarge = [];
        this.publicPath = "";
        this.downloadUrl = "";
        this.downloadFileName = "";
      } else {
        this.imgListLarge = [
          `http://182.52.70.198:8080/MaterialImg/${this.data.SampleNo}/${this.data.SampleNo}-04.png`,
          `http://182.52.70.198:8080/MaterialImg/${this.data.SampleNo}/${this.data.SampleNo}-05.png`,
          `http://182.52.70.198:8080/MaterialImg/${this.data.SampleNo}/${this.data.SampleNo}-06.png`
        ];

        this.publicPath = `http://182.52.70.198:8080/MaterialImg/${this.data.SampleNo}/${this.data.SampleNo}.sbsar`;
        this.downloadUrl = `http://182.52.70.198:8080/MaterialImg/${this.data.SampleNo}/${this.data.SampleNo}.sbsar`;
        this.downloadFileName = `${this.data.SampleNo}.sbsar`;
      }
    },
    async download() {
      // 檢查下載檔案是否存在 正常 status 為 200 才下載
      const res = await fetch(this.publicPath).then(response => response.status === 200);

      if (res) {
        const link = document.createElement("a");
        link.setAttribute("href", this.publicPath);
        link.setAttribute("download", this.downloadFileName);

        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        this.$bvModal.msgBoxOk("檔案異常", {
          title: "下載訊息",
          buttonSize: "sm",
          okVariant: "pink",
          centered: true,
          size: "sm"
        });
      }
    },
    toggleSideMenu() {
      this.sideMenuToggle = !this.sideMenuToggle;
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
    closeLayer() {
      this.sidebarActive = false;
      this.headCollapse = false;
      this.layerActive = false;
    },
    test() {
      const a = this.swiper;

      console.log(a);

      console.log(a.activeIndex);

      // if (a.activeIndex === 3) {
      //   this.swiper.detachEvents();
      // } else {
      //   this.swiper.detachEvents();
      //   this.swiper.attachEvents();
      // }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/ThemColors.scss";

model-viewer {
  width: 100%;
  height: 100%;
}

.layer {
  position: absolute;
  z-index: 99;
  width: 100%;
  height: 100%;
  background-color: rgba($color: #000000, $alpha: 0.8);
}

.info-content {
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  font-family: "Roboto", sans-serif;
}

.download-button {
  border: 2px solid $secondary;
  border-radius: 0;
  color: $secondary;
  display: flex;
  flex-wrap: nowrap;
}

.side-menu {
  height: 0;
  border-top: 2px solid $secondary;
  background-color: $secondary;
  width: 16rem;
  height: calc(100% - 7rem + 2px);
  position: absolute;
  top: calc(7rem - 2px);
  right: 0;
  z-index: 9999;
  opacity: 0;
  transition: all 0.2s linear;

  &.active {
    border-top: 2px solid $primary;
    opacity: 1;

    .sidebar-content {
      overflow: auto;
    }
  }
}

// #sidebar {
//   height: 0;
//   border-top: 2px solid $secondary;
//   background-color: $secondary;
//   width: 16rem;
//   height: calc(100% - 7rem + 2px);
//   position: absolute;
//   top: calc(7rem - 2px);
//   right: 0;
//   z-index: 9999;
//   opacity: 0;
//   transition: all 0.2s linear;

//   .sidebar-content {
//     overflow: hidden;
//   }

//   &.active {
//     border-top: 2px solid $primary;
//     opacity: 1;

//     .sidebar-content {
//       overflow: auto;
//     }
//   }
// }

::v-deep .swiper {
  height: 100%;
  width: 100%;
  color: $light-font;

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-weight: bold;
    background-color: rgba($color: #000000, $alpha: 0.1);

    .slider-background-first {
      width: 70%;
      height: 70%;
      background-size: contain;
      background-position: center center;
      background-repeat: no-repeat;
    }

    .slider-background-second {
      width: 70%;
      height: 70%;
      background-size: contain;
      background-position: center center;
      background-repeat: no-repeat;
    }

    .slider-background-third {
      width: 70%;
      height: 70%;
      background-size: contain;
      background-position: center center;
      background-repeat: no-repeat;
    }
  }
}

@media (max-width: 1024px) {
  #sidebar {
    height: 100%;
    top: 0;
  }
}
</style>
