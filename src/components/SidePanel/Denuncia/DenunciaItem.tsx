import { FaMapPin, FaTrash } from 'react-icons/fa';
import { Tag } from '../Tag';
import type { Denuncia } from '../../../types/Denuncia';

type DenunciaItemProps = {
  denuncia: Denuncia;
  onClick: () => void;
  onTrashClick?: () => void;
  showDescription: boolean;
  isDeletable: boolean;
  showTag: boolean;
};

export function DenunciaItem({
  denuncia,
  onClick,
  showTag,
  showDescription,
  isDeletable,
  onTrashClick,
}: DenunciaItemProps) {
  return (
    <div
      key={denuncia.id}
      className="p-3 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50"
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-md text-gray-700">
          {denuncia.tipo.name}
        </h3>
        {showTag && <Tag status={denuncia.status} />}
        {isDeletable && (
          <button
            onClick={onTrashClick}
            className="cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-600"
          >
            <FaTrash />
          </button>
        )}
      </div>

      {showDescription && (
        <p className="text-sm text-gray-500 mt-1">{denuncia.descricao}</p>
      )}

      <p className="flex text-xs text-gray-400 mt-1">
        <span className="mr-1">
          <FaMapPin />
        </span>
        {`${denuncia.endereco.rua}, ${denuncia.endereco.bairro}`}
      </p>
    </div>
  );
}
