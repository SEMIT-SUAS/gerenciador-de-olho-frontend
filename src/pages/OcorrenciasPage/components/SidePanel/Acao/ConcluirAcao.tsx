import { BackButton } from '@/components/ui/Backbutton';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';
import { Textarea } from '@/components/ui/textarea';
import { mensagensSugeridasParaConcluirAcao } from '@/constants/MensagensConcluirAcao';
import { useAuth } from '@/context/AuthContext';
import AcoesService from '@/services/acoesService'; // Importar o serviço
import type { AcaoModel } from '@/types/Acao';
import { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ConcluirAcaoModalProps {
  acao: AcaoModel;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (acaoAtualizada: AcaoModel) => void;
}

export function ConcluirAcaoModal({
  acao,
  isOpen,
  onClose,
  onSuccess,
}: ConcluirAcaoModalProps) {
  const [isConcluindoAcao, setIsConcluindoAcao] = useState(false);
  const [motivo, setMotivo] = useState('');
  const { user } = useAuth();

  const handleConfirmarConclusao = async () => {
    if (!acao || !user || !motivo.trim()) return;

    try {
      setIsConcluindoAcao(true);

      const payload = {
        id: acao.id,
        acaoStatus: {
          status: 'Concluída',
          motivo: motivo,
          gerenciador: user.id,
        },
        ativo: true,
      };

      const acaoAtualizada = await AcoesService.updateAcao(payload);

      onSuccess(acaoAtualizada);

      toast.success('Ação concluída com sucesso!');
      onClose(); // Fecha o modal
    } catch (error: any) {
      toast.error(error.message || 'Falha ao concluir a ação.');
    } finally {
      setIsConcluindoAcao(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Concluir Ação</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="p-4 bg-green-100 rounded-md">
            <div className="flex items-center">
              <FaCheck className="text-green-600 text-xl mr-3" />
              <div>
                <p className="text-sm font-semibold text-green-800">
                  Você está concluindo a ação:
                </p>
                <p className="font-bold text-green-900 text-lg">{acao.nome}</p>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="relatorio-conclusao"
              className="block font-semibold text-slate-800 mb-2"
            >
              Relatório de Conclusão
            </label>
            <Textarea
              id="relatorio-conclusao"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={5}
              maxLength={500}
              placeholder="Descreva o que foi feito para concluir esta ação..."
            />
          </div>

          <div>
            <h4 className="text-slate-800 font-semibold mb-3">
              Ou selecione um relatório rápido
            </h4>
            <div className="flex flex-wrap gap-2">
              {mensagensSugeridasParaConcluirAcao.map((message) => (
                <button
                  key={message}
                  onClick={() => setMotivo(message)}
                  className="cursor-pointer rounded-md border border-gray-300 px-3 py-1 text-[13px] text-gray-500 transition-colors hover:border-gray-400 hover:bg-gray-100 focus:outline-none"
                >
                  {message}
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            onClick={handleConfirmarConclusao}
            disabled={!motivo.trim() || isConcluindoAcao}
          >
            <FaCheck className="mr-2 h-4 w-4" />
            {isConcluindoAcao ? 'Concluindo...' : 'Confirmar Conclusão'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
