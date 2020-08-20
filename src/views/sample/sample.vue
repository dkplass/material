<template>
  <div class="wrapper">
    <div class="content">
      <!-- 樣品頁專用導覽列 -->
      <subnavbar
        @toggleSideMenu="toggleSideMenu"
        @toggleSidebar="toggleSidebar"
        @closeLayer="closeLayer"
      >
        <!-- <template v-slot:infoContent>
          <div class="info-content" ref="InfoContent">
            <div class="text-panel">
              <div class="main-info">
                <span class="m-0"> {{ sampleTitle }} / 建議售價：{{ suggestPrice }} </span>
              </div>
              <div class="badge-area">
                <b-badge class="cutome-badge mr-1" v-for="(tag, index) in badgeList" :key="index">
                  {{ tag.trim() }}
                </b-badge>
              </div>
            </div>
            <div class="p-2">
              <button class="btn download-button" @click="download">
                <font-awesome-icon :icon="['fas', 'download']" />
                <span class="mx-1">.sbsar</span>
              </button>
            </div>
          </div>
        </template> -->
      </subnavbar>

      <!-- 樣品頁可開關側欄 -->
      <div
        id="sidebar"
        class="side-menu"
        :class="{ active: sideMenuToggle }"
        v-if="sidebarTogglable === false"
      >
        <SidebarContent :queryMode="queryMode"></SidebarContent>
      </div>

      <!-- 懸浮資訊窗 -->
      <div class="indicate" :class="{ active: showInfoPanel }" @click="toggleInfoPanel">
        <font-awesome-icon :icon="['fas', 'caret-right']" />
      </div>
      <div class="info-panel p-2" :class="{ active: showInfoPanel }">
        <div class="info-panel-content">
          <div class="list" v-if="data">
            <span>Sample No.：{{ data.SampleNo }}</span>
            <span>Item No.：{{ data.ItemNo }}</span>
            <span>Description：{{ data.Remark }}</span>
            <span>Price：{{ data.CurrNo }} {{ data.Price }}</span>
          </div>
          <div class="badge-area py-2">
            <b-badge class="cutome-badge mr-1" v-for="(tag, index) in badgeList" :key="index">
              {{ tag.trim() }}
            </b-badge>
          </div>
          <div class="py-2">
            <button class="btn download-button" @click="download">
              <font-awesome-icon :icon="['fas', 'download']" />
              <span class="mx-1">.sbsar</span>
            </button>
          </div>
        </div>
        <div class="info-panel-head px-1" @click="toggleInfoPanel">
          <font-awesome-icon :icon="['fas', 'caret-left']" size="lg" />
        </div>
        <!-- {{ data }} -->
      </div>
      <!-- <div id="infoPanel" class="info-panel" v-if="data">
        {{ data.SampleNo }}
      </div>
      <b-tooltip target="infoPanel" triggers="hover" placement="right">
        Show Detail
      </b-tooltip> -->
      <!-- <div class="info-panel" v-if="data">
        <div class="custom-detail-btn" v-b-toggle.infoContent>
          <span class="when-close">
            {{ data.SampleNo }} 
            <font-awesome-icon :icon="['fas', 'caret-right']" />
          </span>
          <span class="when-open">
            {{ data.SampleNo }} 
            <font-awesome-icon :icon="['fas', 'caret-left']" />
          </span>
        </div>
        <b-collapse id="infoContent" class="custom-collapse" is-nav>
          <b-card no-body class="custom-card">
            test
          </b-card>
        </b-collapse>
      </div> -->

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
      :queryMode="queryMode"
      @toggleSidebar="toggleSidebar"
      @closeLayer="closeLayer"
    ></sidebar>
  </div>
</template>

<script>
import sidebar from "@/components/layout/sidebar.vue";
import subnavbar from "@/components/layout/subpagenav.vue";
import SidebarContent from "@/components/layout/SidebarContent.vue";
import { mapGetters } from "vuex";

export default {
  name: "sample",
  components: {
    sidebar,
    subnavbar,
    SidebarContent
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

      showInfoPanel: false
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
  destroyed() {
    window.removeEventListener("resize", this.detectiveWidth);
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
    },
    sampleTitle() {
      if (!this.data) return "";

      const _data = this.data;
      const itemNo = _data.ItemNo ? _data.ItemNo : "";
      const sampleName = _data.SampleName ? _data.SampleName : "";

      return `${itemNo} / ${sampleName}`;
    },
    suggestPrice() {
      if (!this.data) return "";

      const _data = this.data;
      const currNo = _data.CurrNo ? _data.CurrNo : "";
      const price = _data.Price ? _data.Price : "";

      return `${currNo} ${price}`;
    },
    ...mapGetters({
      queryMode: "queryMode"
    })
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
    toggleInfoPanel() {
      this.showInfoPanel = !this.showInfoPanel;
    },
    handleSliderChange() {
      const _swiper = this.swiper;
      const index = _swiper.realIndex;

      if (index === 3) {
        _swiper.allowTouchMove = false;
      } else {
        _swiper.allowTouchMove = true;
      }
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

.indicate {
  position: absolute;
  top: 50%;
  padding: 0.2rem 0.6rem;
  background-color: #3b3b3b;
  border: 2px solid #f2f2f2;
  border-left: none;
  border-bottom-right-radius: 99rem;
  border-top-right-radius: 99rem;
  color: #f2f2f2;
  font-family: "Roboto", sans-serif;
  z-index: 99;
  cursor: pointer;
  transition: all 0.2s linear;

  &:hover {
    padding: 0.2rem 0.6rem 0.2rem 1.2rem;
  }
}

.info-panel {
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 7rem;
  left: -18rem;
  color: #f2f2f2;
  font-family: "Roboto", sans-serif;
  // background-color: rgba($color: #f2f2f2, $alpha: 0.2);
  background-color: $primary;
  width: 100%;
  max-width: 18rem;
  height: calc(100% - 7rem);
  z-index: 100;
  overflow: hidden;
  transition: all 0.2s linear;
  border-right: 2px solid $secondary;

  &.active {
    left: 0;
  }

  .info-panel-head {
    display: flex;
    justify-content: center;
    align-items: center;
    color: $primary;
    background-color: $secondary;
    cursor: pointer;
  }

  .close-btn {
    cursor: pointer;
  }

  .info-panel-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow-y: auto;

    .list {
      flex: 1 1 auto;

      > span {
        display: block;
        width: 100%;
      }

      span + span {
        padding-top: 0.2rem;
      }
    }
  }
}

// ::v-deep .info-content {
//   display: flex;
//   flex-flow: row;
//   align-items: center;
//   justify-content: space-between;
//   width: 100%;
//   height: 100%;
//   font-family: "Roboto", sans-serif;

//   .main-info {
//     display: flex;
//   }
// }

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
