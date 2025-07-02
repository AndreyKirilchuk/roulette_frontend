import axios from 'axios'

const api = axios.create({
  baseURL: 'https://roulette.buymysite.ru/public/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true
})

async function refreshToken()
{
  try{
    await api.post('/auth/refresh')
  }catch (err)
  {
    window?.Telegram.WebApp.showAlert('Сессия истекла. Перезайдите в приложение');
  }
}

api.interceptors.response.use(
  response => response, // если все хорошо — просто вернуть ответ
  async error => {
    const originalRequest = error.config;

    // Пропускаем ошибки логина и refresh-запросы
    if (originalRequest.url.includes('/auth/login') ||
      originalRequest.url.includes('/auth/refresh') ||
      error.response?.status !== 401 ||
      originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await refreshToken();
      return api(originalRequest);
    } catch (refreshError) {
      // Обработка ошибки обновления токена
      if (window?.Telegram?.WebApp?.showAlert) {
        window.Telegram.WebApp.showAlert('Сессия истекла. Перезайдите в приложение');
      }
      return Promise.reject(refreshError);
    }
  }
);

export default api

