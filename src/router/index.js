import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '@/views/RegisterView.vue'
import UsersView from '@/views/UsersView.vue'
import ProfileView from '@/views/ProfileView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/',
      name: 'users',
      component: UsersView,
    },    {
      path: '/',
      name: 'profile',
      component: ProfileView
    },

  ],
})

export default router
