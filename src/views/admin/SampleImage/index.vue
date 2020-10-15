<template>
  <div class="admin-content">
    <b-card class="my-card-wrapper h-100" body-class="my-card-content">
      <b-input-group class="mb-3">
        <b-input-group-prepend>
          <b-input-group-text class="search-prepend">Sample No.</b-input-group-text>
        </b-input-group-prepend>
        <b-form-input class="search" v-model="inputText"></b-form-input>
        <b-input-group-append>
          <b-button variant="outline-secondary" @click="getSamples">Search</b-button>
        </b-input-group-append>
      </b-input-group>

      <div class="table-content" ref="tableContent">
        <b-table
          v-if="samples"
          table-class="text-light"
          :items="samples"
          :fields="fields"
          :per-page="tableSettings.perPage"
          :current-page="tableSettings.currentPage"
          :sticky-header="`${tableHeight}px`"
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
            v-model="tableSettings.currentPage"
            :total-rows="paginationLength"
            :per-page="tableSettings.perPage"
            class="m-0"
            first-text="首頁"
            prev-text="前一頁"
            next-text="下一頁"
            last-text="末頁"
          ></b-pagination>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "SampleImage",
  data() {
    return {
      query: {
        SampleNo: "",
        ColorNo: ""
      },
      inputText: "",
      samples: null,
      tableHeight: 0,
      tableSettings: {
        perPage: 20,
        currentPage: 1,
        baseHeight: 200
      }
    };
  },
  created() {
    // 重新取回vuex暫存條件
    const condition = this.storedQueryCondition;

    if (!condition.SampleNo || 0 === condition.SampleNo.length) {
      // 處理帶查詢字串的網址
      this.query.SampleNo = this.$route.query.SampleNo || "";
      this.query.ColorNo = this.$route.query.ColorNo || "";

      this.getSamples();
    } else {
      this.query = { ...condition };
      this.getSamples();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.detectiveResize();
      window.addEventListener("resize", this.detectiveResize);
    });
  },
  destroyed() {
    window.removeEventListener("resize", this.detectiveResize);
  },
  beforeRouteLeave(to, from, next) {
    const destination = to.name;

    if (destination !== "SampleImageDetail") this.$store.dispatch("FilePath/CleanCondition");

    next();
  },
  computed: {
    ...mapState("FilePath", ["storedQueryCondition"]),
    fields() {
      const set = this.samples && this.samples.length ? this.samples[0] : {};

      const fieldsArray = Object.keys(set).map(e => {
        return e;
      });

      // 自訂義欄位
      const customFields = fieldsArray.map(e => {
        if (e === "Remark") {
          e = { key: "Remark", label: "Remark", thClass: "customRemark" };
        }

        return e;
      });

      // 固定的欄位
      const appendTableField = {
        key: "Operation",
        label: "",
        sortable: false,
        stickyColumn: true,
        class: "column-sticky-right"
      };

      return [...customFields, appendTableField];
    },
    paginationLength() {
      if (this.samples) return this.samples.length;
      else return 0;
    }
  },
  methods: {
    detectiveResize() {
      const targetHeight = this.$refs.tableContent.offsetHeight;
      const paginationHeight = this.$refs.tablePagination.offsetHeight;

      this.tableHeight = targetHeight - paginationHeight - 20;
    },
    async getSamples() {
      const api = `${process.env.VUE_APP_BASE_API}/FilePath/FilterByText`;
      let condition = null;

      if (!this.inputText || this.inputText === "") {
        // 查詢欄位有值
        condition = this.query;
      } else {
        // 或是網址帶的參數
        condition = { SampleNo: this.inputText, ColorNo: "" };
      }

      this.$store.dispatch("FilePath/SaveCondition", condition);

      const result = await this.$http
        .post(api, condition)
        .then(response => {
          return response.data;
        })
        .catch(console.error);

      if (condition.SampleNo) {
        this.samples = result;
      } else {
        this.samples = [];
      }
      // this.$http
      //   .post(api, condition)
      //   .then(response => {
      //     this.samples = response.data;
      //   })
      //   .catch(console.error);
    },
    querySample(row) {
      this.$router.push({ name: "SampleImageDetail", params: { sample: row } });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/ThemColors.scss";

.search-prepend {
  background: none;
  color: $secondary;
}

.search {
  background-color: transparent;
  color: #fff;
}

.table-content {
  flex: 1;
  overflow: hidden;
}

::v-deep .customRemark {
  width: 500px;
  min-width: 500px;
}

::v-deep .table-responsive {
  .column-sticky-right {
    right: 0;
    text-align: center;
    background-color: #656464 !important;
  }

  .custom-head-tr {
    > th {
      color: #f8f9fa !important;
      background-color: #2f2f2f !important;
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
