import axios from 'axios';

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
  (response) => {
    if (typeof response.data === 'string' && response.data) {
      try {
        response.data = JSON.parse(response.data);
      } catch (e) {
        // MELHORIA: Se o parse falhar, vamos tratar como um erro de API.
        console.error(
          'A resposta da API era uma string que não é um JSON válido. Rejeitando a promise.',
          e,
        );

        // Transformamos um "sucesso falso" em um erro real que pode ser capturado pelo .catch()
        return Promise.reject(
          new Error(
            `A API retornou uma resposta em formato inesperado: ${response.data}`,
          ),
        );
      }
    }
    return response;
  },
  // Função para respostas de ERRO
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
