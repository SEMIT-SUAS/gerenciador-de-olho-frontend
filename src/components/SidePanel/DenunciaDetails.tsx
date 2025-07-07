import type { Denuncia } from '../../types/Denuncia';
import type { FC } from 'react';
import type { Acao } from '../../types/Acao';
import { Tag } from './Tag';
import { ImageModal } from '../Modals/ImageModal';
import { useState } from 'react';
import { useVincularDenunciaContext } from '../../context/vincularDenunciaContext';
import { useIndeferirDenunciaContext } from '../../context/IndeferirDenunciaContext';
import { useOcorrenciasContext } from '../../context/ocorrenciasContext';
import { ConfirmModal } from '../Modals/ConfirmModal';
import { FaTrashAlt } from 'react-icons/fa';



interface DenunciaDetailsViewProps {
    item: Denuncia;
}

//desvincularDenunciaAcao(item.id)

export const DenunciaDetails: FC<DenunciaDetailsViewProps> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false)
    const { startIndeferir } = useIndeferirDenunciaContext();
    const { startLinking } = useVincularDenunciaContext();
    const { desvincularDenunciaAcao } = useOcorrenciasContext();
    const [imagemEmDestaque, setImagemEmDestaque] = useState<string | null>(null);


    const handleDesvincularDenunciaAcao = () => {
        setIsOpen(true);
    }

    const handleConfirmDesvincularDenunciaAcao = () => {
         desvincularDenunciaAcao(item.id)
         setIsOpen(false)
    }

    return (
        <>
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex-row">
                    <p className="text-sm font-semibold text-yellow-700">{item.categoria}</p>
                    <h2 className="text-xl font-bold text-gray-800 flex-1">{item.tipo}</h2>
                    <p className="text-sm text-gray-500">Registrado em: {new Date(item.created_at).toLocaleDateString('pt-BR')}</p>
                </div>

                <Tag status={item.status} />
            </div>

            <div>
                <h3 className="font-semibold text-sm text-gray-800 mb-1 ">Descrição:</h3>
                <p className='text-sm  text-gray-600'>{item.descricao}</p>
            </div>
            <div className='flex-col text-gray-700 border border-gray-200 p-4 rounded-2xl'>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">Endereço:</h3>
                <p className="text-sm text-gray-600">{item.endereco.rua}, {item.endereco.bairro}</p>
                <p className="text-sm text-gray-600">{item.endereco.ponto_referencia}</p>
                <p className='text-sm text-gray-600'>CEP: {item.endereco.cep}</p>
                <div className='flex mt-2'>
                    <p className='text-sm font-bold text-blue-900 py-1 px-4 bg-blue-100 mr-2 rounded-sm'>{item.endereco.latitude}</p>
                    <p className='text-sm font-bold text-blue-900 py-1 px-4 bg-blue-100 mr-2 rounded-sm'>{item.endereco.longitude}</p>
                </div>
            </div> 

            {item.acaoId ? (
                <>
                <div className="flex items-center px-4 py-3 justify-between bg-yellow-100 rounded-xl">
                    <p className="text-sm font-semibold text-yellow-800">Ação Vinculada: {item.acaoId}</p>
                    <button onClick={() => handleDesvincularDenunciaAcao()} ><FaTrashAlt /></button>
                     
                </div>
                </>
            ) : (
                <div className=" py-3 px-4 rounded-xl border border-gray-200">
                    <p className="text-sm font-semibold text-gray-800">Nenhuma ação vinculada</p>
                    <div className="py-2">
                        <button onClick={() => startLinking(item)} className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Vincular a uma Ação 
                        </button>
                    </div>
                </div>
                
                
            )}

            {item.images.length > 0 && (
                <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Imagens:</h3>
                    <div className="grid grid-flow-col auto-cols-[10rem] gap-x-2 overflow-x-auto pb-2 pt-2 custom-scrollbar-blue">
                        {item.images.map(img => (
                            <button key={img.id} onClick={() => setImagemEmDestaque(`http://localhost:3000/files/uploads/${img.name}`)} className="relative">
                                <img src={`http://localhost:3000/files/uploads/${img.name}`} alt={img.name} className="h-40 w-full object-cover rounded-lg hover:opacity-80 transition-opacity" />
                            </button>
                        ))}
                        <ImageModal imageUrl={imagemEmDestaque} onClose={() => setImagemEmDestaque(null)} />
                    </div>
                </div>
            )}

            {item.status === 'indeferido' && item.motivoStatus && (
                <div className="p-3 bg-red-50 border-l-4 border-red-400 text-red-700">
                    <p className="font-bold">Motivo do Indeferimento:</p>
                    <p>{item.motivoStatus}</p>
                </div>
            )}
            {item.status === 'aberto' && (
                <button onClick={() => startIndeferir(item)} className="w-full bg-red-500 text-white font-bold py-2 rounded-lg hover:bg-red-600">
                    Indeferir Denúncia
                </button>   
            )}

        </div>
        <ConfirmModal
            isOpen={isOpen} 
            title={"Confirmação de Desvinculo"} 
            message={`Você tem certeza que deseja desvincular a denúncia "${item.titulo}" da ação:"${item.acaoId}"?`} 
            onCancel={() => setIsOpen(false)}
            onConfirm={handleConfirmDesvincularDenunciaAcao}
        />
        </>
    );
}