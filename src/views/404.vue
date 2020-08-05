<template>
  <div>
    <b-dropdown dropleft>
      <template v-slot:button-content>
        <font-awesome-icon :icon="['fas', 'cog']" />
      </template>
      <b-dropdown-item href="#"
        ><font-awesome-icon :icon="['fas', 'arrow-up']" />222</b-dropdown-item
      >
      <b-dropdown-item href="#"><font-awesome-icon :icon="['fas', 'times']" />222</b-dropdown-item>
      <b-dropdown-item href="#"><font-awesome-icon :icon="['fas', 'ban']" />333</b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
export default {
  name: "404"
};
</script>
