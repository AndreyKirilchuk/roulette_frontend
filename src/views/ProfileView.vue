<script setup>
  import { useUserStore } from '@/stores/store.js'

  const userStore = useUserStore();
</script>

<template>
  <div class="profile-content">
    <div class="profile-header">
<!--      <div class="level-badge">Уровень 5</div>-->

      <div class="user-profile-header">
        <div>
          <h3>{{ userStore.user?.name }}</h3>
          <div class="level-badge">Уровень 5</div>
        </div>
        <div class="avatar-container">
          <div class="avatar-frame"></div>
          <img :src="userStore.user?.avatar" alt="avatar" class="avatar">
        </div>
      </div>

      <!-- Статистика пользователя -->
      <div class="profile-stats">
        <div class="stat-item">
<!--          <div class="stat-value">{{ userAuras.length || 0 }}</div>-->
          <div class="stat-label">Всего аур</div>
        </div>
        <div class="stat-item">
<!--          <div class="stat-value">{{ totalSpins || 0 }}</div>-->
          <div class="stat-label">Вращений</div>
        </div>
        <div class="stat-item">
<!--          <div class="stat-value">{{ userScore || 0 }}</div>-->
          <div class="stat-label">Рейтинг</div>
        </div>
      </div>
    </div>


<!--    <div v-if="userAuras.length === 0" class="empty-state">-->
<!--      <div class="icon">🎲</div>-->
<!--      <h3>Пока нет аур</h3>-->
<!--      <p>Перейдите в рулетку и попробуйте удачу!</p>-->
<!--    </div>-->

<!--    <div v-else class="aura-grid">-->
<!--      <div-->
<!--        v-for="aura in userAuras"-->
<!--        :key="aura.id"-->
<!--        class="aura-card"-->
<!--        :class="aura.rarity"-->
<!--      >-->
<!--        <div class="aura-icon">{{ aura.icon }}</div>-->
<!--        <div class="aura-name">{{ aura.name }}</div>-->
<!--        <div class="aura-rarity" :style="{color: getRarityColor(aura.rarity)}">-->
<!--          {{ getRarityName(aura.rarity) }}-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>

<style>

</style>
