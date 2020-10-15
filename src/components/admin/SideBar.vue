<template>
  <div class="admin-sidebar">
    <ul class="admin-sidebar-list p-0 m-0">
      <li>
        <router-link class="link" to="/admin/SampleImage">
          <span>樣品圖檔管理</span>
          <font-awesome-icon :icon="['fas', 'caret-right']" />
        </router-link>
      </li>
      <li>
        <router-link class="link" to="/admin/SampleColor">
          <span>樣品色卡管理</span>
          <font-awesome-icon :icon="['fas', 'caret-right']" />
        </router-link>
      </li>
      <li>
        <router-link class="link" to="/admin/SampleModel">
          <span>樣品模型管理</span>
          <font-awesome-icon :icon="['fas', 'caret-right']" />
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "SideBar",
  props: {
    sidebarTogglable: Boolean
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/ThemColors.scss";

.admin-sidebar {
  width: 20rem;
  height: 100%;
  background-color: $admin-secondary;
  color: $light-font;

  .admin-sidebar-list {
    list-style-type: none;
    height: 100%;

    .link {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0.4rem 0.6rem;
      cursor: pointer;
    }
  }
}
</style>
