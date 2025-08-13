import { FaMapPin, FaTrash } from 'react-icons/fa';
import { Tag } from '../Tag';
import type { DenunciaBasicInfoModel } from '@/types/Denuncia';
import { Loading } from '@/components/Loading/Loading';
import { useEffect, useState } from 'react';
import { calcularDiasAtras } from '@/utils/data';
import { VIDEO_EXTENSIONS } from '@/constants/videoExtensions';
import { ArquivoService } from '@/services/arquivoService';
import { generateThumbnailURL } from '@/utils/video';

type DenunciaItemProps = {
  denuncia: DenunciaBasicInfoModel;
  onClick: () => void;
  showDate: boolean;
  onTrashClick?: () => void;
  isDeletable: boolean;
  showTag: boolean;
  isSelected?: boolean;
};

export function DenunciaItem({
  denuncia,
  onClick,
  showDate,
  showTag,
  isDeletable,
  onTrashClick,
  isSelected,
}: DenunciaItemProps) {
  const [thumbnailURL, setThumbnailURL] = useState<string | null>(null);
  const fileType = denuncia.primeiroArquivo.split('.').pop();
  const isVideo = fileType && VIDEO_EXTENSIONS.has(fileType);

  useEffect(() => {
    if (isVideo) {
      ArquivoService.getFileBlobByURL(denuncia.primeiroArquivo).then((blob) => {
        generateThumbnailURL(blob).then((URLGenerated) => {
          setThumbnailURL(URLGenerated);
        });
      });
    }

    setThumbnailURL(denuncia.primeiroArquivo);
  }, []);

  const criadaHa = calcularDiasAtras(denuncia.criadaEm);

  return (
    <div
      key={denuncia.id}
      className={`flex items-start gap-4 rounded-lg shadow-sm cursor-pointer ${
        isSelected ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="flex w-21 h-21 items-center justify-center">
        {thumbnailURL ? (
          <img
            className="w-full h-full rounded-l-md object-cover flex-shrink-0"
            src={thumbnailURL}
            loading="lazy"
            alt="Primeira imagem da denúncia"
          />
        ) : (
          <Loading />
        )}
      </div>

      <div className="flex flex-col flex-grow py-3 pr-3">
        <div className="flex justify-between items-center">
          <div>
            {showDate && <p className="text-xs text-gray-500">{criadaHa}</p>}
            <h3 className="font-semibold text-md text-gray-700 line-clamp-1">
              {denuncia.nomeTipoDenuncia}
            </h3>
          </div>

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
