import axios from 'axios';

export const api = new axios.Axios({
  baseURL: 'http://10.0.0.159:9090/saoluis-online/api/gerenciador',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
