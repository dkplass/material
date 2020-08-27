<template>
  <b-card class="my-2">
    <h2>Sample Detail</h2>
    <b-spinner v-if="loading" label="Spinning"></b-spinner>
    <div v-else class="1">
      <template v-if="samples.length > 0">
        <div
          class="info-block"
          v-for="(sample, index) in samples"
          :key="index"
          v-html="listFormat(sample)"
        ></div>
      </template>
      <template v-else>
        <span>No sample found</span>
      </template>
    </div>
  </b-card>
</template>

<script>
export default {
  name: "DetailDemo",
  data() {
    return {
      samples: null,
      loading: false
    };
  },
  created() {
    const query = this.$route.query.SampleNo || "";
    this.queryDetail(query);
  },
  watch: {
    query: {
      handler(v) {
        this.queryDetail(v);
      },
      deep: true
    }
  },
  computed: {
    query() {
      return this.$route.query.SampleNo || "";
    }
  },
  methods: {
    queryDetail(v) {
      const api = `${process.env.VUE_APP_BASE_API}/api/Sample/SearchSamples`;
      const condition = { value: v };

      this.loading = true;

      this.$http
        .post(api, condition)
        .then(response => {
          this.samples = JSON.parse(response.data.Resource);
          this.loading = false;
        })
        .catch(console.error());
    },
    listFormat(sample) {
      let domString = "";

      for (let [key, value] of Object.entries(sample)) {
        domString += `<li>${key}：${value}</li>`;
      }

      return `<ul>${domString}</ul>`;
    }
  }
};
</script>

<style lang="scss" scoped>
.info-block + .info-block {
  border-top: 1px solid black;
}
</style>
