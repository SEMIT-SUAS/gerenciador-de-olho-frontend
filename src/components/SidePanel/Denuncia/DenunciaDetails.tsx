import { Tag } from './../Tag';
import { ImageModal } from '../../Modals/ImageModal';
import { useMemo, useState } from 'react';
import { useOcorrenciasContext } from '../../../context/OcorrenciasContext';
import { ConfirmModal } from '../../Modals/ConfirmModal';
import { FaTrashAlt } from 'react-icons/fa';
import { FilesCarrrousel } from '../../FilesCarrousel';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import type { Denuncia } from '../../../types/Denuncia';
import { toast } from 'react-toastify';
import { BackButton } from '../../Buttons/Backbutton';
import { Button } from '../../Buttons/Button';

export function DenunciaDetails() {
  const [imagemEmDestaque, setImagemEmDestaque] = useState<string | null>(null);
  const [isDesvincularModalOpen, setIsDesvincularModalOpen] = useState(false);
  const { denuncias, acoes, setDenuncias } = useOcorrenciasContext();
  const navigate = useNavigate();

  const params = useParams();
  const denunciaId = params.denunciaId;
  const denuncia = useMemo(() => {
    return denuncias.find((d) => d.id == Number(denunciaId));
  }, [denuncias]);



  if (!denuncia) {
    return Navigate({
      to: '/404',
      replace: true,
    });
  }

  const acaoVinculada = useMemo(() => {
    return acoes.find((a) => a.id == denuncia.acaoId);
  }, [denuncias]);



  async function handleConfirmDesvincularDenunciaAcao() {
    try {
      if (!denuncia) throw new Error('Denúncia não encontrada');

      setDenuncias((current) =>
        current.map((d) => {
          if (d.id === denuncia.id) {
            return {
              ...d,
              status: 'aberto',
            };
          }
          return d;
        }),
      );

      setIsDesvincularModalOpen(false);
      toast.success('Denúncia desvinculada com sucesso!');
    } catch (error) {
      toast.error('Erro ao desvincular denúncia.');
      console.error(error);
    }
  }

  function handleIndeferirDenuncia(reason: string) {
    try {
      if (!denuncia) throw new Error('Denúncia não encontrada');

      const updatedDenuncia: Denuncia = {
        ...denuncia,
        status: 'indeferido',
        motivoStatus: reason,
      };

      setDenuncias((current) =>
        current.map((d) => (d.id === denuncia.id ? updatedDenuncia : d)),
      );

      setShowIndeferirDenuncia(false);
      toast.success('Denúncia indeferida com sucesso!');
    } catch (error) {
      toast.error('Erro ao indeferir denúncia.');
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2 space-y-4">
        <BackButton to="/ocorrencias/denuncias" children='Detalhes da Denúncia' />

        <>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-yellow-700">
                {denuncia.categoria}
              </p>
              <h2 className="text-xl font-bold text-gray-800">
                {denuncia.tipo}
              </h2>
              <p className="text-sm text-gray-500">
                Registrado em:{' '}
                {new Date(denuncia.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <Tag status={denuncia.status} />
          </div>

          <div>
            <h3 className="font-semibold text-sm text-gray-800 mb-1">
              Descrição:
            </h3>
            <p className="text-sm text-gray-600">{denuncia.descricao}</p>
          </div>

          <div className="flex-col text-gray-700 border border-gray-200 p-4 rounded-2xl space-y-2">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Endereço:</h3>
              <p className="text-sm text-gray-600">
                {denuncia.endereco.rua}, {denuncia.endereco.bairro} (CEP:{' '}
                {denuncia.endereco.cep})
              </p>
              <p className="text-sm text-gray-600">
                {denuncia.endereco.ponto_referencia}
              </p>
            </div>
          </div>

          {acaoVinculada && (
            <div className="flex items-center px-4 py-3 justify-between bg-yellow-50 border border-yellow-200 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-yellow-700">
                  Ação Vinculada:
                </p>
                <p className="text-md font-bold text-yellow-900">
                  {acaoVinculada.nome}
                </p>
                <p className="text-xs font-semibold text-yellow-800">
                  {acaoVinculada.secretaria.name}
                </p>
              </div>
              <button
                onClick={() => setIsDesvincularModalOpen(true)}
                className="z-10 cursor-pointer rounded-full p-2 text-yellow-800 transition-colors hover:bg-red-100 hover:text-red-600"
                aria-label="Desvincular Ação"
              >
                <FaTrashAlt />
              </button>
            </div>
          )}

          {!acaoVinculada &&
            !['indeferido', 'concluido'].includes(denuncia.status) && (
              <div className="py-3 px-4 rounded-xl border border-gray-200 text-center space-y-2">
                <p className="text-sm font-semibold text-gray-800">
                  Nenhuma ação vinculada
                </p>
                <Button variant="outline_primary" size="sm" className='w-full'
                  onClick={() => navigate('vincular-acao')}
                >
                  Vincular a uma Ação
                </Button>
              </div>
            )}

          {denuncia.images.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Imagens:</h3>
              <div>
                <FilesCarrrousel
                  files={denuncia.images.map((file) => ({
                    id: file.id,
                    name: file.name,
                    type: file.name.includes('.mp4') ? 'video' : 'image',
                  }))}
                />
              </div>
            </div>
          )}

          {denuncia.status === 'indeferido' && denuncia.motivoStatus && (
            <div className="p-3 bg-red-50 border-l-4 border-red-400 text-red-700">
              <p className="font-bold">Motivo do Indeferimento:</p>
              <p>{denuncia.motivoStatus}</p>
            </div>
          )}

          {denuncia.status === 'aberto' && (
            <Button variant='outline_danger' size='sm'
              onClick={() => navigate('indeferir')}
              className="w-full">
              Indeferir Denúncia
            </Button>
          )}
        </>
      </div>

      <ImageModal
        imageUrl={imagemEmDestaque}
        onClose={() => setImagemEmDestaque(null)}
      />

      <ConfirmModal
        isOpen={isDesvincularModalOpen}
        title={'Confirmar Desvinculo'}
        message={`Deseja desvincular a denúncia "${denuncia.tipo}" da ação "${acaoVinculada?.nome}"?`}
        onCancel={() => setIsDesvincularModalOpen(false)}
        onConfirm={handleConfirmDesvincularDenunciaAcao}
      />
    </>
  );
}
