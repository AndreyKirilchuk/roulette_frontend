<script setup>
import { ref } from 'vue'
import api from '@/plugins/axios.js'

const baseRarities = [
  {
    rarity: 'common',
    change: '50%',
    emoji: '⚪',
    background: 'linear-gradient(45deg, #e0e0e0, #ffffff)',
  },
  {
    rarity: 'uncommon',
    change: '30%',
    emoji: '🟢',
    background: 'linear-gradient(45deg, #a8e063, #56ab2f)',
  },
  {
    rarity: 'rare',
    change: '15%',
    emoji: '🔵',
    background: 'linear-gradient(45deg, #00c6ff, #0072ff)',
  },
  {
    rarity: 'epic',
    change: '4%',
    emoji: '🟣',
    background: 'linear-gradient(45deg, #9d50bb, #6e48aa)',
  },
  {
    rarity: 'legendary',
    change: '0.999%',
    emoji: '🟠',
    background: 'linear-gradient(45deg, #f7971e, #ffd200)',
  },
  {
    rarity: 'mythical',
    change: '0.001%',
    emoji: '🌟',
    background: 'linear-gradient(45deg, #ee9ca7, #ffdde1)',
  },
]

const isSpinning = ref(false)
const result = ref(null)
const extendedRarities = ref([])

function shuffle(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}

function generateTrack() {
  const repeated = []
  for (let i = 0; i < 10; i++) {
    repeated.push(...shuffle(baseRarities))
  }
  extendedRarities.value = repeated
}

async function spinRoulette() {
  try {
    if (isSpinning.value) return
    isSpinning.value = true
    result.value = null

    generateTrack()

    const res = await api.post('/memes/spin')
    const wonRarity = res.data.data.meme.rarity

    const track = document.getElementById('rouletteTrack')
    const totalCards = extendedRarities.value.length
    const cardWidth = 130 + 8 // width + gap

    // Найти ближайший индекс нужной редкости в середине
    const centerStart = Math.floor(totalCards / 3)
    const centerEnd = Math.floor((totalCards / 3) * 2)
    let targetIndex = extendedRarities.value
      .slice(centerStart, centerEnd)
      .findIndex((item) => item.rarity === wonRarity)

    if (targetIndex === -1) targetIndex = 0
    targetIndex += centerStart

    const offset = targetIndex * cardWidth

    track.style.transition = 'transform 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    track.style.transform = `translateX(-${offset}px)`

    setTimeout(() => {
      const background = baseRarities.find(item => item.rarity === wonRarity)?.background
      const emoji = baseRarities.find(item => item.rarity === wonRarity)?.emoji
      result.value = { ...res.data.data.meme, background, emoji }
      isSpinning.value = false
      // фиксируем позицию
      track.style.transition = 'none'
      track.style.transform = `translateX(-${offset}px)`
    }, 3000)
  } catch (err) {
    console.log(err)
    isSpinning.value = false
  }
}
</script>

<template>
  <div class="spinner-content">
    <div class="roulette-container">
      <div class="roulette-pointer"></div>
      <div class="roulette-track" id="rouletteTrack">
        <div
          :style="`background: ${rarity.background}`"
          class="meme-card"
          v-for="(rarity, index) in extendedRarities"
          :key="index"
        >
          <div style="font-size: 1.8rem; margin-bottom: 8px">{{ rarity.emoji }}</div>
          <div>{{ rarity.rarity }}</div>
        </div>
      </div>
    </div>

    <button class="spin-button" @click="spinRoulette" :disabled="isSpinning">Крутить</button>

    <div class="rarity-info">
      <div class="rarity-title">Редкости</div>
      <div class="rarity-item" v-for="(rarity, index) in baseRarities" :key="index">
        <div class="rarity-dot">{{ rarity.emoji }}</div>
        <div class="rarity-name">{{ rarity.rarity }}</div>
        <div class="rarity-chance">{{ rarity.change }}</div>
      </div>
    </div>

    <!-- Модалка результата -->
    <div class="result-display_container" v-if="result">

    </div>

    <div class="result-display" v-if="result">
      <div class="result-card show" :style="`background: ${result.background}`">
        {{ result.emoji }} {{ result.rarity }}
      </div>
      <button class="spin-button" @click="result = null">К рулетке</button>
    </div>
  </div>
</template>

<style scoped>
.roulette-container {
  margin-top: 100px;
  position: relative;
  width: 90vw;
  max-width: 600px;
  height: 180px;
  overflow: hidden;
  border-radius: 12px;
  background: rgba(30, 60, 114, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.roulette-track {
  display: flex;
  height: 100%;
  transition: transform 3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  gap: 8px;
  padding: 15px;
  align-items: center;
}

.meme-card {
  min-width: 130px;
  height: 150px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
  text-align: center;
  font-size: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.roulette-pointer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: 100px;
  background: #fff;
  border-radius: 1px;
  z-index: 10;
}

.roulette-pointer::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 10px solid #fff;
}

.spin-button {
  background: linear-gradient(135deg, #4a90e2, #2a5298);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 30px;
}

.spin-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.rarity-info {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(30, 60, 114, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 15px;
  width: 140px;
  backdrop-filter: blur(10px);
}

.rarity-title {
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 12px;
  text-align: center;
}

.rarity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.75rem;
  gap: 10px;
  text-align: center;
}

.rarity-item:last-child {
  margin-bottom: 0;
}

.rarity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}

.rarity-name {
  color: #e8f4f8;
  flex: 1;
  font-size: 0.7rem;
}

.rarity-chance {
  color: #b8d4e3;
  font-size: 0.7rem;
}

.result-display_container{
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background:rgba(0,0,0,0.5);
  z-index: 500;
  backdrop-filter: blur(5px);
}

.result-display {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 700;
}

.result-card {
  padding: 20px 25px;
  border-radius: 10px;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  background: rgba(30, 60, 114, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(15px);
  transform: scale(0);
  transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.result-card.show {
  transform: scale(1);
}

@media (max-width: 480px) {
  .rarity-info {
    top: 15px;
    right: 15px;
    width: 120px;
    padding: 12px;
  }

  .rarity-title {
    font-size: 0.8rem;
    margin-bottom: 10px;
  }

  .rarity-item {
    font-size: 0.7rem;
    margin-bottom: 6px;
    display: flex;
    gap: 10px;
    text-align: center;
  }

  .rarity-name {
    font-size: 0.65rem;
  }

  .rarity-chance {
    font-size: 0.65rem;
  }

  .meme-card {
    min-width: 110px;
    height: 130px;
    font-size: 0.8rem;
  }

  .spin-button {
    width: 100px;
    height: 40px;
    font-size: 0.9rem;
  }
}
</style>
