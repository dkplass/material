<template>
  <div class="sample-picker" :class="{ active: active }">
    <div class="toggle-picker-btn" @click="openPicker">
      <font-awesome-icon :icon="['fas', 'sliders-h']" />
    </div>
    <div class="picker-selector-bar" :class="{ active: active }">
      <span
        class="color-dot red"
        data-color="red"
        :class="{ active: selectPlatte === 'red' }"
        @click="select"
      ></span>
      <span
        class="color-dot pink"
        data-color="pink"
        :class="{ active: selectPlatte === 'pink' }"
        @click="select"
      ></span>
      <span
        class="color-dot green"
        data-color="green"
        :class="{ active: selectPlatte === 'green' }"
        @click="select"
      ></span>
      <span
        class="color-dot blue"
        data-color="blue"
        :class="{ active: selectPlatte === 'blue' }"
        @click="select"
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "SamplePicker",
  data() {
    return {
      active: false,
      selectPlatte: ""
    };
  },
  methods: {
    openPicker() {
      this.active = !this.active;
      console.log("hI");
    },
    select(e) {
      const _target = e.target;
      const colorInfo = _target.getAttribute("data-color");
      console.log(colorInfo);
      this.selectPlatte = colorInfo;
    }
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
      width: 20px;
      height: 20px;
      margin: 0.5rem;
      cursor: pointer;

      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: inline-block;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 4px solid;
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
</style>
