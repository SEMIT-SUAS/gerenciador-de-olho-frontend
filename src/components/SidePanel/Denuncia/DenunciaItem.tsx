import { FaMapPin, FaTrash } from 'react-icons/fa';
import { Tag } from '../Tag';
import type { DenunciaModel } from '@/types/Denuncia';
import { calcularDiasAtras } from '@/utils/data';
import { getDenunciaStatus } from '@/utils/getDenunciaStatus';
import arquivoService from '@/services/arquivoService';
import { useEffect, useState } from 'react';
import { Loading } from '@/components/Loading/Loading';
import { generateThumbnailUrl } from '@/utils/video';

type DenunciaItemProps = {
  denuncia: DenunciaModel;
  onClick: () => void;
  onTrashClick?: () => void;
  isDeletable: boolean;
  showTag: boolean;
};

export function DenunciaItem({
  denuncia,
  onClick,
  showTag,
  isDeletable,
  onTrashClick,
}: DenunciaItemProps) {
  const diasAtras = calcularDiasAtras(denuncia.criadaEm);
  const denunciaStatus = getDenunciaStatus(denuncia);
  const [thumbImageURL, setThumbImageURL] = useState<string | null>(null);

  async function fetchThumbImage() {
    const firstFile = denuncia.files[0];
    const file = await arquivoService.getByName(firstFile.nome);

    return await generateThumbnailUrl(file);
  }

  useEffect(() => {
    if (!thumbImageURL) {
      fetchThumbImage().then((thumbImageURL) => {
        setThumbImageURL(thumbImageURL);
      });
    }
  }, [thumbImageURL]);

  return (
    <div
      key={denuncia.id}
      className="flex items-start gap-4 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50"
      onClick={onClick}
    >
      <div className="flex w-21 h-21 items-center justify-center">
        {thumbImageURL ? (
          <img
            className="w-full h-full rounded-l-md object-cover flex-shrink-0"
            src={thumbImageURL}
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
            <p className="text-xs text-gray-500">{diasAtras}</p>
            <h3 className="font-semibold text-md text-gray-700 line-clamp-1">
              {denuncia.tipo.nome}
            </h3>
          </div>

          {showTag && <Tag status={denunciaStatus} />}
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
            {`${denuncia.rua}, ${denuncia.bairro}`}
          </span>
        </p>
      </div>
    </div>
  );
}
