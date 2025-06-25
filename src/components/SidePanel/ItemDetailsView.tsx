import type { FC } from 'react';
import type { Denuncia } from '../../types/Denuncia';
import type { Acao } from '../../types/Acao';

function isAcao(item: Denuncia | Acao): item is Acao {
    return 'secretaria' in item;
}

interface ItemDetailsViewProps {
    item: Denuncia | Acao;
    denuncias: Denuncia[];
    onBack: () => void;
}

export const ItemDetailsView: FC<ItemDetailsViewProps> = ({ item, denuncias, onBack }) => {
    const denunciasVinculadas = isAcao(item) ? denuncias.filter(d => d.acaoId === item.id) : [];

    return (
        <div className="p-4 flex flex-col h-full">
            <button onClick={onBack} className="self-start mb-4 text-sm text-blue-600 hover:underline font-semibold">
                &larr; Voltar para a lista
            </button>
            
            {isAcao(item) ? (
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{item.nome}</h2>
                    <p className="text-sm text-gray-500 mb-4">Responsável: {item.secretaria}</p>
                    {item.polygonCoords.length > 0 && <p className="text-sm text-green-700 mb-4">Esta ação possui uma área de cobertura (polígono) no mapa.</p>}
                    <hr className="my-4"/>
                    <h3 className="font-semibold mb-2">Denúncias Vinculadas ({denunciasVinculadas.length})</h3>
                    <div className="rounded-lg p-2 max-h-60 overflow-y-auto bg-gray-50 space-y-2">
                        {denunciasVinculadas.length > 0 ? denunciasVinculadas.map(d => (
                            <div key={d.id} className="p-2 bg-white rounded">
                                <p className="font-medium text-gray-800">{d.titulo}</p>
                            </div>
                        )) : <p className="text-gray-500 text-sm p-2">Nenhuma denúncia vinculada.</p>}
                    </div>
                </div>
            ) : (
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold text-gray-800">{item.titulo}</h2>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${item.status === 'aberto' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {item.status === 'aberto' ? 'Aberto' : 'Em Atendimento'}
                        </span>
                    </div>
                    <p className="text-gray-600">{item.descricao}</p>
                </div>
            )}
        </div>
    );
}