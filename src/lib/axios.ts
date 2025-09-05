import axios from 'axios';

export const api = new axios.Axios({
  //baseURL: 'https://saoluisonline.saoluis.ma.gov.br/api/gerenciador',
  baseURL: 'http://192.168.200.51:9090/saoluis-online/api/gerenciador',
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

api.interceptors.response.use(
  (response) => {
    if (typeof response.data === 'string' && response.data) {
      try {
        response.data = JSON.parse(response.data);
      } catch {}
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
