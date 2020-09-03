<template>
  <div class="wrapper">
    <!-- navbar -->
    <!-- sidebar -->
    <router-view :key="$router.path"></router-view>
  </div>
</template>

<script>
export default {
  name: "AdminLayout"
};
</script>
