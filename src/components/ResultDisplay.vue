<template>
  <div class="conditions-collector">
    <span>Result Filter By：</span>
    <span v-if="queryText">{{ queryText }}</span>
    <div v-else>
      <b-badge variant="secondary" class="mx-1" v-for="(tag, index) in getSelectedTags" :key="index"
        >{{ tag }}
      </b-badge>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ResultDisplay",
  data() {
    return {};
  },
  computed: {
    ...mapGetters("TagList", {
      getSelectedTags: "getSelectedTags"
    }),
    ...mapGetters("Sample", {
      queryText: "queryText"
    })
  }
};
</script>

<style lang="scss" scoped>
.conditions-collector {
  width: 100%;
  height: 5rem;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
}
</style>
