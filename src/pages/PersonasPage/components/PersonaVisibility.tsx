import { useState, type Dispatch, type SetStateAction } from 'react';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { toast } from 'sonner';
import { personaService } from '@/services/personaService';
import type { Persona } from '@/types/Persona';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';

interface PersonaVisibilityProps {
  persona: Persona;
  setPersonas: Dispatch<SetStateAction<Persona[] | null>>;
}

export function PersonaVisibility({
  persona,
  setPersonas,
}: PersonaVisibilityProps) {
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);

  async function handleOnClickButton() {
    try {
      await personaService.toggleVisibility(persona.id, !persona.visivel);

      setPersonas((prev) => {
        if (!prev) return prev;

        return prev.map((p) =>
          p.id === persona.id ? { ...p, visivel: !p.visivel } : p,
        );
      });

      toast.success(
        `Persona "${persona.nome}" ${!persona.visivel ? 'visível' : 'oculta'}!`,
      );
    } catch (error: any) {
      toast.error('Erro ao alterar visibilidade da persona');
    }

    setIsOpenConfirmModal(false);
  }

  return (
    <>
      <button
        className="text-black-500"
        onClick={() => setIsOpenConfirmModal(true)}
      >
        {persona.visivel ? (
          <IconEye stroke={2} size={18} />
        ) : (
          <IconEyeOff stroke={2} size={18} />
        )}
      </button>
      <ConfirmModal
        isOpen={isOpenConfirmModal}
        onConfirm={handleOnClickButton}
        onCancel={() => setIsOpenConfirmModal(false)}
        title={
          persona.visivel
            ? 'Você deseja ocultar a persona?'
            : 'Você deseja tornar a persona visível?'
        }
        message={
          persona.visivel
            ? 'Ao confirmar, a persona ficará oculta para os usuários.'
            : 'Ao confirmar, a persona ficará visível para os usuários.'
        }
      />
    </>
  );
}
