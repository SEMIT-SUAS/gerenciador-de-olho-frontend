import type { DenunciaFile } from '@/types/DenunciaFile';
import { useMemo } from 'react';
import { FaPlay } from 'react-icons/fa';
import { Loading } from './Loading/Loading';
import type { CarrouselFileProps } from './Modals/FileViewerModal';

type FileCarrouselItemProps = {
  file: DenunciaFile;
  onClickInItem: (file: CarrouselFileProps) => void;
};

export function FileCarrouselItem({
  file: denunciaFile,
  onClickInItem,
}: FileCarrouselItemProps) {
  return null;

  return (
    <button
      onClick={() =>
        onClickInItem({
          name: denunciaFile.nome,
          type: denunciaFile.tipo,
          url: cachedFile?.fileURL!,
        })
      }
      className="relative h-full w-full focus:outline-none"
    >
      {!cachedFile?.thumbnailURL && (
        <div className="flex items-center justify-center h-full border-2 border-blue-50 rounded-md">
          <Loading />
        </div>
      )}

      {cachedFile?.thumbnailURL && (
        <div className="relative w-full h-full">
          <img
            src={cachedFile.thumbnailURL}
            alt={denunciaFile.nome}
            className="w-full h-full object-cover rounded-md"
            loading="lazy"
          />

          {denunciaFile.tipo === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-md">
              <FaPlay className="text-white text-4xl opacity-80" />
            </div>
          )}
        </div>
      )}
    </button>
  );
}
