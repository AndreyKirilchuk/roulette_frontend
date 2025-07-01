import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
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
    window?.Telegram.WebApp.showAlert('Сессия истекла. Приложение будет закрыто.', () => {
      window?.Telegram.WebApp.close();
    });
  }
}

api.interceptors.response.use(
  response => response, // если все хорошо — просто вернуть ответ
  async error => {
    const originalRequest = error.config;

    // Проверяем, что ошибка 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // чтобы не зациклить

      try {
        await refreshToken(); // обновляем токен
        return api(originalRequest); // повторяем исходный запрос
      } catch (refreshError) {
        // Если обновить не получилось — делаем что-то (например, редирект на логин)
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api

