import axios from 'axios'

const myAxios = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
})

const authAxios = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  withCredentials: true,
  withXSRFToken: true
})

export { myAxios, authAxios }
