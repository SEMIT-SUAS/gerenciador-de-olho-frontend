import type { EspacoPublicoModel } from '@/types/EspacoPublico';
import { Link } from 'react-router-dom';
import { ConfirmModal } from '../../../components/Modals/ConfirmModal';
import { useState } from 'react';
import { EspacoPublicoVisibility } from './EspacoPublicoVisibility';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { toast } from 'sonner';
import espaçoPublicoService from '@/services/espacoPublicoService';

interface EspacoPublicoItemProps {
  espacoPublico: EspacoPublicoModel;
  setEspacosPublicos: React.Dispatch<
    React.SetStateAction<EspacoPublicoModel[] | null>
  >;
}

export function EspacoPublicoItem({
  espacoPublico,
  setEspacosPublicos,
}: EspacoPublicoItemProps) {
  const [isOpenConfirmationDeleteModal, setIsOpenConfirmationDeleteModal] =
    useState(false);
  const firstImage = espacoPublico.arquivos[0];

  async function handleDeleteEspacoPublico() {
    try {
      await espaçoPublicoService.trash(espacoPublico.id);

      setEspacosPublicos(
        (prev) => prev?.filter((item) => item.id !== espacoPublico.id) ?? null,
      );

      toast.success('Espaço público excluído com sucesso!');
      setIsOpenConfirmationDeleteModal(false);
    } catch {
      toast.error('Erro ao excluir espaço público. Tente novamente.');
    }
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
        <img
          src={firstImage}
          alt={`Imagem de ${espacoPublico.nome}`}
          className="w-full h-48 object-cover"
        />

        <div className="p-4 flex-grow flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-gray-800">
              {espacoPublico.nome}
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-4 flex-grow">
            {espacoPublico.bairro}, {espacoPublico.cidade}
          </p>

          <div className="border-t border-gray-200 pt-3 mt-auto">
            <div className="flex justify-end items-center gap-3">
              <EspacoPublicoVisibility
                espacoPublico={espacoPublico}
                setEspacosPublicos={setEspacosPublicos}
              />

              <Link
                to={`/espacos-publicos/edit/${espacoPublico.id}`}
                title="Editar espaço"
                className="text-green-500 hover:text-green-700"
              >
                <IconPencil stroke={2} size={18} />
              </Link>

              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => setIsOpenConfirmationDeleteModal(true)}
              >
                <IconTrash stroke={2} size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isOpenConfirmationDeleteModal}
        title={`Excluir ${espacoPublico.nome}?`}
        message="Você tem certeza que deseja excluir este espaço público?"
        onConfirm={handleDeleteEspacoPublico}
        onCancel={() => setIsOpenConfirmationDeleteModal(false)}
      />
    </>
  );
}
