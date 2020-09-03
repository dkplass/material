<template>
  <b-container>
    <b-card class="my-2">
      <h2>Sample Preview</h2>
      <b-form @submit="onSubmit" @reset="onReset">
        <b-form-group label-col="3" label-cols-md="2" label-for="ComNo" label="Company No.">
          <b-form-input id="ComNo" v-model="sample.ComNo" disabled></b-form-input>
        </b-form-group>
        <b-form-group label-col="3" label-cols-md="2" label-for="SampleNo" label="Sample No.">
          <b-form-input id="SampleNo" v-model="sample.SampleNo" disabled></b-form-input>
        </b-form-group>
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
        <b-form-group label-col="3" label-cols-md="2" label-for="FPath" label="File Path">
          <b-form-input id="FPath" v-model="filePath" disabled></b-form-input>
        </b-form-group>
        <div class="image-container">
          <img class="form-image" :src="previewImageURL" alt="" />
        </div>
        <b-form-group label-col="3" label-cols-md="2" label-for="Location" label="Location">
          <b-form-input id="Location" v-model="sample.Location"></b-form-input>
        </b-form-group>
        <b-form-group label-col="3" label-cols-md="2" label-for="SType" label="SType">
          <b-form-input id="SType" v-model="sample.SType"></b-form-input>
        </b-form-group>

        <b-button type="submit" class="" :disabled="hasValid">Submit</b-button>
        <b-button type="reset" class="mx-2">Reset</b-button>
      </b-form>
    </b-card>
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
  </b-container>
</template>

<script>
export default {
  name: "DetailDemo",
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
    this.sample = JSON.parse(JSON.stringify(this.$route.params.sample));
  },
  watch: {
    filePath(value) {
      this.sample.FPath = value;
    }
  },
  computed: {
    filePath() {
      const $color = this.sample.ColorNo;

      if ($color === "default") {
        return this.sample.FPath;
      }

      const path = `${this.sample.SampleNo}/${this.sample.SampleNo}-${this.sample.ColorNo}-${this.sample.Location}.png`;

      return path;
    },
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
    hasValid() {
      return !this.isColor;
    },
    previewImageURL() {
      const url = "http://182.52.70.198:8080/MaterialImg";
      const file = this.sample.FPath;
      return `${url}/${file}`;
    }
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      const api = `${process.env.VUE_APP_BASE_API}/api/FilePath/Upsert`;
      // const api = `http://localhost:52216/api/FilePath/Upsert`;
      let msg = "",
        variant = "";

      this.$http
        .post(api, this.sample)
        .then(response => {
          if (response.data.IsSuccess) {
            msg = "更新成功";
            variant = "primary";
          } else {
            msg = "更新失敗";
            variant = "danger";
          }

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
      const api = `${process.env.VUE_APP_BASE_API}/api/FilePath/Upload`;
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

          this.$bvModal.msgBoxOk(msg, {
            title: "Message",
            buttonSize: "sm"
          });
          console.log(response);
        })
        .catch(error => error);
    }
    /* image upload card end */
  }
};
</script>

<style lang="scss" scoped>
.form-image {
  max-width: 500px;
  max-height: 500px;
  text-align: center;
  border: 1px dashed #000;
  padding: 0.2rem;
  margin-bottom: 0.2rem;
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
  height: 4rem;
}

.image-container {
  overflow: auto;
}
</style>
