import type { UsuarioLogin, UsuarioModel } from '@/types/Usuario';
import { api } from '../config/api';
import { type LoginFormValues } from '@/pages/LoginPage/components/loginSchema';
import { AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';

interface LoginResponse {
  token: string;
}

interface JwtPayload {
  sub: string;
}

const login = async (credentials: LoginFormValues): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>(
      'gerenciador/login',
      credentials,
    );

    const { token } = response.data;
    localStorage.setItem('authToken', token);

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        'Não foi possível fazer login. Verifique suas credenciais.',
      );
    }
  }
};
const getProfile = async (loginIdentifier?: string): Promise<UsuarioLogin> => {
  let email = loginIdentifier;

  if (!email) {
    const token = getAuthToken();
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        email = decodedToken.sub;
      } catch (error) {
        logout();
        throw new Error('Sessão inválida. Por favor, faça login novamente.');
      }
    }
  }

  if (!email) {
    throw new Error('Nenhuma sessão ativa encontrada.');
  }

  try {
    const response = await api.get<UsuarioLogin>(
      `/gerenciador/pegar-dados-login`,
      {
        params: {
          login: email,
        },
      },
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      logout();
      throw new Error('Sessão expirada. Por favor, faça login novamente.');
    }
    throw new Error('Não foi possível carregar os dados do usuário.');
  }
};

const logout = () => {
  localStorage.removeItem('authToken');
};

const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

const getAllUsuarios = async (): Promise<UsuarioModel> => {
  const token = getAuthToken();
  if (token) {
    try {
      const response = await api.get<UsuarioModel>('/gerenciador/listar-todas');
    } catch (error) {}
  }
};

const usuarioService = {
  login,
  logout,
  getAuthToken,
  getProfile,
};

export default usuarioService;
