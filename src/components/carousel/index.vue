<template>
  <div
    class="carousel-container"
    @mouseover="isHover = true"
    @mouseleave="isHover = false"
    @click.stop="openBox"
  >
    <b-carousel
      v-model="slideIndex"
      :interval="countInterval"
      :indicators="isHover"
      background="#fdfdfd"
      no-hover-pause
    >
      <b-carousel-slide v-for="(img, index) in imgList" :key="index">
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
export default {
  name: "Carousel",
  props: {
    data: Object
  },
  data() {
    return {
      imgList: [
        `http://182.52.70.198:8080/MaterialImg/${this.data.SampleNo}/${this.data.SampleNo}-01.png`,
        `http://182.52.70.198:8080/MaterialImg/${this.data.SampleNo}/${this.data.SampleNo}-02.png`,
        `http://182.52.70.198:8080/MaterialImg/${this.data.SampleNo}/${this.data.SampleNo}-03.png`
      ],
      slideIndex: 0,
      isHover: false
    };
  },
  watch: {
    // data: {
    //   handler() {
    //     console.log(this.imgList);
    //     this.imgList = [
    //       `http://182.52.70.198:8080/MaterialImg/${this.data.SampleNo}/${this.data.SampleNo}-01.png`,
    //       `http://182.52.70.198:8080/MaterialImg/${this.data.SampleNo}/${this.data.SampleNo}-02.png`,
    //       `http://182.52.70.198:8080/MaterialImg/${this.data.SampleNo}/${this.data.SampleNo}-03.png`
    //     ];
    //     console.log(this.imgList);
    //   },
    //   deep: true
    // }
  },
  computed: {
    countInterval() {
      let time = 0;
      const windowWidth = window.innerWidth;

      if (this.isHover && windowWidth > 1024) {
        time = 3000;
      }

      return time;
    }
  },
  methods: {
    openBox() {
      this.isHover = false;
      this.$emit("openBox");
    },
    handleImgDisplay(e) {
      e.target.src = "http://182.52.70.198:8080/MaterialImg/ImageNotFound.png";
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
