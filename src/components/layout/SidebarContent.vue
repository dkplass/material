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
    <div class="sidebar-content-catagory" v-for="(catagory, index) in filterTags" :key="index">
      <div class="sidebar-content-catagory-head" v-b-toggle="`collapse-${index}`">
        <span class="sidebar-text">{{ catagory.SeriesTagName }}</span>
        <button class="btn expand-btn float-right" v-if="catagory.SeriesTagItems.length > 0">
          <font-awesome-icon class="when-close" :icon="['fas', 'plus']" />
          <font-awesome-icon class="when-open" :icon="['fas', 'minus']" />
        </button>
      </div>
      <b-collapse :id="`collapse-${index}`" class="w-100">
        <b-list-group
          class="collapse-content"
          v-for="(tag, index) in catagory.SeriesTagItems"
          :key="index"
        >
          <b-list-group-item class="collapse-content-item">
            <b-form-checkbox
              v-model="slectedTags"
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
    <!-- <b-list-group class="custome-group-list">
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
      </b-list-group> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "SideBarMenu",
  data() {
    return {
      selectedTag: "",
      slectedTags: [],
      search: ""
    };
  },
  watch: {
    slectedTags: {
      handler(value) {
        // if (this.$route.path !== "/main") {
        //   this.$router.push({ name: "main" });
        // }

        this.$store.dispatch("Sample/getSamples", value);

        this.$store.commit("TagList/setSlectedTags", value);
      },
      deep: true
    }
  },
  created() {
    this.init();

    this.retrieveDefaultSample();
  },
  computed: {
    ...mapGetters("TagList", {
      getTagList: "getTagList",
      getSlectedTags: "getSlectedTags"
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

      return categories.filter(category => {
        category.SeriesTagItems = category.SeriesTagItems.filter(
          tag => reg.test(tag.TagName) === true
        );
        return category.SeriesTagItems.length > 0;
      });
    }
  },
  methods: {
    init() {
      this.$store.dispatch("TagList/getTags", this.slectedTags);

      this.slectedTags = this.getSlectedTags;
    },
    retrieveDefaultSample() {
      this.$store.dispatch("Sample/getSamples", this.slectedTags);

      this.$store.commit("TagList/setSlectedTags", this.slectedTags);
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
