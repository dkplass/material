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
      <div style="color: #ffffff">FAVORITE</div>
    </div>
  </b-overlay>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Favorite",
  computed: {
    ...mapGetters({
      loading: "loading"
    })
  }
};
</script>

<style lang="scss" scoped></style>
