import type { FC } from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export const ConfirmModal: FC<ConfirmModalProps> = ({ isOpen, onCancel, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm m-4 text-center">
                <h2 className="text-xl font-bold mb-2">{title}</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-center space-x-4">
                    <button onClick={onCancel} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-semibold">Cancelar</button>
                    <button onClick={onConfirm} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">Confirmar</button>
                </div>
            </div>
        </div>
    )
}