import { API_BASE_URL } from '../../config/api';
import type { Denuncia } from '../../types/Denuncia';
import type { StatusModel } from '../../types/StatusModel';
import type { FC } from 'react';

interface DenunciaDetailsViewProps {
    item: Denuncia;
}

const getStatusClass = (status: StatusModel) => {
        switch (status) {
            case 'aberto':
                return 'bg-blue-100 text-blue-800';
            case 'em_andamento':
                return 'bg-yellow-100 text-yellow-800';
            case 'concluido':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

export const DenunciaDetails: FC<DenunciaDetailsViewProps> = ({item}) => {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-800 flex-1">{item.tipo.name}</h2>
                <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize whitespace-nowrap ml-2 ${getStatusClass(item.status)}`}>
                    {item.status.replace('_', ' ')}
                </span>
            </div>
            <div className='flex justify-between items-start text-gray-700 bg-blue-100 p-3 rounded-md'>
                <p className="text-sm font-semibold text-gray-800">{item.categoria}</p>
                <p className="text-sm text-gray-500">Registrado em: {new Date(item.created_at).toLocaleDateString('pt-BR')}</p>
            </div>
            <div>
                <h3 className="font-semibold text-gray-800 mb-1 ">Descrição:</h3>
                <p className='text-sm  text-gray-600'>{item.descricao}</p>
            </div>
            <div>
                <h3 className="font-semibold text-gray-800 mb-1">Endereço:</h3>
                <p className="text-sm text-gray-600">{item.endereco.rua}, {item.endereco.bairro}</p>
                <p className="text-sm text-gray-500">{item.endereco.ponto_referencia}</p>
            </div> 
            {item.images.length > 0 && (
                <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Imagens:</h3>
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {item.images.map(img => (
                            <a key={img.id} href={img.url} target="_blank" rel="noopener noreferrer">
                                <img 
                                    src={`${API_BASE_URL}/files/uploads/${img.name}`}
                                    alt={img.name} 
                                    className="h-40 w-40 object-cover rounded-md hover:opacity-80 transition-opacity" 
                                />
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}