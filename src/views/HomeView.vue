<script setup>
  import { useUserStore } from '@/stores/store.js'
  import api from '@/plugins/axios.js'

  const userStore = useUserStore();

  async function getCheck()
  {
    try{
      const res = await api.get('/check')
      console.log(res)
    }catch (err)
    {
      console.log(err)
    }
  }

  await getCheck()
</script>

<template>
  <div class="spinner-content">



  </div>
</template>

<style scoped>

</style>
