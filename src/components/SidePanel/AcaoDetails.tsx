import type { FC } from 'react';
import type { Acao } from '../../types/Acao';
import type { Denuncia } from '../../types/Denuncia';
import { Tag } from './Tag';

interface AcaoDetailsProps {
    item: Acao;
    denuncias: Denuncia[];
    onDenunciaClick: (denuncia: Denuncia) => void; // Função para ver detalhes de uma denúncia vinculada
}


export const AcaoDetails: FC<AcaoDetailsProps> = ({item, denuncias, onDenunciaClick}) => {
    const denunciasVinculadas = denuncias.filter(d => d.acaoId === item.id);
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800">{item.nome}</h2>
                    <p className="text-sm text-gray-500">Responsável: {item.secretaria}</p>
                </div>
                <Tag status={item.status} />
            </div>
            
            {item.polygonCoords.length > 0 && (
                <div className="flex items-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm font-semibold text-blue-800">Esta ação possui uma área de cobertura (polígono) no mapa.</p>
                </div>
            )}

            <div>
                <h3 className="font-semibold text-sm text-gray-800 mb-1">Denúncias Vinculadas ({denunciasVinculadas.length}):</h3>
                <div className="rounded-lg max-h-80 overflow-y-auto border border-gray-200 space-y-2 p-2">
                    {denunciasVinculadas.length > 0 ? denunciasVinculadas.map(d => (
                        <button 
                            key={d.id} 
                            onClick={() => onDenunciaClick(d)}
                            className="w-full text-left p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            <div className="flex justify-between items-center">
                                <p className="font-semibold text-gray-700">{d.tipo}</p>
                                <Tag status={d.status} />
                            </div>
                            <p className="text-sm text-gray-500">{d.endereco.rua}</p>
                        </button>
                    )) : (
                        <p className="text-gray-500 text-sm p-2 text-center">Nenhuma denúncia vinculada.</p>
                    )}
                </div>
            </div>
        </div>
    );
}