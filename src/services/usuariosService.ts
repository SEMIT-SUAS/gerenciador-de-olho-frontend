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

interface GerenciadorDTO {
  // ta incompleto
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
}

interface AtualizarResponse {
  mensagem: string;
  usuario: GerenciadorDTO;
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

const getAllUsuarios = async (): Promise<UsuarioLogin[]> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error('Usuário não autenticado.');
  }

  try {
    const response = await api.get<UsuarioLogin[]>('/gerenciador/listar-todos');

    return response.data;
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

//nome gerenciador igual da api
const cadastrarGerenciador = async (
  dados: DadosCadastroGerenciador,
): Promise<UsuarioLogin> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Usuário não autenticado.');
  }

  try {
    const response = await api.post<UsuarioLogin>(
      '/gerenciador/cadastrar',
      dados,
    );
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

const listarUsuariosAtivos = async (): Promise<UsuarioLogin[]> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Usuário não autenticado.');
  }

  try {
    const response = await api.get<UsuarioLogin[]>('/gerenciador/listar-todos');
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
// const buscarUsuarioPorId = async (id: number): Promise<GerenciadorDTO> => {
//   const token = getAuthToken();
//   if (!token) {
//     throw new Error('Usuário não autenticado.');
//   }

//   try {
//     const response = await api.get<GerenciadorDTO>(`/gerenciador/buscar/${id}`);
//     return response.data;
//   } catch (error) {
//     if (error instanceof AxiosError && error.response?.status === 401) {
//       logout();
//       throw new Error('Sessão expirada. Por favor, faça login novamente.');
//     }

//     if (error instanceof AxiosError && error.response?.status === 404) {
//       throw new Error('Usuário não encontrado.');
//     }

//     if (error instanceof AxiosError && error.response?.data?.message) {
//       throw new Error(error.response.data.message);
//     }

//     throw new Error('Não foi possível carregar os dados do usuário.');
//   }
// };

// // 4. Atualizar usuário - PUT /gerenciador/atualizar
// const atualizarUsuario = async (
//   dados: DadosAtualizarGerenciador,
// ): Promise<AtualizarResponse> => {
//   const token = getAuthToken();
//   if (!token) {
//     throw new Error('Usuário não autenticado.');
//   }

//   try {
//     const response = await api.put<AtualizarResponse>(
//       '/gerenciador/atualizar',
//       dados,
//     );
//     return response.data;
//   } catch (error) {
//     if (error instanceof AxiosError && error.response?.status === 401) {
//       logout();
//       throw new Error('Sessão expirada. Por favor, faça login novamente.');
//     }

//     if (error instanceof AxiosError && error.response?.data?.message) {
//       throw new Error(error.response.data.message);
//     }

//     throw new Error('Não foi possível atualizar os dados do usuário.');
//   }
// };

// // 5. Excluir usuário - DELETE /gerenciador/{id}
// const excluirUsuario = async (id: number): Promise<string> => {
//   const token = getAuthToken();
//   if (!token) {
//     throw new Error('Usuário não autenticado.');
//   }

//   try {
//     const response = await api.delete<string>(`/gerenciador/${id}`);
//     return response.data;
//   } catch (error) {
//     if (error instanceof AxiosError && error.response?.status === 401) {
//       logout();
//       throw new Error('Sessão expirada. Por favor, faça login novamente.');
//     }

//     if (error instanceof AxiosError && error.response?.status === 404) {
//       throw new Error('Usuário não encontrado.');
//     }

//     if (error instanceof AxiosError && error.response?.data?.message) {
//       throw new Error(error.response.data.message);
//     }

//     throw new Error('Não foi possível excluir o usuário.');
//   }
// };

const usuarioService = {
  login,
  logout,
  getAuthToken,
  getProfile,
  getAllUsuarios,
  listarUsuariosAtivos,
  cadastrarGerenciador,
  // buscarUsuarioPorId,
  // atualizarUsuario,
  // excluirUsuario,
};

export default usuarioService;
