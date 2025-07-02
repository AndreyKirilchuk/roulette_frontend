<script setup>
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/store.js'
import { useRouter } from 'vue-router'
import api from '@/plugins/axios.js'

const router = useRouter()

const name = ref('')
const initData = ref('')
const userStore = useUserStore()

onMounted(() => {
  const tg = window.Telegram?.WebApp
  if (tg) {
    if (tg.initDataUnsafe?.user?.first_name) {
      name.value = tg.initDataUnsafe.user.first_name
    }
    if (tg.initData) {
      initData.value = tg.initData
    }
  }
})

async function register() {
  try {
    const res = await api.post('/auth/register', {
      name: name.value,
      initData: initData.value
    })
    userStore.setUser(res.data.data.user)
    return router.push('/')
  } catch (err) {
    if (err.response && err.response.status === 422) console.log(err.response)
    else console.log(err)
  }
}
</script>

<template>
  <div class="registration">
    <h1>Крутилка мемов</h1>
    <p>Добро пожаловать! Введите свой ник</p>

    <div class="input-group">
      <input v-model="name" type="text" placeholder="Введите ваш ник" maxlength="20" />
    </div>

    <button class="btn-primary" @click="register" :disabled="!name.trim()">Продолжить</button>
  </div>
</template>

<style scoped></style>
