<template>
  <b-modal id="user-info-modal" :visible="modalActived" @hide="hideModal" v-if="modalActived">
    <div class="user-page">
      <button @click="logout">logout</button>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "UserInfo",
  computed: {
    ...mapGetters({
      loginModal: "loginModal"
    }),
    modalActived: {
      get() {
        return this.loginModal;
      },
      set(v) {
        return v;
      }
    }
  },
  methods: {
    hideModal() {
      this.$store.dispatch("toggleLoginModal");
    },
    logout() {
      this.$store.dispatch("Authenticate/clearAuth");
      this.$store.dispatch("User/clearUser");
      this.hideModal();
      this.$router.push("login");
    }
  }
};
</script>

<style lang="scss" scoped></style>
