import { useNavigate } from 'react-router-dom';
import { LayoutPage } from '../../../components/LayoutPage';
import { AddEspacoPublicoForm } from '@/pages/EspacosPublicosPage/components/AddEspacoPublicoForm';

export function AddEspacoPublicoPage() {
  const navigate = useNavigate();

  return (
    <LayoutPage>
      <div className='className="max-w-4xl mx-auto p-6"'>
        <h1 className="flex justify-center text-3xl font-bold my-5">
          Cadastrar Espaço Público
        </h1>
        <p></p>

        <AddEspacoPublicoForm onSuccess={() => navigate('/espacos-publicos')} />
      </div>
    </LayoutPage>
  );
}
