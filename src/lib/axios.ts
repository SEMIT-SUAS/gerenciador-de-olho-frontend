import axios, { AxiosError, type AxiosResponse } from 'axios';

export const api = new axios.Axios({
  baseURL: 'https://saoluisonline.saoluis.ma.gov.br/api/gerenciador',
  headers: {
    'Content-Type': 'Application/json',
  },
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
  // Função para respostas de SUCESSO
  (response: AxiosResponse) => {
    // SE A RESPOSTA FOR UMA STRING, TENTE CONVERTÊ-LA PARA JSON
    if (typeof response.data === 'string' && response.data) {
      try {
        response.data = JSON.parse(response.data);
      } catch (e) {
        // Se falhar o parse, não faz nada e retorna a string original.
        console.error(
          'A resposta da API era uma string que não é um JSON válido:',
          e,
        );
      }
    }
    return response;
  },
  // Função para respostas de ERRO
  (error: AxiosError) => {
    // Tratamento de erros globais (como 401 para deslogar)
    return Promise.reject(error);
  },
);

export default api;
