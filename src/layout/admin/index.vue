<template>
  <div class="wrapper">
    <router-view :key="$router.path"></router-view>
  </div>
</template>

<script>
export default {
  name: "AdminLayout"
};
</script>
