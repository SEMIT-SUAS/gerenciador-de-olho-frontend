import type { FC } from 'react';
import { useVincularDenunciaContext } from '../../context/vincularDenunciaContext';
import { useOcorrenciasContext } from '../../context/ocorrenciasContext';

export const VincularAcaoView: FC = () => {
    const { acoes } = useOcorrenciasContext();
    const { denunciaParaVincular, confirmLink, cancelLinking } = useVincularDenunciaContext();

    if (!denunciaParaVincular) return null;

    return (
        <div className="p-4 flex flex-col h-full">
            <button onClick={cancelLinking} className="self-start mb-4 text-sm text-blue-600 hover:underline font-semibold">&larr; Cancelar Vinculação</button>
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">Vinculando denúncia:</p>
                <p className="font-bold text-blue-900">{denunciaParaVincular.titulo}</p>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Selecione uma Ação Existente:</h3>
            <div className="flex-1 rounded-lg overflow-y-auto bg-gray-50 border space-y-2 p-2">
                {acoes.map(acao => (
                    <button key={acao.id} onClick={() => confirmLink(acao.id)} className="w-full text-left p-3 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-colors border">
                        <p className="font-semibold text-gray-700">{acao.nome}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};