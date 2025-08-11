import { useNavigate } from 'react-router-dom';
import { LayoutPage } from '../LayoutPage';
import { AddEspacoPublicoForm } from '@/components/EspacosPublicos/Forms/AddEspacoPublicoForm';

export function AddEspacoPublicoPage() {
  const navigate = useNavigate();

  return (
    <LayoutPage additionalStyles="mx-auto p-10 space-y-6">
      <h1 className="text-3xl font-bold">Cadastrar Espaço Público</h1>

      <AddEspacoPublicoForm onSuccess={() => navigate('/espacos-publicos')} />
    </LayoutPage>
  );
}
