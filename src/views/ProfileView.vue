<script setup>
import { useUserStore } from '@/stores/store.js'
import api from '@/plugins/axios.js'
import { ref, computed } from 'vue'

const showModal = ref(false)
const selectedMeme = ref(null)

const userStore = useUserStore();
const memes = ref([
  {
    name: "asd",
    description: "asd",
    image_url: "asd",
    rarity: 'legendary',
    count: 0,
    have_user: true
  },
  {
    name: "asd",
    rarity: "legendary",
    have_user: false
  }
])

// Конфигурация редкостей
const rarityConfig = {
  'common': {
    label: 'Обычные',
    chance: '50%',
    color: '#9CA3AF',
    bgColor: '#F3F4F6'
  },
  'uncommon': {
    label: 'Необычные',
    chance: '30%',
    color: '#10B981',
    bgColor: '#D1FAE5'
  },
  'rare': {
    label: 'Редкие',
    chance: '15%',
    color: '#3B82F6',
    bgColor: '#DBEAFE'
  },
  'epic': {
    label: 'Эпические',
    chance: '4%',
    color: '#8B5CF6',
    bgColor: '#EDE9FE'
  },
  'legendary': {
    label: 'Легендарные',
    chance: '0.999%',
    color: '#F59E0B',
    bgColor: '#FEF3C7'
  },
  'mythical': {
    label: 'Мифические',
    chance: '0.001%',
    color: '#EF4444',
    bgColor: '#FEE2E2'
  }
}

// Функция для открытия модального окна
function openMemeModal(meme) {
  if (meme && !meme.locked) {
    selectedMeme.value = meme
    showModal.value = true
  }
}

// Функция для закрытия модального окна
function closeMemeModal() {
  showModal.value = false
  selectedMeme.value = null
}
const memesByRarity = computed(() => {
  const grouped = {}

  // Инициализируем все редкости
  Object.keys(rarityConfig).forEach(rarity => {
    grouped[rarity] = []
  })

  // Группируем имеющиеся мемы
  memes.value.forEach(meme => {
    if (meme.rarity && grouped[meme.rarity]) {
      grouped[meme.rarity].push(meme)
    }
  })

  return grouped
})

async function getProfile() {
  try {
    const res = await api.get('/profile')
    userStore.setUser(res.data.data.user)
    memes.value = res.data.data.memes
  } catch (err) {
    console.log(err)
  }
}

await getProfile();
</script>

<template>
  <div class="profile-content">
    <div class="profile-header">
      <div class="user-profile-header">
        <div class="user-info">
          <h3>{{ userStore.user?.name }}</h3>
        </div>
        <div class="avatar-container">
          <div class="avatar-frame"></div>
          <img :src="userStore.user?.avatar" alt="avatar" class="avatar">
        </div>
      </div>

      <!-- Статистика пользователя -->
      <div class="profile-stats">
        <div class="stat-item">
          <div class="stat-label">Всего мемов {{memes.filter(item => item.have_user === true).length}}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Вращений {{userStore.user?.count_spins}}</div>
        </div>
      </div>
    </div>

    <!-- Коллекция мемов -->
    <div class="memes-collection">
      <h2 class="collection-title">Коллекция мемов</h2>

      <div
        v-for="(rarity, rarityKey) in rarityConfig"
        :key="rarityKey"
        class="rarity-section"
      >
        <div class="rarity-header">
          <h3
            class="rarity-title"
            :style="{ color: rarity.color }"
          >
            {{ rarity.label }}
          </h3>
          <span class="rarity-chance">{{ rarity.chance }}</span>
        </div>

        <div class="memes-grid">
          <!-- Показываем имеющиеся мемы -->
          <div
            v-for="meme in memesByRarity[rarityKey]"
            :key="meme.name"
          >
            <div
              class="meme-card owned"
              :style="{
                borderColor: rarity.color,
                backgroundColor: rarity.bgColor
              }"
              @click="openMemeModal(meme)"
              v-if="meme.have_user"
            >
              <div class="meme-image">
                <img
                  v-if="meme.image_url && meme.image_url !== 'asd'"
                  :src="meme.image_url"
                  :alt="meme.name"
                >
                <div v-else class="placeholder-image">
                  <span>🎭</span>
                </div>
              </div>
              <div class="meme-info">
                <h4 class="meme-name">{{ meme.name }}</h4>
              </div>
            </div>

              <!-- Показываем заблокированные слоты если мемов мало -->
              <div
                class="meme-card locked"
                :style="{ borderColor: rarity.color }"
                v-if="!meme.have_user"
              >
                <div class="meme-image locked-image">
                  <div class="lock-icon">🔒</div>
                  <div class="question-marks">???</div>
                </div>
                <div class="meme-info">
                  <h4 class="meme-name locked-text">Неизвестно</h4>
                </div>
              </div>
            </div>
          </div>


      </div>
    </div>

    <!-- Модальное окно -->
    <div v-if="showModal" class="modal-overlay" @click="closeMemeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeMemeModal">×</button>
        <div v-if="selectedMeme" class="modal-meme">
          <div class="modal-image">
            <img
              v-if="selectedMeme.image_url && selectedMeme.image_url !== 'asd'"
              :src="selectedMeme.image_url"
              :alt="selectedMeme.name"
            >
            <div v-else class="placeholder-image large">
              <span>🎭</span>
            </div>
          </div>
          <div class="modal-info">
            <h2 class="modal-title">{{ selectedMeme.name }}</h2>
            <span>Количество: {{selectedMeme.count}}</span>
            <div class="modal-rarity" :style="{ color: rarityConfig[selectedMeme.rarity]?.color }">
              {{ rarityConfig[selectedMeme.rarity]?.label }}
            </div>
            <p v-if="selectedMeme.description && selectedMeme.description !== 'asd'" class="modal-description">
              {{ selectedMeme.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.profile-header {
  background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%);
  border-radius: 20px;
  padding: 30px;
  color: white;
  margin-bottom: 30px;
}

.user-profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.user-info {
  flex: 1;
}

.user-info h3 {
  font-size: 2rem;
  font-weight: bold;
  margin: 0 0 10px 0;
}

.level-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
}

.avatar-container {
  position: relative;
}

.avatar-frame {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  background: linear-gradient(45deg, #ffd700, #ffed4e);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  position: relative;
  z-index: 1;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.stat-item {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Стили для коллекции мемов */
.memes-collection {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.collection-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.rarity-section {
  margin-bottom: 40px;
}

.rarity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f1f5f9;
}

.rarity-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.rarity-chance {
  background: #f1f5f9;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
}

.memes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
}

.meme-card {
  border: 2px solid;
  border-radius: 10px;
  padding: 10px;
  transition: all 0.3s ease;
  cursor: pointer;
  height: 140px;
  display: flex;
  flex-direction: column;
}

.meme-card.owned {
  transform: scale(1);
}

.meme-card.owned:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.meme-card.locked {
  background: #f8fafc;
  border-style: dashed;
  opacity: 0.6;
  cursor: not-allowed;
}

.meme-image {
  width: 100%;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  flex-shrink: 0;
}

.meme-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  font-size: 2rem;
  opacity: 0.5;
}

.placeholder-image.large {
  font-size: 4rem;
}

.locked-image {
  flex-direction: column;
  gap: 10px;
  background: #e2e8f0;
}

.lock-icon {
  font-size: 1.5rem;
  opacity: 0.5;
}

.question-marks {
  font-size: 1rem;
  font-weight: bold;
  color: #94a3b8;
}

.meme-info {
  text-align: center;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.meme-name {
  font-size: 0.8rem;
  font-weight: bold;
  margin: 0;
  color: #1e293b;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.meme-name.locked-text {
  color: #94a3b8;
}

.meme-description {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  position: relative;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  font-size: 20px;
  cursor: pointer;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.2);
}

.modal-meme {
  display: flex;
  flex-direction: column;
}

.modal-image {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  overflow: hidden;
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-info {
  padding: 25px;
}

.modal-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0 0 10px 0;
  color: #1e293b;
}

.modal-rarity {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modal-description {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .profile-content {
    padding: 15px;
  }

  .user-profile-header {
    flex-direction: row;
    text-align: left;
    gap: 20px;
  }

  .memes-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
  }

  .rarity-header {
  }
}
</style>
