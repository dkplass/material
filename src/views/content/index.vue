<template>
  <b-container fluid v-if="data" id="sample-container" class="py-2">
    <b-row no-gutters>
      <b-col sm="12" md="6" xl="4" class="box mb-4" v-for="(item, index) in data" :key="index">
        <SampleContent :data="item"></SampleContent>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
// import ScrollReveal from "scrollreveal";
import SampleContent from "@/components/SampleContent.vue";

export default {
  name: "index",
  components: {
    SampleContent
  },
  data() {
    return {
      tagName: "",
      data: null
      // scrollReveal: ScrollReveal()
    };
  },
  watch: {
    tagName() {
      this.retrieveSampleContent();
    }
  },
  created() {
    this.setFirstContent();
  },
  mounted() {
    // console.log(this.scrollReveal.defaults);
    // console.log(this.scrollReveal);
    // this.scrollReveal.reveal(".box", {
    //   distance: "100px",
    //   origin: "bottom",
    //   duration: 1000,
    //   delay: 100,
    //   easing: "ease-in",
    //   mobile: true
    // });
  },
  methods: {
    setFirstContent() {
      this.tagName = this.$route.params.tagName;
      this.retrieveSampleContent();
    },
    retrieveSampleContent() {
      const api = `${process.env.VUE_APP_BASE_API}/api/Sample/GetList`;

      this.$http
        .post(api, { TagName: this.tagName })
        .then(response => {
          this.data = response.data.Resource;
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  beforeRouteUpdate(to, from, next) {
    const isTagExisted = this.$store.getters["TagList/hasTag"](to.params.tagName);
    const TagList = this.$store.getters["TagList/getTagList"];

    if (isTagExisted) {
      this.tagName = to.params.tagName;
      next();
    } else {
      this.tagName = TagList[0].TagName;
      this.$router.push({ name: "content", params: { tagName: this.tagName.trim() } });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/ThemColors.scss";

.content {
  background-color: #ffffff;
  color: $dark-font;
  overflow: auto;
}

#sample-container {
  overflow: auto;
}
</style>
