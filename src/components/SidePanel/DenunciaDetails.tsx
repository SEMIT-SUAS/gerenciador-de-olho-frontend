import type { Denuncia } from '../../types/Denuncia';
import type { FC } from 'react';
import { Tag } from './Tag';

interface DenunciaDetailsViewProps {
    item: Denuncia;
}

export const DenunciaDetails: FC<DenunciaDetailsViewProps> = ({item}) => {
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
                </div>
            )}

            {item.images.length > 0 && (
                <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Imagens:</h3>
                    <div className="grid grid-flow-col auto-cols-[10rem] gap-x-2 overflow-x-auto pb-4 pt-2 scrollbar-hide">
                        {item.images.map(img => (
                            <a key={img.id} href={img.url} target="_blank" rel="noopener noreferrer">
                                <img 
                                    src={`http://localhost:3000/files/uploads/${img.name}`}
                                    alt={img.name} 
                                    className="h-40 w-full object-cover rounded-lg hover:opacity-80 transition-opacity" 
                                />
                            </a>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}