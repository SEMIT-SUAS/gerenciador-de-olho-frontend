import { FaPlay } from 'react-icons/fa';
import { Loading } from './Loading/Loading';
import type { CarrouselFileProps } from './Modals/FileViewerModal';
import { useState } from 'react';

type FileCarrouselItemProps = {
  fileURL: string;
  onClickInItem: (file: CarrouselFileProps) => void;
};

export function FileCarrouselItem({
  fileURL,
  onClickInItem,
}: FileCarrouselItemProps) {
  const [thumbnailURL, setThubmnailURL] = useState<string | null>(null);

  return (
    <button
      // onClick={() =>
      //   onClickInItem({
      //     name: denunciaFile.nome,
      //     type: denunciaFile.tipo,
      //     url: cachedFile?.fileURL!,
      //   })
      // }
      className="relative h-full w-full focus:outline-none"
    >
      {!thumbnailURL && (
        <div className="flex items-center justify-center h-full border-2 border-blue-50 rounded-md">
          <Loading />
        </div>
      )}

      {thumbnailURL && (
        <div className="relative w-full h-full">
          <img
            src={thumbnailURL}
            alt="Arquivo da denúncia"
            className="w-full h-full object-cover rounded-md"
            loading="lazy"
          />

          {cachedFile.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-md">
              <FaPlay className="text-white text-4xl opacity-80" />
            </div>
          )}
        </div>
      )}
    </button>
  );
}
