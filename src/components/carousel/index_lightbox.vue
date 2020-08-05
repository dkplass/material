<template>
  <div class="w-100 h-100">
    <div
      @click="lightboxIndex = slideIndex"
      @mouseover="isHover = true"
      @mouseleave="isHover = false"
    >
      <b-carousel
        v-model="slideIndex"
        :interval="countInterval"
        :controls="isHover"
        :indicators="isHover"
        background="#ababab"
        img-width="100%"
        img-height="100%"
        no-hover-pause
      >
        <b-carousel-slide
          v-for="(img, index) in imgList"
          caption=""
          text=""
          :key="index"
          :img-src="img"
        ></b-carousel-slide>
      </b-carousel>
      <div class="text-center">
        {{ data.SampleName }}
      </div>
    </div>
    <CoolLightBox
      :items="imgList"
      :index="lightboxIndex"
      :slideshow="false"
      @close="lightboxIndex = null"
    >
    </CoolLightBox>
  </div>
</template>

<script>
import CoolLightBox from "vue-cool-lightbox";
import "vue-cool-lightbox/dist/vue-cool-lightbox.min.css";

export default {
  name: "Carousel",
  components: {
    CoolLightBox
  },
  props: {
    data: Object
  },
  data() {
    return {
      imgList: [
        `https://picsum.photos/1024/480/?image=${Math.floor(Math.random() * Math.floor(100))}`,
        `https://picsum.photos/1024/480/?image=${Math.floor(Math.random() * Math.floor(100))}`,
        `https://picsum.photos/1024/480/?image=${Math.floor(Math.random() * Math.floor(100))}`
      ],
      slideIndex: 0,
      lightboxIndex: null,
      isHover: false
    };
  },
  computed: {
    countInterval() {
      let time = 0;

      if (this.isHover) {
        time = 4000;
      }

      return time;
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped></style>
