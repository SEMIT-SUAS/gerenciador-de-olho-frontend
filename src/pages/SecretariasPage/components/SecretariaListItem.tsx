import { TableRow, TableCell } from '@/components/ui/table';
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';
import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import type { Secretaria } from '@/types/Secretaria'; // ajuste para o caminho correto
import type { Dispatch, SetStateAction } from 'react';
import secretariasService from '@/services/secretariaService'; // você precisa ter isso

interface SecretariaListItemProps {
  secretaria: Secretaria;
  setSecretarias: Dispatch<SetStateAction<Secretaria[]>>;
}

export function SecretariaListItem({
  secretaria,
  setSecretarias,
}: SecretariaListItemProps) {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  // const navigate = useNavigate();

  async function handleDeleteSecretaria() {
    try {
      // Aqui você pode ajustar a lógica: deletar, desativar ou ocultar
      await secretariasService.deleteSecretaria(secretaria.id); // ou desativar()

      setSecretarias((prev) => prev.filter((s) => s.id !== secretaria.id));
    } catch (error) {
      console.error('Erro ao desativar a secretaria:', error);
    }

    setIsOpenDeleteModal(false);
  }

  return (
    <>
      <TableRow>
        <TableCell>{secretaria.nome}</TableCell>
        <TableCell>{secretaria.sigla}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <button
              aria-label={`Editar ${secretaria.nome}`}
              // onClick={() => navigate(`/secretarias/editar/${secretaria.id}`)}
            >
              <IconEdit size={18} stroke={2} className="text-black-600 mr-2" />
            </button>

            <button
              aria-label={`Visualizar ${secretaria.nome}`}
              // onClick={() =>
              //   navigate(`/secretarias/visualizar/${secretaria.id}`)
              // }
            >
              <IconEye size={18} stroke={2} className="text-black-600 mr-2" />
            </button>

            <button
              aria-label={`Deletar ${secretaria.nome}`}
              onClick={() => setIsOpenDeleteModal(true)}
            >
              <IconTrash size={18} stroke={2} className="text-black-600 mr-2" />
            </button>
          </div>
        </TableCell>
      </TableRow>

      <ConfirmModal
        isOpen={isOpenDeleteModal}
        onConfirm={handleDeleteSecretaria}
        onCancel={() => setIsOpenDeleteModal(false)}
        title={`Deseja apagar a secretaria "${secretaria.nome}"?`}
        message="Ao confirmar, todos os dados dessa secretaria serão removidos permanentemente."
      />
    </>
  );
}
