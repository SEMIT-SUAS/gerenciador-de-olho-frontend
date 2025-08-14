import { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

export type CarrouselFileProps = {
  name: string;
  type: 'image' | 'video';
  url: string;
};

interface ViewFileModalProps {
  file: CarrouselFileProps | null;
  onClose: () => void;
}

export function FileViewerModal({ file, onClose }: ViewFileModalProps) {
  useEffect(() => {
    const handleEscape = (event: any) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  if (!file) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md transition-all duration-300 ease-in-out"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-white/90 rounded-full p-2.5 shadow-md text-gray-700 hover:bg-red-600 hover:text-white transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
        aria-label="Fechar"
      >
        <FaTimes size={22} />
      </button>

      {file.type === 'image' ? (
        <img
          src={file.url}
          alt={file.name}
          className="w-auto max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl transform transition-transform duration-300 hover:scale-[1.02]"
          loading="lazy"
        />
      ) : (
        <video
          src={file.url}
          controls
          autoPlay
          className="w-auto max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl"
        >
          Seu navegador não suporta o elemento de vídeo.
        </video>
      )}
    </div>
  );
}
