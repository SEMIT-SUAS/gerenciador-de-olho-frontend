import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import AcoesService from '@/services/acoesService';
import type { AcaoModel } from '@/types/Acao';
import { IconProgressX } from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';

// Sugestão: Mover esta constante para um arquivo de constantes, como 'src/constants/...'
const mensagensSugeridasParaIndeferirAcao = [
  'Ação inviável no momento por falta de recursos.',
  'A denúncia associada não procede após verificação.',
  'Fora da área de competência desta secretaria.',
  'Ação duplicada, já existe um chamado para este problema.',
];

interface IndeferirAcaoModalProps {
  acao: AcaoModel;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (acaoAtualizada: AcaoModel) => void;
}

export function IndeferirAcaoModal({
  acao,
  isOpen,
  onClose,
  onSuccess,
}: IndeferirAcaoModalProps) {
  const [isIndeferindo, setIsIndeferindo] = useState(false);
  const [motivo, setMotivo] = useState('');
  const { user } = useAuth();

  const handleConfirmarIndeferimento = async () => {
    if (!acao || !user || !motivo.trim()) {
      toast.warning('O motivo do indeferimento é obrigatório.');
      return;
    }

    try {
      setIsIndeferindo(true);

      const payload = {
        id: acao.id,
        acaoStatus: {
          id: acao.acaoStatus.id,
          status: 'Indeferido',
          motivo: motivo.trim(),
        },
        ativo: true,
      };

      const acaoAtualizada = await AcoesService.updateAcao(payload);

      onSuccess(acaoAtualizada);

      toast.success('Ação indeferida com sucesso!');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Falha ao indeferir a ação.');
    } finally {
      setIsIndeferindo(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Indeferir Ação</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="p-4 bg-red-100 rounded-md border border-red-200">
            <div className="flex items-center">
              <IconProgressX className="text-red-600 text-xl mr-3" />
              <div>
                <p className="text-sm font-semibold text-red-800">
                  Você está indeferindo a ação:
                </p>
                <p className="font-bold text-red-900 text-lg">{acao.nome}</p>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="relatorio-indeferimento"
              className="block font-semibold text-slate-800 mb-2"
            >
              Motivo do Indeferimento (Obrigatório)
            </label>
            <Textarea
              id="relatorio-indeferimento"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={5}
              maxLength={500}
              placeholder="Descreva o motivo pelo qual esta ação está sendo indeferida..."
            />
          </div>

          {/* SEÇÃO DE MENSAGENS RÁPIDAS ADICIONADA */}
          <div>
            <h4 className="text-slate-800 font-semibold mb-3">
              Ou selecione uma mensagem rápida
            </h4>
            <div className="flex flex-wrap gap-2">
              {mensagensSugeridasParaIndeferirAcao.map((message) => (
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
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleConfirmarIndeferimento}
            disabled={!motivo.trim() || isIndeferindo}
          >
            <IconProgressX className="mr-2 h-4 w-4" />
            {isIndeferindo ? 'Indeferindo...' : 'Confirmar Indeferimento'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
