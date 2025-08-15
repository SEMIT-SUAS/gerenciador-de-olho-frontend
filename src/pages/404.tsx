import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">404</h1>
        <p className="mt-2 text-lg text-gray-600">Página não encontrada</p>
        <p className="mt-4 text-sm text-gray-500">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Button className="mt-5" onClick={() => navigate('/')}>
          Retorna para o início
        </Button>
      </div>
    </div>
  );
}
