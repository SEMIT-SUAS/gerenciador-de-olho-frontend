import { ArquivoService } from '@/services/ArquivoService';
import { generateVideoThumbnail } from '@/utils/video';
import { useEffect, useState } from 'react';

const FALLBACK_IMAGE: string = '/image_fail_to_fetch.png';

interface ThumbnailDataProps {
  url: string;
  originalFileType: 'video' | 'image';
}

export function useThumbnail(arquivoUrl: string | null) {
  const [thumbnailData, setThumbnailData] = useState<ThumbnailDataProps | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let objectUrlToRevoke: string | null = null;

    async function createThumbnail() {
      if (!arquivoUrl) {
        setThumbnailData({
          originalFileType: 'image',
          url: FALLBACK_IMAGE,
        });

        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const blob = await ArquivoService.getFileBlobByURL(arquivoUrl);

      if (blob.type.includes('video')) {
        const videoThumbUrl = await generateVideoThumbnail(arquivoUrl);

        if (videoThumbUrl) {
          objectUrlToRevoke = videoThumbUrl;
          setThumbnailData({
            originalFileType: 'video',
            url: videoThumbUrl,
          });
        } else {
          setThumbnailData({
            originalFileType: 'video',
            url: FALLBACK_IMAGE,
          });
        }
      } else if (blob.type.includes('image')) {
        objectUrlToRevoke = URL.createObjectURL(blob);

        setThumbnailData({
          originalFileType: 'image',
          url: objectUrlToRevoke,
        });
      }

      setIsLoading(false);
    }

    createThumbnail();

    return () => {
      if (objectUrlToRevoke) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }
    };
  }, [arquivoUrl]);

  return { thumbnailData, isLoading };
}
