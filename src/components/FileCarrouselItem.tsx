import { useEffect, useState, useRef } from 'react';
import { Loading } from './Loading/Loading';
import { ArquivoService } from '@/services/ArquivoService';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { cn } from '@/lib/utils';

type FileData = {
  fileUrl: string;
  thumbnailUrl: string;
  fileType: 'image' | 'video' | 'other';
};

type FileCarrouselItemProps = {
  fileUrl: string;
};

export function FileCarrouselItem({ fileUrl }: FileCarrouselItemProps) {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isOpenFileViewerModal, setIsOpenFileViewerModal] = useState(false);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    ArquivoService.getBlobByURL(fileUrl)
      .then((blob) => {
        if (!isMounted) return;

        const objectUrl = URL.createObjectURL(blob);
        objectUrlRef.current = objectUrl;
        let data: FileData;

        if (blob.type.startsWith('image/')) {
          data = {
            fileUrl: objectUrl,
            thumbnailUrl: objectUrl,
            fileType: 'image',
          };
        } else if (blob.type.startsWith('video/')) {
          data = {
            fileUrl: objectUrl,
            thumbnailUrl: objectUrl,
            fileType: 'video',
          };
        } else {
          data = {
            fileUrl: objectUrl,
            thumbnailUrl: '/image_fail_to_fetch.png',
            fileType: 'other',
          };
        }
        setFileData(data);
      })
      .catch((error) => toast.error((error as Error).message));

    return () => {
      isMounted = false;
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, [fileUrl]);

  return (
    <>
      <button
        onClick={() => setIsOpenFileViewerModal(true)}
        className="relative h-full w-full focus:outline-none disabled:cursor-not-allowed"
        disabled={!fileData}
      >
        {!fileData && (
          <div className="flex items-center justify-center h-full border-2 border-blue-50 rounded-md">
            <Loading />
          </div>
        )}

        {fileData && (
          <div className="relative w-full h-full">
            {fileData.fileType === 'video' ? (
              <video
                src={`${fileData.fileUrl}#t=0.1`}
                className="w-full h-full object-cover rounded-md pointer-events-none"
                preload="metadata"
                muted
                playsInline
              />
            ) : (
              <img
                src={fileData.thumbnailUrl}
                alt="Arquivo da denúncia"
                className={`w-full h-full ${
                  fileData.fileType === 'image'
                    ? 'object-cover'
                    : 'object-contain p-4'
                } rounded-md`}
                loading="lazy"
              />
            )}
          </div>
        )}
      </button>

      <Dialog
        open={isOpenFileViewerModal}
        onOpenChange={setIsOpenFileViewerModal}
      >
        <DialogContent className={cn('max-w-4xl max-h-[80vh] flex flex-col')}>
          <DialogHeader>
            <DialogTitle>Visualizador de Arquivo</DialogTitle>
          </DialogHeader>
          <div className="flex-grow flex items-center justify-center overflow-hidden">
            {fileData?.fileType === 'image' && (
              <img
                src={fileData.fileUrl}
                alt="Imagem da denúncia"
                className="max-w-full max-h-full object-contain"
              />
            )}
            {fileData?.fileType === 'video' && (
              <video
                src={fileData.fileUrl}
                controls
                autoPlay
                className="max-w-full max-h-full"
              />
            )}
            {fileData?.fileType === 'other' && (
              <div className="text-center">
                <p className="mb-4">
                  Não é possível pré-visualizar este tipo de arquivo.
                </p>
                <a
                  href={fileData.fileUrl}
                  download
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Baixar Arquivo
                </a>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
