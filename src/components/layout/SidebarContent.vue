<template>
  <div class="sidebar-content">
    <div class="tag-search-area">
      <b-input-group size="sm" class="">
        <b-input-group-prepend is-text>
          <font-awesome-icon :icon="['fas', 'search']" />
        </b-input-group-prepend>
        <b-form-input type="search" placeholder="Search tags" v-model="search"></b-form-input>
      </b-input-group>
    </div>
    <div class="content-clear"><u class="text" @click="clearAll">clear all</u></div>
    <div class="sidebar-content-catagory" v-for="(catagory, index) in filterTags" :key="index">
      <div class="sidebar-content-catagory-head" v-b-toggle="`collapse-${index}`">
        <span class="sidebar-text">{{ catagory.SeriesTagName }}</span>
        <button class="btn expand-btn float-right" v-if="catagory.SeriesTagItems.length > 0">
          <font-awesome-icon class="when-close" :icon="['fas', 'plus']" />
          <font-awesome-icon class="when-open" :icon="['fas', 'minus']" />
        </button>
      </div>
      <b-collapse :id="`collapse-${index}`" v-model="collapses[index]" class="w-100">
        <b-list-group
          class="collapse-content"
          v-for="(tag, index) in catagory.SeriesTagItems"
          :key="index"
        >
          <b-list-group-item class="collapse-content-item">
            <b-form-checkbox
              v-model="selectedTags"
              :value="tag.TagName"
              inline
              class="custom-control-element"
            >
              <span>{{ tag.TagName }}</span>
              <span class="ml-1">{{ tag.SampleAmount }}</span>
            </b-form-checkbox>
          </b-list-group-item>
        </b-list-group>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "SideBarMenu",
  props: {
    queryMode: Boolean
  },
  data() {
    return {
      selectedTags: this.getSelectedTags,
      search: "",
      collapses: []
    };
  },
  watch: {
    selectedTags: {
      handler(value) {
        // queryMode true 為經過文字查詢，否則
        // 進入頁面後先設定當前vuex已存的tagslist
        // 並
        if (this.queryMode === false) {
          this.$store.dispatch("TagList/setSelectedTagsAndQuerySamples", value);
        }
      },
      deep: true
    },
    getSelectedTags() {
      // 當此參數變動才會跳轉首頁
      this.$router.push({ name: "main" }).catch(error => error);
    }
  },
  created() {
    this.init();
    // this.retrieveDefaultSample();
  },
  computed: {
    ...mapGetters("TagList", {
      getTagList: "getTagList",
      getSelectedTags: "getSelectedTags"
    }),
    filterTags() {
      const categories = JSON.parse(JSON.stringify(this.getTagList));
      const value = this.search;
      const reg = new RegExp(value, "i");

      // 1.filter SeriesTagItems[TagName]
      // return categories.filter(category => {
      // 	const a = category.SeriesTagItems.filter(tag => reg.test(tag.TagName) === true);
      // 	console.log(a);
      //   return a;
      // });

      const filterResult = categories.filter(category => {
        category.SeriesTagItems = category.SeriesTagItems.filter(
          tag => reg.test(tag.TagName) === true
        );
        return category.SeriesTagItems.length > 0;
      });

      if (value) {
        filterResult.forEach((r, index) => {
          this.collapses[index] = true;
        });
      } else {
        filterResult.forEach((r, index) => {
          this.collapses[index] = false;
        });
      }

      return filterResult;
    }
  },
  methods: {
    init() {
      this.$store.dispatch("TagList/getTags", this.selectedTags);

      this.selectedTags = this.getSelectedTags;
    },
    retrieveDefaultSample() {
      this.$store.commit("TagList/setSelectedTags", this.selectedTags);
    },
    clearAll() {
      this.selectedTags = [];
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/ThemColors.scss";

* {
  scrollbar-width: thin;
  scrollbar-color: #f2f2f2 #000000;
}

*::-webkit-scrollbar {
  width: 12px;
}

*::-webkit-scrollbar-track {
  background: #f2f2f2;
}

*::-webkit-scrollbar-thumb {
  background-color: #000000;
  border-radius: 20px;
  border: 3px solid #f2f2f2;
}

.btn:focus,
.btn.focus {
  outline: 0;
  box-shadow: none;
}

.block-container {
  display: flex;
  align-items: center;
}

.tag-search-area {
  padding: 0.4rem 0.8rem;
}

.collapse-content {
  width: 100%;
  cursor: pointer;

  .collapse-content-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: none;
    border: none;
    padding: 0.2rem 0.8rem;
    color: #585858;

    &:hover {
      padding: 0.2rem 0.8rem;
      border-radius: 0;
      color: #ffffff;
      background-color: #bbbbbb;
    }
  }
}

.content-clear {
  padding: 0.4rem 0.8rem;
  text-align: right;
  font-family: inherit;
  color: $dark-font;

  .text {
    cursor: pointer;
  }
}

::v-deep .custom-control-inline {
  &.custom-control-element {
    width: 100%;
  }

  .custom-control-label {
    width: 100%;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
  }
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
