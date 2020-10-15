<template>
  <div class="admin-content">
    <b-card class="my-card-wrapper h-100" body-class="my-card-content">
      <b-input-group class="mb-3">
        <b-input-group-prepend>
          <b-input-group-text class="search-prepend">Sample No.</b-input-group-text>
        </b-input-group-prepend>
        <b-form-input class="search" v-model="inputText"></b-form-input>
        <b-input-group-append>
          <b-button variant="outline-secondary" @click="getSampleColor">Search</b-button>
        </b-input-group-append>
      </b-input-group>

      <div class="table-content" ref="tableContent">
        <b-table
          v-if="sampleColor"
          table-class="text-light"
          no-border-collapse
          responsive
          :thead-tr-class="['custom-head-tr']"
          :tbody-tr-class="['custom-body-tr']"
          :items="sampleColor"
          :fields="fields"
          :per-page="tableSettings.perPage"
          :current-page="tableSettings.currentPage"
          :sticky-header="`${tableHeight}px`"
        >
          <template v-slot:cell(Operation)="row">
            <!-- <b-button class="mr-1" @click="openEditModal(row)">
              <font-awesome-icon :icon="['fas', 'edit']" size="xs"></font-awesome-icon>
            </b-button> -->
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
        <!-- ComNo -->
        <b-form-group label-col="3" label-cols-md="2" label-for="ComNo" label="Company No.">
          <b-form-input id="ComNo" v-model="selectData.ComNo" disabled></b-form-input>
        </b-form-group>

        <!-- SampleNo -->
        <b-form-group label-col="3" label-cols-md="2" label-for="SampleNo" label="Sample No.">
          <b-form-input id="SampleNo" v-model="selectData.SampleNo" disabled></b-form-input>
        </b-form-group>

        <!-- ColorNo -->
        <b-form-group label-col="3" label-cols-md="2" label-for="ColorNo" label="Color No.">
          <b-form-input id="ColorNo" v-model="selectData.ColorNo" disabled></b-form-input>
        </b-form-group>

        <!-- ChooseYn -->
        <b-form-group label-col="3" label-cols-md="2" label-for="ChooseYn" label="ChooseYn">
          <b-form-input id="ChooseYn" v-model="selectData.ChooseYn" disabled></b-form-input>
        </b-form-group>

        <!-- DefaultYn -->
        <b-form-group label-col="3" label-cols-md="2" label-for="DefaultYn" label="DefaultYn">
          <b-form-input id="DefaultYn" v-model="selectData.DefaultYn" disabled></b-form-input>
        </b-form-group>

        <!-- Remark -->
        <b-form-group label-col="3" label-cols-md="2" label-for="Remark" label="Remark">
          <b-form-textarea id="Remark" v-model="selectData.Remark" disabled></b-form-textarea>
        </b-form-group>

        <!-- LevelNo -->
        <b-form-group label-col="3" label-cols-md="2" label-for="LevelNo" label="Level No.">
          <b-form-input id="LevelNo" v-model="selectData.LevelNo" disabled></b-form-input>
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
              <div class="dropZone-upload-limit-info">file format： .png</div>
            </div>
            <input type="file" accept=".png" @change="onChange" />
          </div>
          <div class="tool-bar my-1">
            <span>Selected file: {{ file ? file.name : "" }}</span>
            <b-button class="float-right" @click="upload">Upload</b-button>
          </div>
          <div class="image-container">
            <img id="imagePreview" :src="url" alt="" />
          </div>
        </b-container>
      </b-card>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "SampleColor",
  data() {
    return {
      inputText: "",
      sampleColor: null,
      tableHeight: 0,
      tableSettings: {
        perPage: 20,
        currentPage: 1,
        baseHeight: 200
      },

      selectData: {
        ComNo: "",
        SampleNo: "",
        ColorNo: "",
        ChooseYn: "",
        DefaultYn: "",
        Remark: "",
        LevelNo: 0
      },

      dragging: false,
      file: null,
      url: null
    };
  },
  created() {
    this.getSampleColor();
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
  computed: {
    fields() {
      // 取得欄位
      const firstRow = this.sampleColor && this.sampleColor.length ? this.sampleColor[0] : {};

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
      if (this.sampleColor) return this.sampleColor.length;
      else return 0;
    }
  },
  methods: {
    detectiveResize() {
      const targetHeight = this.$refs.tableContent.offsetHeight;
      const paginationHeight = this.$refs.tablePagination.offsetHeight;

      this.tableHeight = targetHeight - paginationHeight - 20;
    },
    async getSampleColor() {
      const api = `${process.env.VUE_APP_BASE_API}/SampleColor/FilterByText`;
      const query = JSON.stringify(this.inputText);

      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };

      const result = await this.$http
        .post(api, query, config)
        .then(response => {
          return response.data;
        })
        .catch(console.error());

      if (this.inputText) {
        this.sampleColor = result;
      } else {
        this.sampleColor = [];
      }
    },
    openUploadModal(data) {
      this.selectData = JSON.parse(JSON.stringify(data.item));
      this.$bvModal.show("upload-modal");
    },
    dismissUploadModal() {
      // clear and init data
      this.selectData = {
        ComNo: "",
        SampleNo: "",
        ColorNo: "",
        ChooseYn: "",
        DefaultYn: "",
        Remark: "",
        LevelNo: 0
      };

      this.file = null;
      this.url = null;
    },
    onChange(e) {
      const file = e.target.files[0] || e.dataTransfer.files[0];

      if (!file) {
        this.dragging = false;
        return;
      }

      const testFile = this.checkFile(file);

      if (!testFile) {
        this.dragging = false;
        return;
      }

      this.url = URL.createObjectURL(file);
      this.file = file;

      this.dragging = false;
    },
    checkFile(file) {
      if (!file.type.match("image/png")) {
        return false;
      }

      return true;
    },
    upload() {
      const formData = new FormData();
      const config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };

      const api = `${process.env.VUE_APP_BASE_API}/SampleColor/AzureUploadSampleColorImage`;

      const directory = `${this.selectData.SampleNo}`;

      formData.append("file", this.file);
      formData.append("directory", directory);

      this.$http
        .post(api, formData, config)
        .then(response => {
          // if status: 200, statusText: "OK"
          let msg = "";

          if (response.status === 200 && response.statusText === "OK") msg = "Uploaded successed";
          else msg = "Uploaded fail";

          this.$bvModal
            .msgBoxOk(msg, {
              title: "Message",
              buttonSize: "sm"
            })
            .then(() => {
              this.modalClose();
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(error => error);
    },
    modalClose() {
      this.$refs["upload-modal"].hide();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/ThemColors.scss";

#upload-modal {
  * {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial,
      "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
      "Noto Color Emoji";
  }
}

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

.image-container {
  overflow: auto;
  margin-bottom: 1rem;

  .form-image {
    max-width: 500px;
    max-height: 500px;
    text-align: center;
    border: 1px dashed #000;
    padding: 0.2rem;
    margin-bottom: 0.2rem;
  }
}

.dropZone {
  position: relative;
  height: 14rem;
  background-color: #b5b5b5;
  border: 2px dashed #000000;

  &:hover {
    background-color: #ffffff;
    border: 2px dashed #000000;
  }

  .dropZone-info {
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    width: 100%;
    text-align: center;
  }

  .dropZone-title {
    padding: 0 0.4rem;
  }

  input {
    position: absolute;
    cursor: pointer;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .dropZone-upload-limit-info {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
  }

  .dropZone-over {
    background: #5c5c5c !important;
    opacity: 0.8;
    border: 2px solid #2e94c4;
  }
}
</style>
