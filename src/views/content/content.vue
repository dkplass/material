<template>
  <b-container fluid id="sample-container" class="py-2">
    <b-row no-gutters v-if="samples.length > 0">
      <b-col
        sm="12"
        md="6"
        xl="4"
        class="box mb-4"
        v-for="(item, index) in samples"
        :key="generateUUID(index)"
      >
        <SampleContent :data="item"></SampleContent>
      </b-col>
    </b-row>
    <div class="hint-message" v-else>No result, please reselect conditions...</div>
  </b-container>
</template>

<script>
import SampleContent from "@/components/SampleContent.vue";
import { mapGetters } from "vuex";

export default {
  name: "Content",
  components: {
    SampleContent
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters("Sample", {
      samples: "retrieveSamples"
    })
  },
  methods: {
    generateUUID() {
      let d = Date.now();

      if (typeof performance !== "undefined" && typeof performance.now === "function") {
        d += performance.now();
      }

      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/ThemColors.scss";

* {
  scrollbar-width: thin;
  scrollbar-color: $primary #000000;
}

*::-webkit-scrollbar {
  width: 12px;
}

*::-webkit-scrollbar-track {
  background: $primary;
}

*::-webkit-scrollbar-thumb {
  background-color: $secondary;
  border-radius: 20px;
  border: 3px solid $primary;
}

.content {
  background-color: #ffffff;
  color: $light-font;
  overflow: auto;
}

#sample-container {
  overflow: auto;
}

.hint-message {
  font-size: 1.2rem;
  text-align: center;
  color: $secondary;
}
</style>
