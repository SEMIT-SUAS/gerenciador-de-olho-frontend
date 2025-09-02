import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
}

export function PrivateRoute({ children, allowedRoles }: Props) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.perfil)) {
    return <Navigate to={'/login'} replace />;
  }

  return <>{children}</>;
}
