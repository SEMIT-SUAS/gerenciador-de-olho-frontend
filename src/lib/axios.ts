import { BASE_API_URL } from '@/constants/baseApiURL';
import { Axios } from 'axios';

export const api = new Axios({
  baseURL: BASE_API_URL,
});

api.interceptors.request.use((config) => {
  // const token = localStorage.getItem('token');
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBUEkgc2FvbHVpc19vbmxpbmUiLCJzdWIiOiJ1c2VyYWRtQHRlc3RlLmNvbSIsImlkIjo0fQ.e8YH4pEsH2N2_QGUZzHx7rq3TI4raK641Q5Y9uLnw7"

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
