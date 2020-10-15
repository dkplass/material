<template>
  <b-container class="detail-content">
    <div>
      <!-- <button class="btn btn-primary" @click="querySample">Get Sample</button> -->
      <button class="btn btn-primary mx-1" @click="goList">Go List</button>
    </div>
    <b-card body-class="detail-card-body text-light" class="my-card-wrapper my-2">
      <h2>{{ sample.SampleNo }}</h2>
      <b-form class="h-100" @submit="onSubmit" @reset="onReset">
        <!-- ComNo -->
        <b-form-group label-col="3" label-cols-md="2" label-for="ComNo" label="Company No.">
          <b-form-input id="ComNo" v-model="sample.ComNo" disabled></b-form-input>
        </b-form-group>
        <!-- SampleNo -->
        <b-form-group label-col="3" label-cols-md="2" label-for="SampleNo" label="Sample No.">
          <b-form-input id="SampleNo" v-model="sample.SampleNo" disabled></b-form-input>
        </b-form-group>
        <!-- ColorNo -->
        <b-form-group label-col="3" label-cols-md="2" label-for="ColorNo" label="Color No.">
          <b-input-group size="sm" prepend="#" class="mb-2">
            <b-form-input
              id="ColorNo"
              v-model="sample.ColorNo"
              :state="isColor"
              aria-describedby="input-color-feedback"
            ></b-form-input>
            <b-form-invalid-feedback id="input-color-feedback">
              Please enter valid HEX color or just type default.
            </b-form-invalid-feedback>
          </b-input-group>
        </b-form-group>
        <!-- filePath -->
        <b-form-group label-col="3" label-cols-md="2" label-for="FPath" label="File Path">
          <b-input-group>
            <b-form-input id="FPath" v-model="filePath" disabled></b-form-input>
            <template v-slot:append>
              <b-button class="choose-btn" v-b-modal.image-upload>Choose file</b-button>
            </template>
          </b-input-group>
        </b-form-group>
        <!-- image-previewer -->
        <div class="image-container">
          <img class="form-image" :src="previewImageURL" alt="" />
        </div>
        <!-- Location -->
        <b-form-group label-col="3" label-cols-md="2" label-for="Location" label="Location">
          <b-form-input id="Location" v-model="sample.Location"></b-form-input>
        </b-form-group>
        <!-- SType -->
        <b-form-group label-col="3" label-cols-md="2" label-for="SType" label="SType">
          <b-form-select id="SType" v-model="sample.SType">
            <b-form-select-option value="S">S</b-form-select-option>
            <b-form-select-option value="D">D</b-form-select-option>
          </b-form-select>
        </b-form-group>

        <b-button type="submit" class="" :disabled="hasValid">Submit</b-button>
        <b-button type="reset" class="mx-2">Reset</b-button>
      </b-form>
    </b-card>

    <b-modal id="image-upload" ref="image-upload" hide-footer title="圖片上傳" size="lg">
      <b-card class="h-100">
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
  </b-container>
</template>

<script>
export default {
  name: "SampleImageDetail",
  data() {
    return {
      sample: {
        ComNo: null,
        SampleNo: null,
        ColorNo: null,
        FPath: null,
        Location: null,
        SType: null
      },

      dragging: false,
      file: null,
      url: null
    };
  },
  created() {
    const param = this.$route.params.sample;

    if (!param) this.$router.push({ name: "SampleImage" });
    else this.sample = JSON.parse(JSON.stringify(param));
  },
  watch: {
    filePath(value) {
      this.sample.FPath = value;
    }
  },
  computed: {
    isColor() {
      const $color = this.sample.ColorNo;
      const regExp = /^[0-9(A-F|a-f)]{6}$/g;
      let res = false;

      if ($color === "default") {
        res = true;
      } else {
        res = regExp.test($color);
      }

      return res;
    },
    filePath() {
      const $color = this.sample.ColorNo;

      if ($color === "default") {
        return this.sample.FPath;
      }

      const path = `${this.sample.SampleNo}/${this.sample.SampleNo}-${this.sample.ColorNo}-${this.sample.Location}.png`;

      return path;
    },
    previewImageURL() {
      const baseURL = "https://materialballfile.blob.core.windows.net/material/網頁檔案";
      const file = this.sample.FPath;

      if (!file) return "";
      else return `${baseURL}/${file}?timestamp=${new Date().getTime()}`;
    },
    hasValid() {
      return !this.isColor;
    }
  },
  methods: {
    goList() {
      this.$router.push({ name: "SampleImage" });
    },
    onSubmit(e) {
      e.preventDefault();
      const api = `${process.env.VUE_APP_BASE_API}/FilePath/Upsert`;
      let msg = "",
        variant = "";

      this.$http
        .post(api, this.sample)
        .then(response => {
          if (response.data === "更新成功") {
            variant = "primary";
          } else {
            variant = "danger";
          }

          msg = response.data;

          this.$bvModal.msgBoxOk(msg, {
            buttonSize: "sm",
            okVariant: variant,
            centered: true,
            size: "sm"
          });
        })
        .catch(console.error());
    },
    onReset(e) {
      e.preventDefault();
      this.sample = JSON.parse(JSON.stringify(this.$route.params.sample));
    },

    /* image upload card start */
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
      // const api = `${process.env.VUE_APP_BASE_API}/api/FilePath/Upload`;
      const api = `${process.env.VUE_APP_BASE_API}/FilePath/AzureUploadSampleImage`;
      // const api = `http://localhost:52216/api/Sample/Upload`;

      const newFileName = `${this.sample.SampleNo}-${this.sample.ColorNo}-${this.sample.Location}.png`;
      const directory = `${this.sample.SampleNo}`;

      formData.append("file", this.file, newFileName);
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
      this.url = null;
      this.$refs["image-upload"].hide();
    }
    /* image upload card end */
  }
};
</script>

<style lang="scss" scoped>
.detail-content {
  height: 100%;
  overflow-y: auto;
}

.detail-card-body {
  overflow: hidden;
}

.choose-btn {
  background-color: #797472;
  color: #fff;
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

.tool-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
