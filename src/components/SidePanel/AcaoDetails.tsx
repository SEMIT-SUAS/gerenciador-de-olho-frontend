import type { FC } from 'react';
import type { Acao } from '../../types/Acao';
import type { StatusModel } from '../../types/StatusModel';
import type { Denuncia } from '../../types/Denuncia';

interface AcaoDetailsProps {
    item: Acao;
    denuncias: Denuncia[];
    isAcao: (item: any) => item is Acao;
}

export const AcaoDetails: FC<AcaoDetailsProps> = ({item, denuncias, isAcao}) => {
    const denunciasVinculadas = isAcao(item) ? denuncias.filter(d => d.acaoId === item.id) : [];
    return (
        <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">{item.nome}</h2>
                <p className="text-sm text-gray-500 mb-4">Responsável: {item.secretaria}</p>
                    {item.polygonCoords.length > 0 && <p className="text-sm text-green-700 mb-4">Esta ação possui uma área de cobertura (polígono) no mapa.</p>}
                    <h3 className="font-semibold mb-2">Denúncias Vinculadas ({denunciasVinculadas.length})</h3>
                    <div className="rounded-lg p-2 max-h-60 overflow-y-auto bg-gray-50 space-y-2">
                        {denunciasVinculadas.length > 0 ? denunciasVinculadas.map(d => (
                            <div key={d.id} className="p-2 bg-white rounded">
                                <p className="font-medium text-gray-800">{d.titulo}</p>
                            </div>
                        )) : <p className="text-gray-500 text-sm p-2">Nenhuma denúncia vinculada.</p>}
                    </div>
        </div>
    );
}