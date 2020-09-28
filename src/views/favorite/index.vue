<template>
  <b-overlay
    :show="loading"
    bg-color="#3b3b3b"
    opacity="1"
    spinner-small
    spinner-variant="secondary"
    class="fetching-overlay"
  >
    <div class="wrapper">
      <SampleContainer :samples="favoriteSamples"></SampleContainer>
      <!-- <div style="color: #ffffff">{{ favoriteSamples }}</div> -->
    </div>
  </b-overlay>
</template>

<script>
import SampleContainer from "@/components/shelf/SampleContainer.vue";
import { mapGetters } from "vuex";

export default {
  name: "Favorite",
  components: {
    SampleContainer
  },
  data() {
    return {
      // favoriteSamples: []
    };
  },
  created() {
    this.$store.dispatch("Favorite/getFavoriteSamples");
  },
  mounted() {},
  watch: {
    favorite() {
      this.$store.dispatch("Favorite/getFavoriteSamples");
    }
  },
  computed: {
    ...mapGetters({
      loading: "loading",
      favorite: "Favorite/favorite",
      favoriteSamples: "Favorite/favoriteSamples"
    })
    // favoriteSamples() {
    //   const all = this.samples;
    //   const favoriteNoList = this.favorite;

    //   const result = all.filter(item => {
    //     return favoriteNoList.includes(item.SampleNo);
    //   });

    //   console.log(typeof result, result);

    //   return result;
    // }
  },
  methods: {
    // 1. 以所有樣品做最愛filter
    // 2. 當有最愛但樣品已經移除的情況
  }
};
</script>

<style lang="scss" scoped>
.fetching-overlay {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
