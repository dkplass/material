<template>
  <b-container class="admin-panel p-2">
    <button class="btn btn-primary" @click="querySample">Get Sample</button>
    <button v-if="renderGoBtn" class="btn btn-primary mx-1" @click="goList">Go List</button>
    <router-view :key="$route.fullPath"></router-view>
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
  name: "AdminDemo",
  data() {
    return {
      dragging: false,
      file: null,
      url: null
    };
  },
  computed: {
    renderGoBtn() {
      const _path = this.$route.path;

      if (_path.includes("detail")) {
        return true;
      }

      return false;
    }
  },
  methods: {
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
      const api = `${process.env.VUE_APP_BASE_API}/api/Sample/Upload`;

      formData.append("file", this.file);

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
    },
    /* image upload card end */

    querySample() {
      this.$router.push({ name: "detail", query: { SampleNo: "YL-O001" } });
    },
    goList() {
      this.$router.push({ name: "list" });
    }
  }
};
</script>

<style lang="scss" scoped>
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
