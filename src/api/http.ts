import axios from 'axios'

// In dev, Vite proxies /api -> https://localhost:7035 (see vite.config.ts)
export const http = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})
