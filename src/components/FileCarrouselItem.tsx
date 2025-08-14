import { FaPlay } from 'react-icons/fa';
import { Loading } from './Loading/Loading';
import type { CarrouselFileProps } from './Modals/FileViewerModal';
import { useThumbnail } from '@/hooks/useThumbnail';

type FileCarrouselItemProps = {
  fileURL: string;
  onClickInItem: (file: CarrouselFileProps) => void;
};

export function FileCarrouselItem({
  fileURL,
  onClickInItem,
}: FileCarrouselItemProps) {
  const { thumbnailData, isLoading } = useThumbnail(fileURL);

  return (
    <button
      onClick={() => {
        if (thumbnailData) {
          onClickInItem({
            name: 'Imagem da denuncia',
            type: thumbnailData.originalFileType,
            url: fileURL,
          });
        }
      }}
      className="relative h-full w-full focus:outline-none"
    >
      {isLoading && (
        <div className="flex items-center justify-center h-full border-2 border-blue-50 rounded-md">
          <Loading />
        </div>
      )}

      {thumbnailData && (
        <div className="relative w-full h-full">
          <img
            src={thumbnailData.url}
            alt="Arquivo da denúncia"
            className="w-full h-full object-cover rounded-md"
            loading="lazy"
          />

          {thumbnailData.originalFileType === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-md">
              <FaPlay className="text-white text-4xl opacity-80" />
            </div>
          )}
        </div>
      )}
    </button>
  );
}
