export async function generateThumbnailUrl(file: Blob): Promise<string> {
  try {
    const fileType = file.type;
    if (fileType.startsWith('video/')) {
      // Cria elementos temporários no DOM
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Canvas context não disponível');
      }

      // Configura o vídeo
      const videoUrl = URL.createObjectURL(file);
      video.src = videoUrl;
      video.muted = true;
      video.currentTime = 0.5; // Pega o frame em 0.5 segundos

      // Aguarda o vídeo estar pronto
      await new Promise<void>((resolve, reject) => {
        video.addEventListener('loadeddata', () => resolve());
        video.addEventListener('error', () =>
          reject(new Error('Erro ao carregar vídeo')),
        );
        video.addEventListener('seeked', () => resolve());
      });

      // Configura o canvas com as dimensões do vídeo
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Converte para URL de imagem
      const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);

      // Limpa a memória
      URL.revokeObjectURL(videoUrl);

      return thumbnailUrl;
    }

    // Se for imagem, retorna URL normal
    return URL.createObjectURL(file);
  } catch (error) {
    return '/image_fail_to_fetch.png';
  }
}
