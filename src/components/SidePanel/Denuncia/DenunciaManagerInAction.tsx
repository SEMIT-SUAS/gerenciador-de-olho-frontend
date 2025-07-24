import { FaTrashAlt } from 'react-icons/fa';
import type { Denuncia } from '../../../types/Denuncia';
import { Tag } from '../Tag';
import { useNavigate } from 'react-router-dom';

type DenunciaManageInActionProps = {
  denuncia: Denuncia;
};

export function DenunciaManageInAction({
  denuncia,
}: DenunciaManageInActionProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(`/ocorrencias/denuncias/${denuncia.id}`, {
          replace: true,
        })
      }
      aria-label={`Ver detalhes da denúncia ${denuncia.tipo}`}
      className="group flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-left shadow-sm transition-all hover:shadow-md focus:outline-none cursor-pointer"
    >
      <div className="flex flex-col">
        <p className="font-semibold text-gray-800">{denuncia.tipo}</p>
        <p className="text-xs text-gray-500">
          {denuncia.endereco.rua}, {denuncia.endereco.bairro}
          </p>
      </div>

      <div className="flex items-center gap-3">
        {denuncia.status !== 'concluido' && (
          <button
            onClick={() => null}
            aria-label={`Desvincular denúncia ${denuncia.tipo}`}
            className="z-10 cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-600"
          >
            <FaTrashAlt />
          </button>
        )}
      </div>
    </div>
  );
}
