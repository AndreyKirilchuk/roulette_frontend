import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)

  function setUser(userData)
  {
    user.value = userData
  }

  return { user, setUser }
})
