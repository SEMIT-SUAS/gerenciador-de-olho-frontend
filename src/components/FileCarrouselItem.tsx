import type { DenunciaFile } from '@/types/DenunciaFile';
import { useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { Loading } from './Loading/Loading';
import arquivoService from '@/services/arquivoService';
import { generateThumbnailUrl } from '@/utils/video';
import type { CarrouselFileProps } from './Modals/FileViewerModal';

type FileCarrouselItemProps = {
  file: DenunciaFile;
  onClickInItem: (file: CarrouselFileProps) => void;
};

export function FileCarrouselItem({
  file: denunciaFile,
  onClickInItem,
}: FileCarrouselItemProps) {
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [thumbnailURL, setThumbnailURL] = useState<string | null>(null);

  async function fetchArquivo() {
    return await arquivoService.getByName(denunciaFile.nome);
  }

  useEffect(() => {
    fetchArquivo().then((file) => {
      if (denunciaFile.tipo === 'video') {
        setVideoURL(URL.createObjectURL(file));
      }

      generateThumbnailUrl(file).then((url) => {
        setThumbnailURL(url);
      });
    });
  }, []);

  return (
    <button
      onClick={() =>
        onClickInItem({
          name: denunciaFile.nome,
          type: denunciaFile.tipo,
          url: videoURL ?? thumbnailURL!,
        })
      }
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
