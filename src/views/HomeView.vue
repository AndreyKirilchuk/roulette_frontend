<script setup>
  import { useUserStore } from '@/stores/store.js'

  const userStore = useUserStore();

</script>

<template>
  <div>
    HomePage

    {{userStore.user}}
  </div>
</template>

<style scoped>

</style>
