import { Axios } from 'axios';

export const api = new Axios({
  baseURL: 'http://192.168.200.51:9090/saoluis-online/api',
});

api.interceptors.request.use((config) => {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBUEkgc2FvbHVpc19vbmxpbmUiLCJzdWIiOiJ1c2VyYWRtQHRlc3RlLmNvbSIsImlkIjo0fQ.01vIFnECvKMptaeoqOF9uu5TJpHo6S5L7iGXLArwz0o';
  config.headers.Authorization = `Bearer ${token}`;

  return config;
});
