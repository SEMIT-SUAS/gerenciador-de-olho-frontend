import { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useOcorrencias } from '../../../context/OcorrenciasContext';
import { mensagensSugeridasParaIndeferirDenuncia } from '../../../constants/messagesRejectComplaint';
import { FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import { BackButton } from '../../Buttons/Backbutton';
import { ConfirmModal } from '../../Modals/ConfirmModal';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/Buttons/BaseButton';

export function IndeferirDenuncia() {
  const [isUpdatingDenuncia, setIsUpdatingDenuncia] = useState(false);
  const { denuncias, setDenuncias } = useOcorrencias();
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
    (!denuncia || !['Aberto', 'Andamento'].includes(denuncia.status)) &&
    !isUpdatingDenuncia
  ) {
    return <Navigate to="/404" replace />;
  }

  async function handleOnConfirmIndeferirDenuncia() {
    // try {
    //   setIsUpdatingDenuncia(true);
    //   const denunciaDataUpdated = await denunciasService.indeferirDenuncia(
    //     denuncia?.id!,
    //     motivo,
    //   );
    //   setDenuncias((denuncias) =>
    //     denuncias.map((d) => (d.id == denuncia?.id ? denunciaDataUpdated : d)),
    //   );
    //   toast.success('Denúncia indeferida com sucesso!');
    //   navigate(`/ocorrencias/denuncias/${denunciaId}`);
    // } catch (error: any) {
    //   toast.error(error.message);
    // }
  }

  return (
    <>
      <div className="flex flex-col gap-2 h-full space-y-7">
        <BackButton children="Indeferir Denúncia" />
        <div className="mb-6 p-4 bg-red-100 rounded-md">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 text-xl mr-3" />
            <div>
              <p className="text-sm font-semibold text-red-800">
                Você está indeferindo o item:
              </p>
              <p className="font-bold text-red-900 text-lg">
                {denuncia?.tipo.nome}
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
              <Textarea
                id="motivo-indeferimento"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows={6}
                maxLength={500}
                className="min-h-[200px]"
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
                  className="w-full 
                  cursor-pointer rounded-md border border-gray-300 px-3 py-1 
                  text-[13px] text-gray-800
                  transition-colors hover:border-gray-400 hover:bg-gray-100
                  focus:outline-none"
                >
                  {message}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button
          variant="danger"
          onClick={() => setIsOpenIndeferirDenunciaConfirmation(true)}
          disabled={!motivo.trim()}
        >
          <FaCheck className="mr-2" />
          Confirmar Indeferimento
        </Button>
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
