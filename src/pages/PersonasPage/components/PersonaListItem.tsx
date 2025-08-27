import { useState, type Dispatch, type SetStateAction } from 'react';
import { toast } from 'react-toastify';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';
import type { Persona } from '@/types/Persona';
import { personaService } from '@/services/personaService';
import { PersonaVisibility } from './PersonaVisibility';

interface PersonaListItemProps {
  persona: Persona;
  setPersonas: Dispatch<SetStateAction<Persona[]>>;
  onEdit?: (persona: Persona) => void;
}

export function PersonaListItem({
  persona,
  setPersonas,
  onEdit,
}: PersonaListItemProps) {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  async function handleDeletePersona() {
    try {
      await personaService.toggleAtivo(persona.id, false);

      setPersonas((prev) =>
        prev.map((p) => (p.id === persona.id ? { ...p, ativo: false } : p)),
      );

      toast.success('Persona desativada com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao desativar persona');
    }

    setIsOpenDeleteModal(false);
  }

  return (
    <>
      <TableRow key={persona.id}>
        {/* Ícone */}
        <TableCell>
          <div className="flex items-center">
            <img
              src={persona.icone}
              alt={persona.nome}
              className="h-10 w-auto rounded-md object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/40?text=?';
              }}
            />
          </div>
        </TableCell>

        {/* Nome */}
        <TableCell>
          <div className="flex flex-col">
            <span className="font-medium">{persona.nome}</span>
            <div className="flex gap-2 mt-1"></div>
          </div>
        </TableCell>

        {/* Ações */}
        <TableCell>
          <div className="flex items-center gap-2">
            {/* Botão Editar */}
            <button
              className="text-black-600 hover:text-black transition-colors"
              onClick={() => onEdit?.(persona)}
              title="Editar persona"
            >
              <IconEdit size={18} stroke={2} />
            </button>

            {/* Botão Excluir */}
            <button
              onClick={() => setIsOpenDeleteModal(true)}
              className="text-black-600 hover:text-black transition-colors"
              title="Desativar persona"
            >
              <IconTrash size={18} stroke={2} />
            </button>

            {/* Toggle Visibilidade */}
            <PersonaVisibility persona={persona} setPersonas={setPersonas} />
          </div>
        </TableCell>
      </TableRow>

      {/* Modal de Confirmação */}
      <ConfirmModal
        isOpen={isOpenDeleteModal}
        onConfirm={handleDeletePersona}
        onCancel={() => setIsOpenDeleteModal(false)}
        title="Você deseja desativar a persona?"
        message={`Tem certeza de que quer desativar a persona "${persona.nome}"? Ela ficará inativa no sistema.`}
      />
    </>
  );
}
