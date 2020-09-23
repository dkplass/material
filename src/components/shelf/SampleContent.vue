<template>
  <div class="sample-content js-enabled">
    <Carousel :data="data" @displaySample="displaySample"></Carousel>
    <div class="custome-carousel-caption">
      {{ data.ItemNo }}
      <!-- <a ref="download" :href="downloadUrl" :download="downloadFileName">download</a> -->
      <!-- <input type="button" @click="download" value="download" /> -->
    </div>
  </div>
</template>

<script>
import ScrollReveal from "scrollreveal";
import Carousel from "@/components/carousel/index.vue";
import Axios from "axios";

export default {
  name: "SampleContent",
  components: {
    Carousel
  },
  props: {
    data: Object
  },
  data() {
    return {
      // scrollReveal: scrollReveal()
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
    }
  },
  created() {},
  mounted() {
    ScrollReveal().reveal(".sample-content", {
      container: "#sample-container",
      delay: 0,
      distance: "200px",
      duration: 1200,
      easing: "cubic-bezier(0,1.07,.58,.92)",
      mobile: true
    });
  },
  beforeDestroy() {
    ScrollReveal().destroy();
  },
  methods: {
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
    initHideSampleContent() {
      document.getElementsByClassName("sample-content").classList.add("js-enabled");
      document.querySelectorAll(".sample-content").classList.add("js-enabled");
    },
    displaySample() {
      this.$router.push({
        name: "sample",
        params: { data: this.data }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/ThemColors.scss";

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
  color: $light-font;
  font-family: "Roboto", sans-serif;
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
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
  }

  .slider-background-third {
    width: 100%;
    height: 50vh;
    background-size: contain;
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
