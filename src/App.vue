<script setup>
import { RouterView, useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/store.js'
import api from '@/plugins/axios.js'

const route = useRoute()
const error = ref(false)
const error_message = ref()
const showNav = ref(computed(() => route.path !== '/register'))
const router = useRouter()

const userStore = useUserStore()

onMounted(async () => {

  const tg = window.Telegram?.WebApp

  // if (!tg || !tg.initData) {
  //   error.value = true
  //   error_message.value = 'Приложение доступно только внутри Telegram'
  //   return
  // }

  // if (tg.platform !== 'android' && tg.platform !== 'ios') {
  //   error.value = true
  //   error_message.value = 'Доступно только в мобильном приложении Telegram (Android/iOS)'
  //   return
  // }

  const initData = "query_id=AAGCcT8KAwAAAIJxPwriddpH&user=%7B%22id%22%3A6614380930%2C%22first_name%22%3A%22%D0%9C%D0%BE%D0%B4%D0%B5%D1%80%D0%B0%D1%82%D0%BE%D1%80%20%D0%9D%D0%B0%D0%B9%D0%B4%D0%B8%20%D0%BC%D0%B5%D0%BD%D1%8F%20%28%20%D0%9C%D0%A6%D0%9A%20-%20%D0%9A%D0%A2%D0%98%D0%A2%D0%A1%20%29%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22ModerFindMe%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2Fvxcx6OSc5u9EiBKHp9LpKBST4b-__WJw01Ws46q4360eJn-7NwH4FH09azz5pmye.svg%22%7D&auth_date=1751469130&signature=VZlZyhNJ2JKFlOgqzLA_FwqCRTD5B1GgWWmZtjhlciIILM8pK6C8WIbO6NBvMO6oZMyQOpEbSCosii-fJjrdBA&hash=1f79b71a7467930ada23781905a3dde22a77a3221bf6d75698b8075680881714";

  if (initData) {
    try {
      const res = await api.post('/auth/login', { initData })
      userStore.setUser(res.data.data.user)
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

      <div class="bottom-nav" v-if="!error && showNav">
        <router-link to="/profile" class="nav-item" :class="{ active: route.path === '/profile' }">
          <div class="nav-icon">😎</div>
          <div class="nav-label">Профиль</div>
        </router-link>
        <router-link to="/" class="nav-item" :class="{ active: route.path === '/' }">
          <div class="nav-icon">🎯</div>
          <div class="nav-label">Рулетка</div>
        </router-link>
        <router-link to="/users" class="nav-item" :class="{ active: route.path === '/users' }">
          <div class="nav-icon">🏆</div>
          <div class="nav-label">Игроки</div>
        </router-link>
      </div>

      <div v-if="error" class="error-overlay">
        <div class="error-card">
          <div class="error-icon">⚠️</div>
          <h2 class="error-title">Ошибка</h2>
          <p class="error-message">{{ error_message }}</p>
        </div>
      </div>
    </div>
  </Suspense>
</template>

<style scoped>
.app-container {
  max-width: 100%;
  min-height: 100vh;
  position: relative;
  padding-bottom: 60px; /* Для bottom-nav */
}

.error-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.error-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-title {
  color: #ff3b30;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 12px;
}

.error-message {
  color: #333;
  font-size: 16px;
  margin-bottom: 24px;
  line-height: 1.4;
}

.error-button {
  background: #007aff;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s;
}

.error-button:hover {
  background: #0062cc;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  background: #ffffff;
  padding: 8px 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #666;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s;
}

.nav-item.active {
  color: #007aff;
  background: rgba(0, 122, 255, 0.1);
}

.nav-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.nav-label {
  font-size: 12px;
  font-weight: 500;
}
</style>
