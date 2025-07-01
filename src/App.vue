<script setup>
import { RouterView, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/store.js'
import myAxios from '@/plugins/axios.js'

const router = useRouter()
const error = ref(false)
const error_message = ref()

const userStore = useUserStore()

onMounted(async () => {
  const tg = window.Telegram?.WebApp

  if (!tg) {
    error.value = true
    return
  }

  const initData = tg.initData

  if (initData) {
    try {
      const res = await myAxios.post('/auth/login', { initData })
      userStore.setUser(res.data.user)
    } catch (err) {
      if (err.response && err.response.status === 401) return router.push('/register')
      else {
        error.value = true
        error_message.value = err
      }
    }
  }
})
</script>

<template>
  <Suspense>
    <div>
      <RouterView v-if="!error" />
      <div v-if="error">
        <p>Ошибка:</p>
        {{ error_message }}
      </div>
    </div>
  </Suspense>
</template>

<style scoped></style>
