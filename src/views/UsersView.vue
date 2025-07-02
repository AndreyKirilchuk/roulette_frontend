<script setup>
  import { ref } from 'vue'
  import api from '@/plugins/axios.js'

  const filters = ref({
    name: '',
    sortBy: ''
  })

  const users = ref()

  async function getUsers()
  {
    try{
      const res = await api.get('/users')
      users.value = res.data.data.users
    }catch(error){
      console.log(error)
    }
  }


  await getUsers();
</script>

<template>
  <div class="players-content">
    <input
      v-model="filters.name"
      class="search-box"
      placeholder="Поиск по имени..."
    >

    <div class="sort-buttons">
      <button
        class="sort-btn"
        :class="{ active: filters.sortBy === 'score' }"
        @click="filters.sortBy = 'score'"
      >
        По рейтингу
      </button>
      <button
        class="sort-btn"
        :class="{ active: filters.sortBy === 'auras' }"
        @click="filters.sortBy = 'auras'"
      >
        По количеству аур
      </button>
      <button
        class="sort-btn"
        :class="{ active: filters.sortBy === 'spins' }"
        @click="filters.sortBy = 'spins'"
      >
        По вращениям
      </button>
    </div>

    <div class="player-list">
      <div
        v-for="(user, index) in users"
        :key="user.id"
        class="player-card"
      >
        <div class="player-info">
          <div class="player-rank">{{ index + 1 }}</div>
          <div class="player-details">
            <h4>{{ user.name }}</h4>
            <div class="player-stats">
              {{ user.count_spins }} вращений
            </div>
          </div>
        </div>
        <div class="player-score">{{ user.score }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
