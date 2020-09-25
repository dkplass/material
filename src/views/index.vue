<template>
  <b-overlay
    :show="loading"
    bg-color="#3b3b3b"
    opacity="1"
    spinner-small
    spinner-variant="secondary"
    class="fetching-overlay"
  >
    <div class="wrapper" v-if="!loading">
      <SampleContainer :samples="samples"></SampleContainer>
    </div>
  </b-overlay>
</template>

<script>
import SampleContainer from "@/components/shelf/SampleContainer.vue";
import { mapGetters } from "vuex";

export default {
  name: "Index",
  components: {
    SampleContainer
  },
  data() {
    return {
      list: []
    };
  },
  computed: {
    ...mapGetters({
      loading: "loading",
      samples: "Sample/retrieveSamples"
    })
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
