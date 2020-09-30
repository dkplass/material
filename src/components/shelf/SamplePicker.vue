<template>
  <div class="sample-picker" :class="{ active: active }">
    <div class="toggle-picker-btn" @click="openPicker">
      <font-awesome-icon :icon="['fas', 'sliders-h']" />
    </div>
    <div class="picker-selector-bar" :class="{ active: active }">
      <!-- <span
        class="color-dot pink"
        data-color="pink"
        :class="{ active: selectPalette === 'pink' }"
        @click="select"
      ></span> -->

      <!-- :style="{
              backgroundImage: thumbImagePath(set.thumbImage)
            }" -->
      <span
        v-for="(palette, index) in palettes"
        :key="index"
        class="color-dot"
        :data-color="palette.color"
        :class="[{ active: classActive(palette.color) }, `${palette.color}`]"
        :style="{
          backgroundImage: `url(${palette.imagePath})`
        }"
        @click="select($event, palette)"
      ></span>
    </div>
  </div>
</template>

<script>
// TODO: 父層sample元件需傳入sampleno以查詢底下有哪些色彩可用
export default {
  name: "SamplePicker",
  props: {
    data: Object
  },
  data() {
    return {
      palettes: [],
      active: false,
      selectPalette: ""
    };
  },
  created() {
    this.generateData();
  },
  computed: {},
  methods: {
    generateData() {
      // 暫時組成假資料，遇到YL-O001、YL-O002、其他
      /*
        palette: [{ color, imagePath }]
      */
      // https://materialballfile.blob.core.windows.net/material/模型基本色卡/YL-O001/YL_O001_01_PBR_Base_Color_12-0824TCX.png
      const sampleNumber = this.data.SampleNo;
      const path = "https://materialballfile.blob.core.windows.net/material/模型基本色卡";
      const temp = [];

      if (sampleNumber === "YL-O001") {
        temp[0] = {
          color: "0824TCX",
          imagePath: `${path}/${sampleNumber}/YL_O001_01_PBR_Base_Color_12-0824TCX.png`
        };

        temp[1] = {
          color: "1058TCX",
          imagePath: `${path}/${sampleNumber}/YL_O001_01_PBR_Base_Color_15-1058TCX.png`
        };

        temp[2] = {
          color: "0636TCX",
          imagePath: `${path}/${sampleNumber}/YL_O001_01_PBR_Base_Color_17-0636TCX.png`
        };

        temp[3] = {
          color: "4034TCX",
          imagePath: `${path}/${sampleNumber}/YL_O001_01_PBR_Base_Color_18-4034TCX.png`
        };

        temp[4] = {
          color: "2434TCX",
          imagePath: `${path}/${sampleNumber}/YL_O001_01_PBR_Base_Color_19-2434TCX.png`
        };
      } else if (sampleNumber === "YL-O002") {
        temp[0] = {
          color: "0824TCX",
          imagePath: `${path}/${sampleNumber}/YL_O002_01_PBR_Base_Color_12-0824TCX.png`
        };

        temp[1] = {
          color: "1058TCX",
          imagePath: `${path}/${sampleNumber}/YL_O002_01_PBR_Base_Color_15-1058TCX.png`
        };

        temp[2] = {
          color: "0636TCX",
          imagePath: `${path}/${sampleNumber}/YL_O002_01_PBR_Base_Color_17-0636TCX.png`
        };

        temp[3] = {
          color: "4034TCX",
          imagePath: `${path}/${sampleNumber}/YL_O002_01_PBR_Base_Color_18-4034TCX.png`
        };

        temp[4] = {
          color: "2434TCX",
          imagePath: `${path}/${sampleNumber}/YL_O002_01_PBR_Base_Color_19-2434TCX.png`
        };
      } else {
        temp[0] = {
          color: "red",
          imagePath: ""
        };

        temp[1] = {
          color: "pink",
          imagePath: ""
        };

        temp[2] = {
          color: "green",
          imagePath: ""
        };

        temp[3] = {
          color: "blue",
          imagePath: ""
        };

        temp[4] = {
          color: "orange",
          imagePath: ""
        };
      }

      this.palettes = temp;
    },
    openPicker() {
      this.active = !this.active;
    },
    classActive(color = "") {
      const selectingColor = this.selectPalette;

      if (color === selectingColor) {
        return true;
      } else {
        return false;
      }
    },
    select(e, palette) {
      const _target = e.target;
      const colorInfo = _target.getAttribute("data-color");
      this.selectPalette = colorInfo;
      this.$emit("switchPalette", palette);
    },
    imageColorPalette() {}
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/ThemColors.scss";

.sample-picker {
  position: absolute;
  top: 8rem;
  right: 2rem;
  color: $light-font;
  overflow: hidden;
  z-index: 99;

  // &::after {
  //   content: "";
  //   border-bottom: 2px solid $secondary;
  // }

  .toggle-picker-btn {
    position: relative;
    text-align: center;
    user-select: none;
    cursor: pointer;
    background-color: #353535;
    z-index: 99;
    border-bottom: 2px solid $secondary;
  }

  .picker-selector-bar {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-top: 2px solid $secondary;
    border-bottom: 2px solid $secondary;
    background-color: rgba(0, 0, 0, 0.2);
    padding: 0.2rem 0;
    transform: translateY(-100%);
    transition: all 400ms cubic-bezier(0, 0.995, 0.99, 1);
    z-index: 80;

    > .color-dot {
      // border: 1px solid $secondary;
      position: relative;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      margin: 0.5rem;
      cursor: pointer;

      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: inline-block;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid $primary;
        opacity: 0;
      }

      &.active::before {
        opacity: 1;
        transition: all 400ms cubic-bezier(0, 0.995, 0.99, 1);
      }
    }

    &.active {
      transform: translateY(-2%);
      transition: all 400ms cubic-bezier(0, 0.995, 0.99, 1);
    }
  }
}

.red {
  background-color: red;

  &.active::before {
    border-color: red !important;
  }
}

.pink {
  background-color: pink;

  &.active::before {
    border-color: pink !important;
  }
}

.green {
  background-color: green;

  &.active::before {
    border-color: green !important;
  }
}

.blue {
  background-color: blue;

  &.active::before {
    border-color: blue !important;
  }
}

.orange {
  background-color: orange;

  &.active::before {
    border-color: orange !important;
  }
}
</style>
