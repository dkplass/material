<template>
  <div class="sample-content js-enabled">
    <Carousel :data="data" @openBox="openBox"></Carousel>
    <div class="custome-carousel-caption">
      {{ data.ItemNo }}
      <!-- <a ref="download" :href="downloadUrl" :download="downloadFileName">download</a> -->
      <!-- <input type="button" @click="download" value="download" /> -->
    </div>

    <b-modal
      ref="detailModal"
      size="xl"
      centered
      header-class="no-border"
      body-class="my-modal-body"
      footer-class="no-border"
      class="mb-0"
    >
      <template v-slot:modal-header="{ close }">
        <b-button size="sm" variant="pink" @click="close()">
          Close
        </b-button>
        <h5>{{ data.SampleNo }}</h5>
      </template>
      <swiper
        ref="mySwiper"
        :options="swiperOption"
        style="background-color: #fdfdfd"
        @ready="handleSwiperReadied"
      >
        <swiper-slide>
          <!-- <div :data-background="imgListLarge[0]" class="slider-background-first swiper-lazy">
            <div class="swiper-lazy-preloader"></div>
          </div> -->
          <div
            :style="{ backgroundImage: `url(${imgListLarge[0]})` }"
            class="slider-background-first"
          ></div>
          <!-- <img :src="imgListLarge[0]" @error="handleImgDisplay" /> -->
        </swiper-slide>
        <swiper-slide>
          <div
            :style="{ backgroundImage: `url(${imgListLarge[1]})` }"
            class="slider-background-second"
          ></div>
          <!-- <img
            :data-src="imgListLarge[1]"
            @error="handleImgDisplay"
            class="swiper-lazy no-border"
          />
          <div class="swiper-lazy-preloader"></div> -->
        </swiper-slide>
        <swiper-slide>
          <div
            :style="{ backgroundImage: `url(${imgListLarge[2]})` }"
            class="slider-background-third"
          ></div>
          <!-- <img
            :data-src="imgListLarge[2]"
            @error="handleImgDisplay"
            class="swiper-lazy no-border"
          />
          <div class="swiper-lazy-preloader"></div> -->
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
      <template v-slot:modal-footer>
        <div class="data-bar">
          <div class="data-bar-left">
            <span class="d-inline-block">{{ data.ItemNo }} / {{ data.SampleName }}</span>
            <div>
              <b-badge class="cutome-badge mr-1" v-for="(tag, index) in badgeList" :key="index">
                {{ tag.trim() }}
              </b-badge>
            </div>
          </div>
          <div class="data-bar-right">
            <div class="size px-4">Width：{{ data.Width ? data.Width : "-" }}</div>
            <b-button class="download-button" @click="download">
              <font-awesome-icon :icon="['fas', 'download']" />
              <span class="mx-1">.sbsar</span>
              <!-- <a ref="download" :href="downloadUrl" :download="downloadFileName">download</a> -->
              <!-- <a href="#" @click.prevent="downloadHref">Download</a> -->
            </b-button>
          </div>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import ScrollReveal from "scrollreveal";
import Carousel from "@/components/carousel/index.vue";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import Axios from "axios";

export default {
  name: "SampleContent",
  components: {
    Carousel,
    Swiper,
    SwiperSlide
  },
  props: {
    data: Object
  },
  data() {
    return {
      // scrollReveal: scrollReveal(),

      fallbackImg: "http://182.52.70.198:8080/MaterialImg/ImageNotFound.png",
      imgListLarge: [
        `http://182.52.70.198:8080/MaterialImg/${this.data.SampleNo}/${this.data.SampleNo}-04.png`,
        `http://182.52.70.198:8080/MaterialImg/${this.data.SampleNo}/${this.data.SampleNo}-05.png`,
        `http://182.52.70.198:8080/MaterialImg/${this.data.SampleNo}/${this.data.SampleNo}-06.png`
      ],

      publicPath: `http://182.52.70.198:8080/MaterialImg/${this.data.SampleNo}/${this.data.SampleNo}.sbsar`,
      // publicPath: `${process.env.VUE_APP_DOWNLOADURL}/YL-O013/YL-O013.rar`,
      // publicPath: `${process.env.VUE_APP_DOWNLOADURL}/${this.data.SampleNo}/${this.data.SampleNo}-01.png`,
      // downloadUrl: `${process.env.VUE_APP_DOWNLOADURL}/${this.data.SampleNo}/${this.data.SampleNo}.sbsar`,
      downloadUrl: `http://182.52.70.198:8080/MaterialImg/${this.data.SampleNo}/${this.data.SampleNo}.sbsar`,
      downloadFileName: `${this.data.SampleNo}.sbsar`,

      swiperOption: {
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        slidesPerView: 1,
        observer: true,
        observeParents: true,
        preloadImages: false,
        centeredSlides: true,
        lazy: {
          loadPrevNext: false
        }
      },

      showSwiper: false
    };
  },
  computed: {
    badgeList() {
      let list = this.data.Tags.split(",");

      if (!list) {
        list = [];
      }

      if (list.length > 10) {
        list.length = 10;
      }

      return list;
    },
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
  created() {
    this.initHideSampleContent();
    // ScrollReveal().reveal(".sample-content", { beforeReveal: this.initHideSampleContent() });
  },
  mounted() {
    // const container = document.getElementById("sample-container");
    ScrollReveal().reveal(".sample-content", {
      container: "#sample-container",
      delay: 0,
      distance: "200px",
      duration: 1200,
      easing: "cubic-bezier(0,1.07,.58,.92)",
      mobile: true
    });
    // console.log(a);
    // console.log(this.scrollReveal.defaults);
    // console.log(this.scrollReveal);
    // this.scrollReveal.reveal(".sample-content", {
    //   distance: "0",
    //   origin: "top",
    //   duration: 1000,
    //   delay: 100,
    //   easing: "ease",
    //   mobile: true
    // });
  },
  beforeDestroy() {
    ScrollReveal().destroy();
  },
  methods: {
    handleSwiperReadied(swiper) {
      console.log(swiper);
      this.$refs.detailModal.show();
    },
    handleImgDisplay(e) {
      e.target.src = "http://182.52.70.198:8080/MaterialImg/ImageNotFound.png";
    },
    async download() {
      // 檢查下載檔案是否存在 正常 status 為 200 才下載
      const res = await fetch(this.publicPath).then(response => response.status === 200);

      if (res) {
        const link = document.createElement("a");
        link.setAttribute("href", this.publicPath);
        link.setAttribute("download", this.downloadFileName);

        console.log(link);
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
      // const url = this.publicPath;
      // const resT = await Axios.get(url)
      //   .then(response => {
      //     return response;
      //   })
      //   .catch(console.error);
      // console.log(resT);
      // const res = await fetch(url);
      // console.log(res);
      // const blob = await res.blob();
      // console.log(blob);
      // const urlBlob = window.URL.createObjectURL(blob); // 创建 object url，没有这一步下载的 blob 文件会出现 Failed 情况
      // console.log("urlBlob: ", urlBlob);
      // this.downloadUrl = urlBlob;
      // console.log("downloadUrl: ", this.downloadUrl);
      // this.downloadFileName = "TEST.png"; // 文件名需要动态赋值
      // console.log("fileName: ", this.downloadFileName);
      // setTimeout(() => {
      //   this.$refs.download.click();
      // }, 200);
      // -------------------------------------
    },
    async downloadHref() {
      let msg = "";
      const res = await Axios({
        url: this.publicPath,
        method: "GET",
        responseType: "blob" // important
      })
        .then(response => {
          console.log(response);
          return response.data;
          // const url = window.URL.createObjectURL(new Blob([response.data]));
          // const link = document.createElement("a");
          // link.href = url;
          // link.setAttribute("download", "file.rar");
          // document.body.appendChild(link);
          // link.click();

          // let blob = new Blob([response.data], { type: "application/octet-stream" });
          // let url = window.URL.createObjectURL(blob);
          // const link = document.createElement("a"); // 创建a标签
          // link.href = url;
          // link.download = "FILE"; // 重命名文件
          // link.click();
          // URL.revokeObjectURL(url); // 释放内存
        })
        .catch(e => {
          console.log(e);
          msg = e;
        });

      console.log(res);

      if (res) {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", this.downloadFileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        this.$bvModal.msgBoxOk(msg, {
          title: "下載訊息",
          buttonSize: "sm",
          centered: true,
          size: "sm"
        });
      }
    },
    openBox() {
      // const res = this.handleSwiperReadied();
      // console.log(res);
      // this.$refs.detailModal.show();
      // this.handleSwiperReadied();

      setTimeout(() => {
        this.$refs.detailModal.show();
      }, 1000);
      // console.log("this is current swiper instance object", this.swiper);
    },
    closeBox() {
      this.$refs.detailModal.hide();
    },
    initHideSampleContent() {
      // const a = document.querySelectorAll(".sample-content");
      // console.log(a);
      // console.log(document.getElementsByClassName("sample-content").classList);
      // document.getElementsByClassName("sample-content").classList.add("js-enabled");
      // document.querySelectorAll(".sample-content").classList.add("js-enabled");
    }
  }
};
</script>

<style lang="scss" scoped>
.sample-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.js-enabled {
  visibility: hidden;
}

.custome-carousel-caption {
  height: 40px;
  width: 100%;
  max-width: 300px;
  text-align: center;
  line-height: 40px;
  border-bottom: 2px solid #000000;
  cursor: default;
}

::v-deep .my-modal-body {
  height: 50vh;
}

::v-deep .swiper-slide {
  display: flex;
  justify-content: center;
  height: auto !important;

  .slider-background-first {
    width: 100%;
    height: 50vh;
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
  }

  .slider-background-second {
    width: 100%;
    height: 50vh;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
  }

  .slider-background-third {
    width: 100%;
    height: 50vh;
    background-size: 90% 100%;
    background-position: center center;
    background-repeat: no-repeat;
  }

  img {
    // width: 50%;
    height: 50vh;
    // max-width: 700px;
    // max-height: 700px;
  }
}

.layer {
  background-color: black;
  width: 100%;
  height: 550px;
}

.data-bar {
  width: 100%;
  height: 80px;
  display: flex;
  flex-direction: row;

  .data-bar-left {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .cutome-badge {
      background-color: #f17f7f;
      border: 1px solid #e69494;
    }
  }

  .data-bar-right {
    width: 50%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;

    .download-button {
      background-color: #f17f7f;
      border: 1px solid #e69494;
    }
  }
}

::v-deep .no-border {
  border: none;
}

@media (max-width: 1024px) {
  .data-bar {
    flex-direction: column;
    height: 160px;

    .data-bar-left {
      width: 100%;
      height: 100px;
    }

    .data-bar-right {
      width: 100%;
      height: 60px;
    }
  }
}
</style>
