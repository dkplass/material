<template>
  <b-modal id="edit-modal"> </b-modal>
</template>

<script>
export default {
  name: "EditModal",
  props: {
    data: Object,
    opened: Boolean
  },
  created() {},
  methods: {
    openModal() {
      this.$bvModal.show("edit-modal");
    },
    closeModal() {
      this.$bvModal.hide("edit-modal");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/ThemColors.scss";
</style>
