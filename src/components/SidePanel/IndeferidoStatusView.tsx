import React, { useState, useContext } from 'react';
import type { FC } from 'react';
import { useIndeferirDenunciaContext } from '../../context/IndeferirDenunciaContext';
import { ConfirmModal } from '../Modals/ConfirmModal';
import { useOcorrenciasContext } from '../../context/OcorrenciasContext';

export const IndeferirDenunciaView: FC = () => {
    const { denunciaParaIndeferir, cancelIndeferir, confirmIndeferir } = useIndeferirDenunciaContext();
    const { actualDetailItem, setActualDetailItem } = useOcorrenciasContext()
    const [motivoStatus, setMotivoStatus] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!denunciaParaIndeferir) return null;

    const handleOpenConfirmation = () => {
        if (!motivoStatus.trim()) {
            alert("Por favor, preencha o motivo do indeferimento.");
            return; 
        }
        setIsModalOpen(true);
    };

    const handleConfirmSubmit = () => {
        confirmIndeferir(motivoStatus);
        setIsModalOpen(false);  

        if (actualDetailItem) {
            setActualDetailItem(current => ({ ...current, status: 'indeferido' }));
        }
    };

    

    return (
        <>
            <div className="p-4 flex flex-col h-full">
                <button onClick={cancelIndeferir} className="self-start mb-4 text-sm text-blue-600 hover:underline font-semibold">&larr; Voltar para Detalhes</button>
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">Indeferindo denúncia:</p>
                    <p className="font-bold text-red-900">{denunciaParaIndeferir.titulo}</p>
                </div>
                <div className="flex-1 flex flex-col space-y-4">
                    <label htmlFor="motivo-indeferimento" className="font-semibold text-gray-800">Motivo do Indeferimento:</label>
                    <textarea 
                        id="motivo-indeferimento"
                        value={motivoStatus}
                        onChange={(e) => setMotivoStatus(e.target.value)}
                        rows={6}
                        className="w-full border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="Descreva por que esta denúncia está sendo indeferida..."
                    />
                    <button onClick={handleOpenConfirmation} className="w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700">
                        Confirmar Indeferimento
                    </button>
                </div>
            </div>

            <ConfirmModal 
                isOpen={isModalOpen} 
                title={"Confirmação de Indeferimento"} 
                message={`Você tem certeza que deseja indeferir a denúncia "${denunciaParaIndeferir.titulo}"?`} 
                onCancel={() => setIsModalOpen(false)}
                onConfirm={handleConfirmSubmit}
            />
        </>
    );
};

