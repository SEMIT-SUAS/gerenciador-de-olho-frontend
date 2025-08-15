import { Axios } from 'axios'

export const api = new Axios({
    baseURL: "http://192.168.200.51:9090/saoluis-online/api"
})

// api.interceptors.request.use((config) => {
//   const token = "";
//   config.headers.Authorization = `Bearer ${token}`

//   return config
// })
