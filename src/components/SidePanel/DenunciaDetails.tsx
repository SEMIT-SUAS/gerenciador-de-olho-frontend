import { API_BASE_URL } from '../../config/api';
import type { Denuncia } from '../../types/Denuncia';
import type { FC } from 'react';
import { Tag } from './Tag';
import { ImageModal } from '../Modals/ImageModal';
import { useState } from 'react';
import { useVincularDenunciaContext } from '../../context/vincularDenunciaContext';

interface DenunciaDetailsViewProps {
    item: Denuncia;
}

export const DenunciaDetails: FC<DenunciaDetailsViewProps> = ({item}) => {
    const { startLinking } = useVincularDenunciaContext();
    const [imagemEmDestaque, setImagemEmDestaque] = useState<string | null>(null);
    return (
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
                <div className="flex items-center px-4 py-3 justify-between bg-yellow-100 rounded-xl">
                    <p className="text-sm font-semibold text-yellow-800">Ação Vinculada: {item.acaoId}</p>
                </div>
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

        </div>
    );
}