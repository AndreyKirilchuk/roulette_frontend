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
      initData: "query_id=AAGCcT8KAwAAAIJxPwriddpH&user=%7B%22id%22%3A6614380930%2C%22first_name%22%3A%22%D0%9C%D0%BE%D0%B4%D0%B5%D1%80%D0%B0%D1%82%D0%BE%D1%80%20%D0%9D%D0%B0%D0%B9%D0%B4%D0%B8%20%D0%BC%D0%B5%D0%BD%D1%8F%20%28%20%D0%9C%D0%A6%D0%9A%20-%20%D0%9A%D0%A2%D0%98%D0%A2%D0%A1%20%29%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22ModerFindMe%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2Fvxcx6OSc5u9EiBKHp9LpKBST4b-__WJw01Ws46q4360eJn-7NwH4FH09azz5pmye.svg%22%7D&auth_date=1751469130&signature=VZlZyhNJ2JKFlOgqzLA_FwqCRTD5B1GgWWmZtjhlciIILM8pK6C8WIbO6NBvMO6oZMyQOpEbSCosii-fJjrdBA&hash=1f79b71a7467930ada23781905a3dde22a77a3221bf6d75698b8075680881714"
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
