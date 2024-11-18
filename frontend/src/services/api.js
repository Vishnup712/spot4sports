import axios from 'axios'

const API_URL = 'https://spot4sports.onrender.com/api'

const api = axios.create({
  baseURL: API_URL,
})

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
