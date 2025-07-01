import axios from 'axios'

const myAxios = axios.create({
  baseURL: 'https://roulette.buymysite.ru/public/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

export default myAxios
