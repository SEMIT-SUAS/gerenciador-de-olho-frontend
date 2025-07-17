import { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useOcorrenciasContext } from '../../../context/OcorrenciasContext';
import { mensagensSugeridasParaIndeferirDenuncia } from '../../../constants/messagesRejectComplaint';
import { FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import { BackButton } from '../../Buttons/Backbutton';
import { ConfirmModal } from '../../Modals/ConfirmModal';
import { toast } from 'react-toastify';

export function IndeferirDenuncia() {
  const [isUpdatingDenuncia, setIsUpdatingDenuncia] = useState(false);
  const { denuncias, setDenuncias } = useOcorrenciasContext();
  const [motivo, setMotivo] = useState('');
  const [
    isOpenIndeferirDenunciaConfirmation,
    setIsOpenIndeferirDenunciaConfirmation,
  ] = useState(false);

  const params = useParams();
  const denunciaId = params.denunciaId;
  const navigate = useNavigate();

  const denuncia = useMemo(() => {
    return denuncias.find((d) => d.id == Number(denunciaId));
  }, [denuncias]);

  if (
    (!denuncia || !['aberto', 'em_andamento'].includes(denuncia.status)) &&
    !isUpdatingDenuncia
  ) {
    return <Navigate to="/404" replace />;
  }

  async function handleOnConfirmIndeferirDenuncia() {
    setIsUpdatingDenuncia(true);

    const denunciaDataUpdated = {
      ...denuncia!,
      status: 'indeferido',
      motivoStatus: motivo,
    };

    // //TODO: CALL API

    await navigate(`/ocorrencias/denuncias/${denunciaId}`, {
      replace: true,
    });

    setDenuncias((denuncias) =>
      denuncias.map((d) => (d.id == denuncia?.id ? denunciaDataUpdated : d)),
    );
    toast.success('Denúncia indeferida com sucesso!');
  }

  return (
    <>
      <div className="flex flex-col gap-2 h-full p-4 bg-white">
        <BackButton />
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 text-xl mr-3" />
            <div>
              <p className="text-sm font-semibold text-red-800">
                Você está indeferindo o item:
              </p>
              <p className="font-bold text-red-900 text-lg">
                {denuncia?.titulo}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col space-y-6 overflow-y-auto pr-2">
          <div>
            <label
              htmlFor="motivo-indeferimento"
              className="block font-semibold text-slate-800 mb-2"
            >
              Motivo do Indeferimento
            </label>
            <div className="relative">
              <textarea
                id="motivo-indeferimento"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows={6}
                maxLength={500}
                className="w-full resize-none border-slate-300 rounded-md shadow-sm p-3 text-slate-700 text-sm
                         focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                placeholder="Descreva claramente o motivo para o indeferimento..."
              />
              <span className="absolute bottom-2 right-3 text-xs text-slate-400">
                {motivo.length} / 500
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-slate-800 font-semibold mb-3">
              Ou selecione uma mensagem rápida
            </h4>
            <div className="flex flex-wrap gap-2">
              {mensagensSugeridasParaIndeferirDenuncia.map((message) => (
                <button
                  key={message}
                  onClick={() => setMotivo(message)}
                  className="px-4 py-2 text-xs text-start border border-slate-300 rounded-full text-slate-700 
                           font-medium hover:bg-red-50 hover:border-red-400 hover:text-red-700 
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                >
                  {message}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsOpenIndeferirDenunciaConfirmation(true)}
          disabled={!motivo.trim()}
          className="flex items-center justify-center w-full max-w-xs bg-red-600 text-white font-bold py-3 rounded-lg transition-colors
                         hover:bg-red-700
                         disabled:bg-red-300 disabled:cursor-not-allowed"
        >
          <FaCheck className="mr-2" />
          Confirmar Indeferimento
        </button>
      </div>

      <ConfirmModal
        isOpen={isOpenIndeferirDenunciaConfirmation}
        title="Indeferir denúncia"
        message="Você realmente quer indeferir essa denúncia? Ação irreversível"
        onCancel={() => setIsOpenIndeferirDenunciaConfirmation(false)}
        onConfirm={() => handleOnConfirmIndeferirDenuncia()}
      />
    </>
  );
}
