<template>
  <b-card class="my-2">
    <b-table
      :items="samples"
      :fields="fields"
      :per-page="tableSettings.perPage"
      :current-page="tableSettings.currentPage"
      sticky-header="54rem"
      no-border-collapse
      responsive
    ></b-table>

    <div class="d-flex justify-content-center p-2" ref="tablePagination">
      <b-pagination
        v-model="tableSettings.currentPage"
        :total-rows="samples.length"
        :per-page="tableSettings.perPage"
        first-text="首頁"
        prev-text="前一頁"
        next-text="下一頁"
        last-text="末頁"
      ></b-pagination>
    </div>
  </b-card>
</template>

<script>
export default {
  name: "ListDemo",
  data() {
    return {
      samples: null,
      tableSettings: {
        perPage: 20,
        currentPage: 1,
        baseHeight: 200
      }
    };
  },
  created() {
    this.getSamples();
  },
  computed: {
    fields() {
      const set = this.samples.length ? this.samples[0] : {};

      const fieldsArray = Object.keys(set).map(element => {
        return element;
      });

      console.log(fieldsArray);

      const r = fieldsArray.map(element => {
        if (element === "Remark") {
          element = { key: "Remark", label: "Remark", thClass: "customeRemark" };
        }

        return element;
      });

      console.log(r);

      // const r = [
      // 	{ key: "Remark", label: "Remark", tdClass: 'customeRemark'},
      // ];

      return r;
    }
  },
  methods: {
    getSamples() {
      const api = `${process.env.VUE_APP_BASE_API}/api/Sample/SearchSamples`;
      const condition = { value: "" };

      this.$http
        .post(api, condition)
        .then(response => {
          this.samples = JSON.parse(response.data.Resource);
        })
        .catch(console.error);
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .customeRemark {
  width: 500px;
  min-width: 500px;
}
</style>
