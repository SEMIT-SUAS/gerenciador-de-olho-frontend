import { useState, type Dispatch, type SetStateAction } from 'react';
import { toast } from 'sonner';
import { TableCell, TableRow } from '@/components/ui/table';
import { IconEdit, IconGripVertical, IconTrash } from '@tabler/icons-react';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';
import type { Persona } from '@/types/Persona';
import { personaService } from '@/services/personaService';

import { PersonaVisibility } from './PersonaVisibility';
import { Draggable } from '@hello-pangea/dnd';

interface PersonaListItemProps {
  persona: Persona;
  setPersonas: Dispatch<SetStateAction<Persona[] | null>>;
  onEdit?: (persona: Persona) => void;
  index: number;
}

export function PersonaListItem({
  persona,
  setPersonas,
  onEdit,
  index,
}: PersonaListItemProps) {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  async function handleDeletePersona() {
    try {
      await personaService.toggleAtivo(persona.id, false);

      setPersonas((prev) => {
        if (!prev) return prev;

        return prev.map((p) =>
          p.id === persona.id ? { ...p, ativo: false } : p,
        );
      });

      toast.success('Persona desativada com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao desativar persona');
    }

    setIsOpenDeleteModal(false);
  }

  return (
    <>
      <Draggable draggableId={String(persona.id)} index={index}>
        {(provided) => (
          <TableRow
            key={persona.id}
            ref={provided.innerRef}
            {...provided.draggableProps}
            className="bg-white"
          >
            <TableCell>
              <button
                {...provided.dragHandleProps}
                className="size-7 hover:bg-gray-300 items-center justify-center flex rounded-md"
              >
                <IconGripVertical className="text-muted-foreground size-4" />
              </button>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <img
                  src={persona.icone}
                  alt={persona.nome}
                  className="h-10 w-auto rounded-md object-cover"
                  // onError={(e) => {
                  //   e.currentTarget.src = 'https://via.placeholder.com/40?text=?';
                  // }}
                />
              </div>
            </TableCell>

            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium">{persona.nome}</span>
                <div className="flex gap-2 mt-1"></div>
              </div>
            </TableCell>

            <TableCell>
              <div className="flex items-center gap-2">
                <button
                  disabled
                  className="text-gray-600 hover:text-black transition-colors"
                  onClick={() => onEdit?.(persona)}
                  title="Editar persona"
                >
                  <IconEdit size={18} stroke={2} />
                </button>

                <button
                  onClick={() => setIsOpenDeleteModal(true)}
                  className="text-black-600 hover:text-black transition-colors"
                  title="Desativar persona"
                >
                  <IconTrash size={18} stroke={2} />
                </button>

                <PersonaVisibility
                  persona={persona}
                  setPersonas={setPersonas}
                />
              </div>
            </TableCell>
          </TableRow>
        )}
      </Draggable>

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
