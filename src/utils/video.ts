export function generateVideoThumbnail(
  videoUrl: string,
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');

    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';
    video.src = videoUrl;

    // Função auxiliar para criar um thumbnail preto
    const generateBlackThumbnail = (
      width: number,
      height: number,
    ): Promise<string> => {
      return new Promise((res) => {
        const canvas = document.createElement('canvas');
        canvas.width = width || 1280;
        canvas.height = height || 720;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = 'black';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        canvas.toBlob(
          (blob) => {
            res(blob ? URL.createObjectURL(blob) : '');
          },
          'image/jpeg',
          0.8,
        );
      });
    };

    // Função para verificar se a imagem é toda preta
    const isBlackFrame = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
    ): boolean => {
      const frame = ctx.getImageData(0, 0, width, height).data;
      for (let i = 0; i < frame.length; i += 4) {
        if (frame[i] !== 0 || frame[i + 1] !== 0 || frame[i + 2] !== 0) {
          return false; // Encontrou pixel não preto
        }
      }
      return true;
    };

    video.addEventListener('loadedmetadata', () => {
      // Garantir que temos dimensões válidas
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        setTimeout(() => {
          if (video.videoWidth === 0 || video.videoHeight === 0) {
            reject(new Error('Vídeo sem dimensões válidas'));
            URL.revokeObjectURL(videoUrl);
            return;
          }
          video.currentTime = Math.min(
            video.duration / 2,
            video.duration - 0.1,
          );
        }, 200);
        return;
      }

      // Vai para o meio do vídeo
      video.currentTime = Math.min(video.duration / 2, video.duration - 0.1);
    });

    video.addEventListener('seeked', async () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context não encontrado');

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Verifica se frame é todo preto
        if (isBlackFrame(ctx, canvas.width, canvas.height)) {
          const blackThumb = await generateBlackThumbnail(
            canvas.width,
            canvas.height,
          );
          resolve(blackThumb);
        } else {
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(URL.createObjectURL(blob));
              else reject(new Error('Falha ao gerar thumbnail'));
            },
            'image/jpeg',
            0.8,
          );
        }
      } catch (err) {
        reject(err);
      } finally {
        URL.revokeObjectURL(videoUrl);
        video.remove();
      }
    });

    video.addEventListener('error', () => {
      reject(new Error('Erro ao carregar vídeo'));
      URL.revokeObjectURL(videoUrl);
      video.remove();
    });
  });
}
