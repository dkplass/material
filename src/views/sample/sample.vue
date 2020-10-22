<template>
  <div class="wrapper">
    <div class="content">
      <!-- 樣品頁專用導覽列 -->
      <subnavbar
        @toggleSideMenu="toggleSideMenu"
        @toggleSidebar="toggleSidebar"
        @closeLayer="closeLayer"
      >
      </subnavbar>

      <!-- 樣品頁可開關右側欄 -->
      <div
        id="sidebar"
        class="side-menu"
        :class="{ active: sideMenuToggle }"
        v-if="sidebarTogglable === false"
      >
        <SidebarContent></SidebarContent>
      </div>

      <!-- 左側懸浮資訊窗 -->
      <InfoPanel
        :data="data"
        :activeColorPickerPanel="activeColorPickerPanel"
        @download="download"
        @displayModel="displayModel"
      ></InfoPanel>

      <!-- 滑動展示區 -->
      <swiper
        ref="mySwiper"
        class="swiper"
        :options="swiperOption"
        @slideChange="handleSliderChange"
      >
        <swiper-slide>
          <div
            :style="{ backgroundImage: `url(${imgListLarge[0]})` }"
            class="slider-background-first"
          ></div>
        </swiper-slide>
        <swiper-slide v-if="fabricMeshIsabled">
          <div
            :style="{ backgroundImage: `url(${imgListLarge[1]})` }"
            class="slider-background-second"
          ></div>
        </swiper-slide>
        <swiper-slide ref="viewerSwipe" class="viewer-swipe">
          <!-- <model-viewer
            src="https://raw.githubusercontent.com/dkplass/dkplass.github.io/master/YL-O009_M0545.glb"
            camera-controls=""
            alt="A 3D model"
          ></model-viewer> -->
          <ModelViewer
            v-if="activeColorPickerPanel"
            :modelObject="modelObject"
            :colorPalette="colorPalette"
          ></ModelViewer>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>

      <!-- 色彩樣本選擇器 -->
      <SamplePicker
        v-if="activeColorPickerPanel"
        :data="data"
        @switchPalette="switchPalette"
      ></SamplePicker>
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
import { isAbleToRead } from "@/utils/hasAuthenticate";
import sidebar from "@/components/layout/sidebar.vue";
import subnavbar from "@/components/layout/subpagenav.vue";
import SidebarContent from "@/components/layout/SidebarContent.vue";
import SamplePicker from "@/components/shelf/SamplePicker.vue";
import InfoPanel from "@/components/InfoPanel.vue";
import ModelViewer from "@/components/ModelViewer.vue";

export default {
  name: "sample",
  components: {
    sidebar,
    subnavbar,
    SidebarContent,
    SamplePicker,
    InfoPanel,
    ModelViewer
  },
  props: {
    data: Object
  },
  data() {
    return {
      // data: null,
      modelObject: "PBR_TestBox.obj",

      sideMenuToggle: false,

      fallbackImg:
        "https://materialballfile.blob.core.windows.net/material/網頁檔案/ImageNotFound.png",
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

      sidebarTogglable: false, // 是否啟動側欄toggle的選項
      sidebarActive: false, // 打開側欄
      layerActive: false, // 打開遮罩

      activeColorPickerPanel: false,
      colorPalette: null
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

    // this.data = this.$route.params.data;

    this.createdData();
  },
  destroyed() {
    window.removeEventListener("resize", this.detectiveWidth);
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper;
    },
    fabricMeshIsabled() {
      return isAbleToRead("FabricMesh");
    }
  },
  methods: {
    detectiveWidth() {
      // 偵測寬度，變更控制項
      // 目前：導覽列側欄是否可開關
      const windowWidth = window.innerWidth;

      if (windowWidth > 1024) {
        this.sidebarTogglable = false;
      } else {
        this.sidebarTogglable = true;
      }
    },
    createdData() {
      // 建立頁面資料，包含圖片路徑、下載路徑
      if (!this.data) {
        this.imgListLarge = [];
        this.publicPath = "";
        this.downloadUrl = "";
        this.downloadFileName = "";
      } else {
        const path = "https://materialballfile.blob.core.windows.net/material/網頁檔案";

        this.imgListLarge = [
          `${path}/${this.data.SampleNo}/${this.data.SampleNo}-04.png`,
          `${path}/${this.data.SampleNo}/${this.data.SampleNo}-05.png`
        ];

        this.publicPath = `${path}/${this.data.SampleNo}/${this.data.SampleNo}.sbsar`;
        this.downloadUrl = `${path}/${this.data.SampleNo}/${this.data.SampleNo}.sbsar`;
        this.downloadFileName = `${this.data.SampleNo}.sbsar`;
      }
    },
    async download() {
      // 檢查下載檔案是否存在 正常 status 為 200 才下載
      const res = await fetch(this.publicPath).then(response => response.status === 200);
      // const res = true;

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
    handleSliderChange() {
      // 控制在特定slide position會有特定功能
      // 在3D view位置關閉觸控滑動功能、顯示樣品選擇工具列
      const _swiper = this.swiper;
      const vm = this;

      this.$nextTick(() => {
        const viewerSwipeClassList = vm.$refs.viewerSwipe.$el.classList;

        if (viewerSwipeClassList.contains("swiper-slide-active")) {
          _swiper.allowTouchMove = false;
          vm.activeColorPickerPanel = true;
        } else {
          _swiper.allowTouchMove = true;
          vm.activeColorPickerPanel = false;
        }
      });
    },
    displayModel(model) {
      this.modelObject = model;
    },
    switchPalette(value) {
      this.colorPalette = value;
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
  display: none;
  transition: all 0.2s linear;

  &.active {
    border-top: 2px solid $primary;
    opacity: 1;
    display: block;

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
