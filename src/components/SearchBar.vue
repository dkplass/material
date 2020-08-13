<template>
  <div class="search-area">
    <input type="text" v-model="value" placeholder="Looking for...?" @change="queryData" />
    <span class="focus-bg"></span>
  </div>
</template>

<script>
export default {
  name: "SearchBar",
  data() {
    return {
      value: ""
    };
  },
  methods: {
    queryData() {
      const condition = { value: this.value };
      this.$store.dispatch("Sample/querySamples", condition);
      this.value = "";
      this.$emit("closeLayer");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/ThemColors.scss";

.search-area {
  display: flex;
  position: relative;
  margin: auto;
  width: 100%;
  max-width: 15rem;
  overflow: hidden;

  .focus-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba($color: #afafaf, $alpha: 0.1);
    z-index: -1;
    transform: scaleX(0);
    transform-origin: left;
  }

  input {
    appearance: none;
    font-size: 1rem;
    font-family: "Roboto", sans-serif;
    padding: 0.1rem 0.2rem;
    display: block;
    width: 100%;
    color: rgba($color: $primary, $alpha: 0.6);
    background-color: rgba($color: #afafaf, $alpha: 0);
    box-shadow: inset 0 -0.1rem 0 rgba($color: $primary, $alpha: 0.4);
    transition: all 0.15s ease;
    border: none;
    // border-bottom: 2px solid $primary;

    &:hover {
      background: rgba($color: #afafaf, $alpha: 0.2);
      box-shadow: inset 0 -0.1rem 0 rgba($color: $primary, $alpha: 0.6);
    }

    &:focus {
      color: $dark-font;
      background: rgba($color: #afafaf, $alpha: 0.4);
      outline: none;
      box-shadow: inset 0 -0.1rem 0 $primary;
    }

    &:focus + .focus-bg {
      transform: scaleX(1);
      transition: all 0.1s ease;
    }

    &::-webkit-input-placeholder {
      /* Edge */
      font-family: "Cormorant Garamond", serif;
    }

    &:-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      font-family: "Cormorant Garamond", serif;
    }

    &::placeholder {
      font-family: "Cormorant Garamond", serif;
    }
  }
}
</style>
