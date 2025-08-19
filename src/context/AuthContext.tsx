import {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from 'react';
import usuarioService from '@/services/usuariosService';
import type { LoginFormValues } from '@/pages/LoginPage/components/loginSchema';
import { type UsuarioLogin } from '@/types/Usuario';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UsuarioLogin | null;
  isLoading: boolean;
  login: (credentials: LoginFormValues) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UsuarioLogin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedToken = usuarioService.getAuthToken();
      if (storedToken) {
        try {
          const userData = await usuarioService.getProfile();
          setUser(userData);
          setToken(storedToken);
        } catch (error) {
          console.error(error);
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: LoginFormValues) => {
    const { token } = await usuarioService.login(credentials);
    setToken(token);

    const userData = await usuarioService.getProfile(credentials.login);
    setUser(userData);
    console.log(userData);
  };

  const logout = () => {
    usuarioService.logout();
    setUser(null);
    setToken(null);
  };

  const value = {
    isAuthenticated: !!token,
    user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
