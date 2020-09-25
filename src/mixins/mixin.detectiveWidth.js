export const DetectiveWidth = {
  data() {
    return {
      sidebarTogglable: false
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.detectiveWidth();
      window.addEventListener("resize", this.detectiveWidth);
    });
  },
  methods: {
    detectiveWidth() {
      const windowWidth = window.innerWidth;
      if (windowWidth > 1024) {
        this.sidebarTogglable = false;
      } else {
        this.sidebarTogglable = true;
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener("resize", this.detectiveWidth);
    next();
  }
};
