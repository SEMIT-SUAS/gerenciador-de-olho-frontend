import { useNavigate, useParams } from 'react-router-dom';
import { LayoutPage } from '../../../components/LayoutPage';
import { EditEspacoPublicoForm } from '@/pages/EspacosPublicosPage/components/EditEspacoPublicoForm';
import { useEffect, useState } from 'react';
import type { EspacoPublicoModel } from '@/types/EspacoPublico';
import { espacoPublicoService } from '@/services/espacoPublicoService';

export function EditEspacoPublicoPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [espacoPublico, setEspacoPublico] = useState<EspacoPublicoModel | null>(
    null,
  );

  const navigate = useNavigate();
  const espacoPublicoId = Number(useParams().id);

  useEffect(() => {
    espacoPublicoService
      .getById(espacoPublicoId)
      .then((data) => {
        setEspacoPublico(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return null;
  }

  if (!espacoPublico) {
    navigate('/404');
  }

  return (
    <LayoutPage additionalStyles="mx-auto p-10 space-y-6">
      <h1 className="text-3xl font-bold">Editar Espaço Público</h1>

      <EditEspacoPublicoForm
        onSuccess={() => navigate('/espacos-publicos')}
        espacoPublico={espacoPublico!}
      />
    </LayoutPage>
  );
}
