import React, { useState, useContext } from 'react';
import type { FC } from 'react';
import { useIndeferirDenunciaContext } from '../../context/IndeferirDenunciaContext';
import { ConfirmModal } from '../Modals/ConfirmModal';
import { useOcorrenciasContext } from '../../context/ocorrenciasContext';
import { BackButton } from '../Buttons/Backbutton';
import { messagesRejectComplaint } from '../../constants/messagesRejectComplaint';

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
                <BackButton onClick={cancelIndeferir}>
                    Retornar para a página anterior
                </BackButton>
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">Indeferindo denúncia:</p>
                    <p className="font-bold text-red-900">{denunciaParaIndeferir.tipo}</p>
                    <p className='font-semibold text-sm text-red-900'>{`${denunciaParaIndeferir.endereco.rua}, ${denunciaParaIndeferir.endereco.bairro}`}</p>
                </div>
                <div className="flex-1 flex flex-col space-y-4">
                    <label htmlFor="motivo-indeferimento" className="font-semibold text-gray-800">Motivo do Indeferimento:</label>
                    <textarea 
                        id="motivo-indeferimento"
                        value={motivoStatus}
                        onChange={(e) => setMotivoStatus(e.target.value)}
                        rows={6}
                        className="w-full resize-none border-gray-300 rounded-md shadow-sm p-2 outline-0 text-sm"
                        placeholder="Descreva por que esta denúncia está sendo indeferida..."
                    />
                    <div>
                        <h4 className='text-gray-800 font-semibold mb-3'>Mensagens Sugeridas:</h4>
                        <div className="flex flex-wrap gap-3">
                            {messagesRejectComplaint.map((message, index) => (
                                <button
                                    key={index}
                                    onClick={() => setMotivoStatus(message)}
                                    className="px-3 py-1 text-xs text-start border-1 border-gray-200 rounded-lg text-gray-700 hover:bg-gray transition-colors"
                                >
                                    {message}
                                </button>
                            ))}
                        </div> 
                    </div>


                    <button onClick={handleOpenConfirmation} className="w-full border-2 border-red-500 text-red-500 text-sm font-semibold py-2 rounded-lg transition hover:bg-red-500 hover:text-white outline-0    ">
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

