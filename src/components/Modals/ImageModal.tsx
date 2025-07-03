import type { FC } from 'react';
import { FaTimes } from 'react-icons/fa';


interface ImageModalProps {
    imageUrl: string | null;
    onClose: () => void;
}

export const ImageModal: FC<ImageModalProps> = ({ imageUrl, onClose }) => {
    if (!imageUrl) {
        return null;
    }

    return (
        <div
        className="fixed inset-0 bg-black/75 flex items-center justify-center z-50"
        onClick={onClose} // Fecha o modal ao clicar no fundo
        >

        <div className="relative" onClick={(e) => e.stopPropagation()}>
            
            <button
            onClick={onClose}
            className="absolute -top-3 -right-3 z-10 bg-gray-700 text-white rounded-full p-1.5 hover:bg-gray-800 transition-colors"
            aria-label="Fechar imagem"
            >
            <FaTimes size={18} />
            </button>
            
            <img
            src={imageUrl}
            alt="Imagem da denúncia em destaque"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl"
            />
        </div>
        </div>

    );
};