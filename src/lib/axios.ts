import { BASE_API_URL } from '@/constants/baseApiURL';
import { Axios } from 'axios';

export const api = new Axios({
  baseURL: BASE_API_URL,
});
