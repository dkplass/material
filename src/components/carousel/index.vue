<template>
  <div
    class="carousel-container"
    @mouseover="isHover = true"
    @mouseleave="isHover = false"
    @click.prevent="displaySample"
  >
    <ToolBar v-show="display" :data="data"></ToolBar>
    <b-carousel
      v-model="slideIndex"
      :interval="countInterval"
      :indicators="isHover"
      background="rgba(0, 0, 0, 0.1)"
      no-hover-pause
    >
      <b-carousel-slide v-for="(img, index) in imgLists" :key="index">
        <template v-slot:img>
          <div class="img-container">
            <img :data-src="img" class="lazyload" @error="handleImgDisplay" />
          </div>
        </template>
      </b-carousel-slide>
    </b-carousel>
  </div>
</template>

<script>
import { isAbleToRead } from "@/utils/hasAuthenticate";
import ToolBar from "@/components/toolBar/ToolBar.vue";

export default {
  name: "Carousel",
  components: {
    ToolBar
  },
  props: {
    data: Object
  },
  data() {
    return {
      slideIndex: 0,
      isHover: false
    };
  },
  watch: {
    isHover(value) {
      if (value === false) {
        this.slideIndex = 0;
      }
    }
  },
  computed: {
    fabricMeshIsabled() {
      return isAbleToRead("FabricMesh");
    },
    sampleDetailPageIsabled() {
      return isAbleToRead("SampleDetailPage");
    },
    countInterval() {
      let time = 0;
      const windowWidth = window.innerWidth;

      if (this.isHover && windowWidth > 1024) {
        time = 3000;
      }

      return time;
    },
    imgLists() {
      const path = "https://materialballfile.blob.core.windows.net/material/網頁檔案";
      const list = [];

      for (let i = 1; i <= 2; i++) {
        if (this.fabricMeshIsabled === false && i === 2) continue;
        list[i - 1] = `${path}/${this.data.SampleNo}/${this.data.SampleNo}-0${i}.png`;
      }

      const filtered = list.filter(function(elements) {
        return elements != null;
      });

      return filtered;
    },
    display() {
      if (this.isMobile() === true) {
        return true;
      } else {
        if (this.isHover === true) {
          return true;
        } else {
          return false;
        }
      }
    }
  },
  created() {},
  methods: {
    displaySample() {
      if (this.sampleDetailPageIsabled === false) return;

      this.isHover = false;

      this.$emit("displaySample");
    },
    handleImgDisplay(e) {
      e.target.src =
        "https://materialballfile.blob.core.windows.net/material/網頁檔案/ImageNotFound.png";
    },
    isMobile() {
      const result = !!("ontouchstart" in window || navigator.msMaxTouchPoints);
      return result;
    }
  }
};
</script>

<style lang="scss" scoped>
.carousel-container {
  width: 100%;
  height: 100%;
  max-width: 300px;
  max-height: 300px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.img-container {
  width: 300px;
  height: 300px;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

::v-deep .carousel-indicators li {
  background-color: #7d7d7d !important;
}
</style>
