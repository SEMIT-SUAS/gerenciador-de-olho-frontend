export const generateVideoThumbnailObjectUrl = async (
  videoUrl: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Create video element
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.src = videoUrl;
    video.crossOrigin = 'anonymous'; // For CORS if needed

    video.addEventListener('loadedmetadata', () => {
      // Set canvas dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Seek to a specific time (e.g., 1 second) to capture a frame
      video.currentTime = 1;
    });

    video.addEventListener('seeked', () => {
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob and create object URL
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob from canvas'));
            return;
          }

          const url = URL.createObjectURL(blob);
          resolve(url);
        },
        'image/jpeg',
        0.95,
      ); // 95% quality JPEG
    });

    video.addEventListener('error', () => {
      reject(new Error('Video loading error'));
    });
  });
};
