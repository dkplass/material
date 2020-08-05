<template>
  <div id="sidebar" :class="{ active: sidebarActive }">
    <div class="px-3 py-2">
      <b-list-group class="custome-group-list">
        <b-list-group-item
          class="custome-group-list-item"
          v-for="(tag, index) in tagList"
          :key="index"
          :to="{ name: 'content', params: { tagName: tag.TagName.trim() } }"
          :class="{ selected: selectedTag === tag.TagName }"
          @click="toggleSidebar(tag.TagName)"
        >
          <span class="item-name">{{ tag.TagName }}</span>
          <span class="item-count">{{ tag.TagCount }}</span>
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script>
export default {
  name: "sidebar",
  props: {
    sidebarActive: Boolean
  },
  data() {
    return {
      tagList: [],
      selectedTag: ""
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      const api = `${process.env.VUE_APP_BASE_API}/api/TagList/GetList`;

      this.$http
        .get(api)
        .then(Response => {
          this.tagList = Response.data.Resource;
        })
        .catch(e => {
          console.log(e);
        });
    },
    toggleSidebar(tag) {
      this.selectedTag = tag;
      this.$emit("toggleSidebar");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/ThemColors.scss";

* {
  scrollbar-width: thin;
  scrollbar-color: #ffffff #000000;
}

*::-webkit-scrollbar {
  width: 12px;
}

*::-webkit-scrollbar-track {
  background: #ffffff;
}

*::-webkit-scrollbar-thumb {
  background-color: #000000;
  border-radius: 20px;
  border: 3px solid #ffffff;
}

.custome-group-list {
  .custome-group-list-item {
    background-color: transparent;
    display: flex;
    padding: 0.5rem;
    color: $dark-font;
    border: none;
    cursor: default;

    &:hover {
      background-color: $pink;
      color: #ffffff;
    }

    .item-name {
      width: 80%;
      text-align: left;
      cursor: pointer;
    }

    .item-count {
      width: 20%;
      text-align: right;
      cursor: pointer;
    }

    &.selected {
      background-color: $pink;
      color: #ffffff;
    }
  }
}
</style>
