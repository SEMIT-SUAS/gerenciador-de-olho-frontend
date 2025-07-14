import { FaTimes } from 'react-icons/fa';
import { API_BASE_URL } from '../config/api';
import type { File } from './FilesCarrousel';

interface ViewFileModalProps {
  file: File | null;
  onClose: () => void;
}

export function FileViewerModal({ file, onClose }: ViewFileModalProps) {
  if (!file) {
    return null;
  }

  const fileUrl = `${API_BASE_URL}/files/uploads/${file.name}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative bg-black rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 bg-white rounded-full p-2 text-gray-800 hover:bg-red-500 hover:text-white transition-all"
          aria-label="Fechar"
        >
          <FaTimes size={20} />
        </button>
        {file.type === 'image' ? (
          <img
            src={fileUrl}
            alt={file.name}
            className="w-full h-full object-contain max-h-[90vh] rounded-md"
            loading="lazy"
          />
        ) : (
          <video
            src={fileUrl}
            controls
            autoPlay
            className="w-full max-h-[90vh] rounded-md"
          >
            Seu navegador não suporta o elemento de vídeo.
          </video>
        )}
      </div>
    </div>
  );
}
