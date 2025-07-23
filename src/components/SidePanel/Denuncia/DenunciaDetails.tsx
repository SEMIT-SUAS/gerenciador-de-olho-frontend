import { Tag } from './../Tag';
import { ImageModal } from '../../Modals/ImageModal';
import { useEffect, useMemo, useState } from 'react';
import { useOcorrencias } from '../../../context/OcorrenciasContext';
import { ConfirmModal } from '../../Modals/ConfirmModal';
import { FaTrashAlt } from 'react-icons/fa';
import { FilesCarrrousel } from '../../FilesCarrousel';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BackButton } from '../../Buttons/Backbutton';
import { useMapActions } from '../../../context/MapActions';

export function DenunciaDetails() {
  const [imagemEmDestaque, setImagemEmDestaque] = useState<string | null>(null);
  const [isDesvincularModalOpen, setIsDesvincularModalOpen] = useState(false);
  const { denuncias, acoes, setDenuncias } = useOcorrencias();
  const { setZoomTo } = useMapActions();
  const navigate = useNavigate();

  const params = useParams();
  const denunciaId = params.denunciaId;
  const denuncia = useMemo(() => {
    return denuncias.find((d) => d.id == Number(denunciaId));
  }, [denuncias, denunciaId]);

  if (!denuncia) {
    return Navigate({
      to: '/404',
      replace: true,
    });
  }

  const acaoVinculada = useMemo(() => {
    return acoes.find((a) => a.id == denuncia.acao?.id);
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
    }
  }

  useEffect(() => {
    setZoomTo({
      lat: denuncia.latitude,
      lng: denuncia.longitude,
    });

    return () => setZoomTo(null);
  }, [denuncia, denunciaId]);

  return (
    <>
      <div className="flex flex-col gap-2 space-y-4">
        <BackButton fallback="/ocorrencias/denuncias" />

        <>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-yellow-700">
                {denuncia.tipo.categoria?.nome}
              </p>
              <h2 className="text-xl font-bold text-gray-800">
                {denuncia.tipo.nome}
              </h2>
              <p className="text-sm text-gray-500">
                Registrado em:{' '}
                {new Date(denuncia.criadaEm).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <Tag status={'indeferido'} />
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
                {denuncia.rua}, {denuncia.bairro}
              </p>
              <p className="text-sm text-gray-600">
                {denuncia.pontoDeReferencia}
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
                  {acaoVinculada.secretaria.nome}
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
            !['indeferido', 'concluido'].includes('indeferido') && (
              <div className="py-3 px-4 rounded-xl border border-gray-200 text-center space-y-2">
                <p className="text-sm font-semibold text-gray-800">
                  Nenhuma ação vinculada
                </p>
                <button
                  onClick={() => navigate('vincular-acao')}
                  className="w-full bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Vincular a uma Ação
                </button>
              </div>
            )}

          {denuncia.files.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Imagens:</h3>
              <div>
                <FilesCarrrousel files={denuncia.files} />
              </div>
            </div>
          )}

          {/* {denuncia.status === 'indeferido' && denuncia.motivoStatus && (
            <div className="p-3 bg-red-50 border-l-4 border-red-400 text-red-700">
              <p className="font-bold">Motivo do Indeferimento:</p>
              <p>{denuncia.motivoStatus}</p>
            </div>
          )} */}

          {/* {denuncia.status === 'aberto' && (
            <button
              onClick={() => navigate('indeferir')}
              className="w-full border-2 text-sm border-red-500 text-red-500 font-semibold py-2 rounded-lg transition-colors hover:bg-red-500 hover:text-white"
            >
              Indeferir Denúncia
            </button>
          )} */}
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
