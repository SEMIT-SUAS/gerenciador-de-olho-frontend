import type {
  UsuarioModel,
  UsuarioPorId,
  UsuarioUpdate,
} from '@/types/Usuario';
import { api } from '@/lib/axios';
import { type LoginFormValues } from '@/pages/LoginPage/components/loginSchema';
import { AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';

interface LoginResponse {
  token: string;
}

interface JwtPayload {
  sub: string;
}

interface DadosCadastroGerenciador {
  nome: string;
  email: string;
  senha: string;
}

// interface DadosAtualizarGerenciador {
//   id: number;
//   nome?: string;
//   email?: string;
//   senha?: string;
// }

const login = async (credentials: LoginFormValues): Promise<LoginResponse> => {
  try {
    const body = JSON.stringify(credentials);
    const response = await api.post('/login', body, {
      headers: {
        'Content-Type': 'Application/json',
      },
      responseType: 'json',
    });

    const responseBody = response.data as LoginResponse;
    localStorage.setItem('authToken', responseBody.token);

    return responseBody;
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

const getProfile = async (loginIdentifier?: string): Promise<UsuarioModel> => {
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
    const response = await api.get<UsuarioModel>(`/usuario/pegar-dados-login`, {
      params: {
        login: email,
      },
    });
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

const getAllUsuarios = async (): Promise<UsuarioModel[]> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error('Usuário não autenticado.');
  }

  try {
    const response = await api.get('/usuario/listar-todos');

    return response.data as UsuarioModel[];
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        logout();
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
    }

    throw new Error('Não foi possível carregar todos os usuários.');
  }
};

export const updateUsuario = async (
  usuario: UsuarioUpdate,
): Promise<UsuarioModel> => {
  const body = JSON.stringify(usuario);

  try {
    const response = await api.put<UsuarioModel>(
      `
        /usuario/atualizar`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//nome gerenciador igual da api
const cadastrarGerenciador = async (
  dados: DadosCadastroGerenciador,
): Promise<UsuarioModel> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Usuário não autenticado.');
  }

  const body = JSON.stringify(dados);

  try {
    const response = await api.post<UsuarioModel>('/usuario/cadastrar', body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      logout();
      throw new Error('Sessão expirada. Por favor, faça login novamente.');
    }

    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error('Não foi possível cadastrar o usuário.');
  }
};

const listarUsuariosAtivos = async (): Promise<UsuarioModel[]> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Usuário não autenticado.');
  }

  try {
    const response = await api.get<UsuarioModel[]>('/usuario/listar-todos');
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      logout();
      throw new Error('Sessão expirada. Por favor, faça login novamente.');
    }

    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error('Não foi possível carregar a lista de usuários ativos.');
  }
};

// buscar usuário por ID - GET /gerenciador/buscar/{id}
const buscarUsuarioPorId = async (id: number): Promise<UsuarioPorId> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Usuário não autenticado.');
  }

  try {
    const response = await api.get<UsuarioPorId>(`/usuario/buscar/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      logout();
      throw new Error('Sessão expirada. Por favor, faça login novamente.');
    }

    if (error instanceof AxiosError && error.response?.status === 404) {
      throw new Error('Usuário não encontrado.');
    }

    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error('Não foi possível carregar os dados do usuário.');
  }
};

const excluirUsuario = async (id: number): Promise<void> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Usuário não autenticado.');
  }

  try {
    await api.delete(`/usuario/deletar/${id}`);
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      logout();
      throw new Error('Sessão expirada. Por favor, faça login novamente.');
    }

    if (error instanceof AxiosError && error.response?.status === 404) {
      throw new Error('Usuário não encontrado.');
    }

    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error('Não foi possível excluir o usuário.');
  }
};

const usuarioService = {
  login,
  logout,
  getAuthToken,
  getProfile,
  getAllUsuarios,
  listarUsuariosAtivos,
  cadastrarGerenciador,
  updateUsuario,
  buscarUsuarioPorId,
  excluirUsuario,
};

export default usuarioService;
