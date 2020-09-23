<template>
  <b-card class="my-2">
    <b-input-group prepend="Sample No." class="my-3">
      <b-form-input v-model="inputText"></b-form-input>
      <b-input-group-append>
        <b-button variant="outline-primary" @click="getSamples">Search</b-button>
      </b-input-group-append>
    </b-input-group>

    <b-table
      v-if="samples"
      :items="samples"
      :fields="fields"
      :per-page="tableSettings.perPage"
      :current-page="tableSettings.currentPage"
      sticky-header="54rem"
      no-border-collapse
      responsive
      :thead-tr-class="['custom-head-tr']"
      :tbody-tr-class="['custom-body-tr']"
    >
      <template v-slot:cell(Operation)="row">
        <b-button @click="querySample(row.item)">
          <font-awesome-icon :icon="['fas', 'link']" size="xs" />
        </b-button>
      </template>
    </b-table>

    <div class="d-flex justify-content-center p-2" ref="tablePagination">
      <b-pagination
        v-if="samples"
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
      query: {
        SampleNo: "",
        ColorNo: ""
      },
      inputText: "",
      samples: null,
      tableSettings: {
        perPage: 20,
        currentPage: 1,
        baseHeight: 200
      }
    };
  },
  created() {
    // let query = "";
    // const sampleNo = this.$route.query.SampleNo;
    // const colorNo = this.$route.query.ColorNo;

    // console.log(this.$route.query.SampleNo);
    // console.log(this.$route.query.ColorNo);

    // if (sampleNo) {
    //   query = sampleNo;
    // } else if (!sampleNo && colorNo) {
    //   query = colorNo;
    // }

    // this.inputText = this.$route.query.SampleNo || "";

    this.query.SampleNo = this.$route.query.SampleNo || "";

    this.query.ColorNo = this.$route.query.ColorNo || "";

    this.getSamples();
  },
  computed: {
    fields() {
      const set = this.samples.length ? this.samples[0] : {};

      const fieldsArray = Object.keys(set).map(element => {
        return element;
      });

      const r = fieldsArray.map(element => {
        if (element === "Remark") {
          element = { key: "Remark", label: "Remark", thClass: "customeRemark" };
        }

        return element;
      });

      const appendTableField = {
        key: "Operation",
        label: "",
        sortable: false,
        stickyColumn: true,
        class: "column-sticky-right"
      };

      return [...r, appendTableField];
    },
    routeQuery() {
      return this.$route.query.SampleNo || "";
    }
  },
  methods: {
    getSamples() {
      const api = `${process.env.VUE_APP_BASE_API}/api/FilePath/GetList`;
      let condition = null;
      // const config = {
      //   headers: {
      //     "Content-Type": "application/json"
      //   }
      // };

      // this.$http
      //   .post(api, JSON.stringify(this.inputText), config)
      //   .then(response => {
      //     this.samples = response.data.Resource;
      //   })
      //   .catch(console.error);

      if (!this.inputText || this.inputText === "") {
        condition = this.query;
      } else {
        condition = { sampleNo: this.inputText };
      }

      console.log(condition);

      this.$http
        .post(api, condition)
        .then(response => {
          this.samples = response.data.Resource;
        })
        .catch(console.error);
    },
    querySample(row) {
      this.$router.push({ name: "detail", params: { sample: row } });
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .customeRemark {
  width: 500px;
  min-width: 500px;
}

::v-deep .table-responsive {
  .column-sticky-right {
    right: 0;
    text-align: center;
    background-color: #dcdcdc !important;
  }

  .custom-head-tr {
    > th {
      white-space: nowrap;
    }
  }

  .custom-body-tr {
    > td {
      vertical-align: middle;
      white-space: nowrap;
    }
  }
}
</style>
