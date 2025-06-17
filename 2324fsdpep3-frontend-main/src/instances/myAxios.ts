import axios from 'axios'

const myAxios = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}` || 'http://localhost:8080/',
  withCredentials: true,
  withXSRFToken: true
})

export { myAxios }
