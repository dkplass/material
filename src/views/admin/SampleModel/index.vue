<template>
  <div class="admin-content">
    <b-card class="my-card-wrapper h-100" body-class="my-card-content">
      <div class="table-content" ref="tableContent">
        <b-table
          v-if="models"
          table-class="text-light"
          no-border-collapse
          responsive
          :thead-tr-class="['custom-head-tr']"
          :tbody-tr-class="['custom-body-tr']"
          :items="models"
          :fields="fields"
          :per-page="tableSettings.perPage"
          :current-page="tableSettings.currentPage"
          :sticky-header="`${tableHeight}px`"
        >
          <template v-slot:cell(Operation)="row">
            <b-button @click="openUploadModal(row)">
              <font-awesome-icon :icon="['fas', 'file-upload']" size="xs"></font-awesome-icon>
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

    <b-modal ref="upload-modal" id="upload-modal" size="lg" hide-footer @hide="dismissUploadModal">
      <b-card class="h-100">
        <!-- ModelNo -->
        <b-form-group label-col="3" label-cols-md="2" label-for="ModelNo" label="Model No.">
          <b-form-input id="ModelNo" v-model="selectData.ModelNo" disabled></b-form-input>
        </b-form-group>

        <!-- ModelChName -->
        <b-form-group label-col="3" label-cols-md="2" label-for="ModelChName" label="Model Ch Name">
          <b-form-input id="ModelChName" v-model="selectData.ModelChName" disabled></b-form-input>
        </b-form-group>

        <!-- ModelEnName -->
        <b-form-group label-col="3" label-cols-md="2" label-for="ModelEnName" label="Model En Name">
          <b-form-input id="ModelEnName" v-model="selectData.ModelEnName" disabled></b-form-input>
        </b-form-group>

        <!-- ModelPath -->
        <b-form-group label-col="3" label-cols-md="2" label-for="ModelPath" label="Model Path">
          <b-form-input id="ModelPath" v-model="selectData.ModelPath" disabled></b-form-input>
        </b-form-group>

        <!-- SeriesNo -->
        <b-form-group label-col="3" label-cols-md="2" label-for="SeriesNo" label="Series No.">
          <b-form-input id="SeriesNo" v-model="selectData.SeriesNo" disabled></b-form-input>
        </b-form-group>

        <!-- SeriesChName -->
        <b-form-group
          label-col="3"
          label-cols-md="2"
          label-for="SeriesChName"
          label="Series Ch Name"
        >
          <b-form-textarea
            id="SeriesChName"
            v-model="selectData.SeriesChName"
            disabled
          ></b-form-textarea>
        </b-form-group>

        <!-- SeriesEnName -->
        <b-form-group
          label-col="3"
          label-cols-md="2"
          label-for="SeriesEnName"
          label="Series En Name"
        >
          <b-form-input id="SeriesEnName" v-model="selectData.SeriesEnName" disabled></b-form-input>
        </b-form-group>

        <b-container fluid>
          <div
            :class="['dropZone', dragging ? 'dropZone-over' : '']"
            @dragestart="dragging = true"
            @dragenter="dragging = true"
            @dragleave="dragging = false"
          >
            <div class="dropZone-info" @drag="onChange">
              <font-awesome-icon :icon="['fas', 'cloud-upload-alt']" />
              <span class="dropZone-title">drag or click to choose image</span>
              <div class="dropZone-upload-limit-info">file format： .glb</div>
            </div>
            <input type="file" accept=".glb" @change="onChange" />
          </div>
          <div class="tool-bar my-1">
            <span>Selected file: {{ file ? file.name : "" }}</span>
            <b-button class="float-right" @click="upload">Upload</b-button>
          </div>
        </b-container>
      </b-card>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "SampleModel",
  data() {
    return {
      models: null,
      selectData: {
        ModelNo: "",
        ModelChName: "",
        ModelEnName: "",
        ModelPath: "",
        SeriesNo: "",
        SeriesChName: "",
        SeriesEnName: ""
      },
      tableHeight: 0,
      tableSettings: {
        perPage: 20,
        currentPage: 1,
        baseHeight: 200
      },
      dragging: false,
      file: null
    };
  },
  created() {
    this.getModels();
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
    fields() {
      // 取得欄位
      const firstRow = this.models && this.models.length ? this.models[0] : {};

      const fieldHead = Object.keys(firstRow).map(e => {
        return e;
      });

      // 變更欄位

      // 固定的欄位
      const appendTableField = {
        key: "Operation",
        label: "",
        sortable: false,
        stickyColumn: true,
        class: "column-sticky-right"
      };

      return [...fieldHead, appendTableField];
    },
    paginationLength() {
      if (this.models) return this.models.length;
      else return 0;
    }
  },
  methods: {
    detectiveResize() {
      const targetHeight = this.$refs.tableContent.offsetHeight;
      const paginationHeight = this.$refs.tablePagination.offsetHeight;

      this.tableHeight = targetHeight - paginationHeight - 20;
    },
    getModels() {
      const api = `${process.env.VUE_APP_BASE_API}/ThreeDModel/Get`;

      this.$http
        .get(api)
        .then(response => {
          this.models = response.data;
        })
        .catch(console.error);
    },
    openUploadModal(data) {
      this.selectData = JSON.parse(JSON.stringify(data.item));
      this.$bvModal.show("upload-modal");
    },
    dismissUploadModal() {
      // clear and init data
      this.selectData = {
        ModelNo: "",
        ModelChName: "",
        ModelEnName: "",
        ModelPath: "",
        SeriesNo: "",
        SeriesChName: "",
        SeriesEnName: ""
      };
    },
    onChange(e) {
      const file = e.target.files[0] || e.dataTransfer.files[0];

      if (!file) {
        this.dragging = false;
        return;
      }

      this.file = file;

      this.dragging = false;
    },
    upload() {
      let data = JSON.parse(JSON.stringify(this.selectData));
      const formData = new FormData();
      const config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };

      const api = `${process.env.VUE_APP_BASE_API}/ThreeDModel/AzureUploadThreeDModel`;

      const directory = `${this.selectData.ModelNo}`;

      data.ModelPath = `${directory}/${this.file.name}`;

      formData.append("file", this.file);
      formData.append("directory", directory);

      this.$http
        .post(api, formData, config)
        .then(response => {
          // if status: 200, statusText: "OK"
          let msg = "";

          console.log(response);

          if (response.status === 200 && response.data === "OK") msg = "Uploaded successed";
          else msg = "Uploaded fail";

          this.$bvModal
            .msgBoxOk(msg, {
              title: "Message",
              buttonSize: "sm"
            })
            .then(() => {
              this.updateData(data);
              this.modalClose();
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(error => error);
    },
    updateData(data) {
      const api = `${process.env.VUE_APP_BASE_API}/ThreeDModel/Edit`;

      this.$http
        .post(api, data)
        .then(response => {
          console.log(response.data);

          this.getModels();
        })
        .catch(err => {
          console.log(err);
        });
    },
    modalClose() {
      this.$refs["upload-modal"].hide();
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
