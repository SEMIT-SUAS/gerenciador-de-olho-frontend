import { useState, type Dispatch, type SetStateAction } from 'react';
import { toast } from 'sonner';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  IconEdit,
  IconEye,
  IconEyeOff,
  IconTrash,
  IconCheck,
} from '@tabler/icons-react';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';
import type { ServicoExterno } from '@/types/ServicoExterno';

import {
  changeServiceExternoAtivo,
  changeServiceVisibility,
} from '@/services/servicosExternosService';

import { FormServicoExterno } from './ServicosExternosForm/ServicoExternoForm';

interface ServiceListItemProps {
  servico: ServicoExterno;
  setServicos: Dispatch<SetStateAction<ServicoExterno[] | null>>;
}

export function ServicesExternoListItem({
  servico,
  setServicos,
}: ServiceListItemProps) {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenVisibleModal, setIsOpenVisibleModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleToggleAtivo() {
    setIsProcessing(true);
    try {
      const novoStatus = !servico.ativo;
      await changeServiceExternoAtivo(servico.id, novoStatus);

      setServicos((prev) => {
        if (!prev) return prev;

        return prev.map((s) =>
          s.id === servico.id ? { ...s, ativo: novoStatus } : s,
        );
      });

      toast.success(
        novoStatus
          ? 'Serviço ativado com sucesso!'
          : 'Serviço desativado com sucesso!',
      );
    } catch (error: any) {
      console.error('Erro ao alterar status do serviço:', error);
      toast.error('Erro ao alterar status do serviço');
    } finally {
      setIsProcessing(false);
      setIsOpenDeleteModal(false);
    }
  }

  async function handleToggleVisibility() {
    setIsProcessing(true);
    try {
      const novaVisibilidade = !servico.visivel;

      await changeServiceVisibility(servico.id, novaVisibilidade);

      setServicos((prev) => {
        if (!prev) return prev;

        return prev.map((s) =>
          s.id === servico.id ? { ...s, visivel: novaVisibilidade } : s,
        );
      });

      toast.success(
        novaVisibilidade
          ? 'Serviço agora está visível no aplicativo!'
          : 'Serviço foi ocultado do aplicativo!',
      );
    } catch (error: any) {
      console.error('Erro ao alterar visibilidade:', error);
      toast.error('Erro ao alterar visibilidade do serviço');
    } finally {
      setIsProcessing(false);
      setIsOpenVisibleModal(false);
    }
  }

  const handleEditSuccess = (servicoAtualizado?: ServicoExterno) => {
    if (servicoAtualizado) {
      setServicos((prev) => {
        if (!prev) return prev;

        return prev.map((s) => (s.id === servico.id ? servicoAtualizado : s));
      });
    }
    setIsEditModalOpen(false);
  };

  return (
    <>
      <TableRow className={`${!servico.ativo ? 'opacity-60' : ''}`}>
        <TableCell>
          <div className="relative">
            {servico.imagem ? (
              <img
                src={servico.imagem}
                alt={servico.nome}
                className="h-14 w-auto rounded-md object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://via.placeholder.com/56?text=Erro';
                }}
              />
            ) : (
              <div className="h-14 w-14 rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                Sem imagem
              </div>
            )}
            {!servico.visivel && (
              <div className="absolute -top-1 -right-1">
                <IconEyeOff
                  size={16}
                  className="text-gray-500 bg-white rounded-full p-0.5"
                />
              </div>
            )}
          </div>
        </TableCell>

        <TableCell>
          <div className="flex flex-col">
            <span className="font-medium">{servico.nome}</span>
            <div className="flex gap-2 mt-1">
              {!servico.ativo && (
                <span className="text-xs bg-red-100 text-black px-2 py-0.5 rounded">
                  Inativo
                </span>
              )}
              {!servico.visivel && (
                <span className="text-xs bg-gray-100 text-black px-2 py-0.5 rounded">
                  Oculto
                </span>
              )}
            </div>
          </div>
        </TableCell>

        <TableCell>
          {servico.link ? (
            <a
              href={servico.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black underline text-sm"
            >
              {servico.link.length > 30
                ? `${servico.link.substring(0, 30)}...`
                : servico.link}
            </a>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </TableCell>

        <TableCell>
          <div className="flex gap-2">
            <button
              className="p-1.5 text-black hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
              onClick={() => setIsEditModalOpen(true)}
              disabled={isProcessing}
              title="Editar serviço"
            >
              <IconEdit size={18} stroke={2} />
            </button>

            <button
              onClick={() => setIsOpenDeleteModal(true)}
              className={`p-1.5 rounded transition-colors disabled:opacity-50 ${
                servico.ativo
                  ? 'text-black hover:bg-red-50'
                  : 'text-black hover:bg-green-50'
              }`}
              disabled={isProcessing}
              title={servico.ativo ? 'Desativar serviço' : 'Ativar serviço'}
            >
              {servico.ativo ? (
                <IconTrash size={18} stroke={2} />
              ) : (
                <IconCheck size={18} stroke={2} />
              )}
            </button>

            <button
              className="p-1.5 text-black hover:bg-gray-50 rounded transition-colors disabled:opacity-50"
              onClick={() => setIsOpenVisibleModal(true)}
              disabled={isProcessing}
              title={
                servico.visivel
                  ? 'Ocultar do aplicativo'
                  : 'Mostrar no aplicativo'
              }
            >
              {servico.visivel ? (
                <IconEye stroke={2} size={18} />
              ) : (
                <IconEyeOff stroke={2} size={18} />
              )}
            </button>
          </div>
        </TableCell>
      </TableRow>

      {isEditModalOpen && (
        <FormServicoExterno
          mode="edit"
          defaultValues={servico}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      <ConfirmModal
        isOpen={isOpenDeleteModal}
        onConfirm={handleToggleAtivo}
        onCancel={() => setIsOpenDeleteModal(false)}
        title={servico.ativo ? 'Desativar serviço?' : 'Ativar serviço?'}
        message={
          servico.ativo
            ? 'Tem certeza que deseja desativar este serviço? Ele não aparecerá mais na listagem, mas poderá ser reativado posteriormente.'
            : 'Tem certeza que deseja ativar este serviço? Ele voltará a aparecer na listagem.'
        }
      />

      <ConfirmModal
        isOpen={isOpenVisibleModal}
        onConfirm={handleToggleVisibility}
        onCancel={() => setIsOpenVisibleModal(false)}
        title="Alterar visibilidade do serviço?"
        message={
          servico.visivel
            ? 'Tem certeza que deseja ocultar este serviço? Ele não ficará visível para os usuários no aplicativo.'
            : 'Tem certeza que deseja tornar este serviço visível? Ele aparecerá para os usuários no aplicativo.'
        }
      />
    </>
  );
}
