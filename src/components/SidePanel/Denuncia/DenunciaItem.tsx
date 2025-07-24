import { FaMapPin, FaTrash } from 'react-icons/fa';
import { Tag } from '../Tag';
import type { Denuncia } from '../../../types/Denuncia';
import { API_BASE_URL } from '@/config/api';
import { calcularDiasAtras } from '@/utils/datePicker';


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

const imagemPath = denuncia?.images[0]?.name;
const imageUrlCompleta = `${API_BASE_URL}/files/uploads/${imagemPath}`;
const diasAtras = calcularDiasAtras(denuncia.created_at);

return (
  <div
    key={denuncia.id}
    className="flex items-start gap-4 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50"
    onClick={onClick}>
      
    <img 
      className='w-21 h-21 rounded-md object-cover flex-shrink-0' 
      src={imageUrlCompleta} 
      alt="Primeira imagem da denúncia"
    />

    <div className="flex flex-col flex-grow py-3 pr-3">
      <div className='flex justify-between items-center'>
        <div>
          <p className="text-xs text-gray-500">
            {diasAtras}
          </p>
          <h3 className="font-semibold text-md text-gray-700 line-clamp-1">
            {denuncia.tipo}
          </h3>
        </div>

        {showTag && <Tag status={denuncia.status}/>}
      </div>
      <div className="flex justify-between items-center">
        {isDeletable && (
          <button
            onClick={onTrashClick}
            className="cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-600"
          >
            <FaTrash />
          </button>
        )}
      </div>


      <p className="flex items-center text-xs text-gray-400 mt-1">
        <span className="mr-1">
          <FaMapPin />
        </span>
        <span className="line-clamp-1">
          {`${denuncia.endereco.rua}, ${denuncia.endereco.bairro}`}
        </span>
      </p>
    </div>
  </div>
  );
}
