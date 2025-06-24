import { useState } from 'react';
import type { FC } from 'react';
import type { Denuncia, Acao } from '../../types/ocorrencias';

export interface CreateActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (nome: string, secretaria: string) => void;
  selectionCount: number;
}

export const CreateActionModal: FC<CreateActionModalProps> = ({ isOpen, onClose, onSubmit, selectionCount }) => {
  const [nomeAcao, setNomeAcao] = useState('');
  const [secretariaAcao, setSecretariaAcao] = useState('');

  const handleSubmit = () => {
    onSubmit(nomeAcao, secretariaAcao);
    setNomeAcao('');
    setSecretariaAcao('');
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg m-4">
        <h2 className="text-2xl font-bold mb-4">Nomear Nova Ação</h2>
        <p className="mb-4 text-gray-600">Você selecionou {selectionCount} denúncia(s). Preencha os detalhes da ação.</p>
        <div className="space-y-4">
          <div>
            <label htmlFor="nomeAcao" className="block font-medium mb-1">Nome da Ação:</label>
            <input
              id="nomeAcao"
              type="text"
              value={nomeAcao}
              onChange={e => setNomeAcao(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="Ex: Operação Tapa-Buraco"
            />
          </div>

          <div>
            <label
              htmlFor="secretariaAcao"
              className="block font-medium mb-1"
            >
              Secretaria Responsável:
            </label>
            <input
              id="secretariaAcao"
              type="text" value={secretariaAcao}
              onChange={e => setSecretariaAcao(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="Ex: Secretaria de Obras"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
            Voltar
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Confirmar Criação</button>
        </div>
      </div>
    </div>
  );
}

export interface ActionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  acao: Acao | null;
  denunciasVinculadas: Denuncia[];
}

export const ActionDetailsModal: FC<ActionDetailsModalProps> = ({ isOpen, onClose, acao, denunciasVinculadas }) => {
  if (!isOpen || !acao) return null;

  return (
    <div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg m-4">
        <h2 className="text-2xl font-bold mb-2">Detalhes da Ação</h2>
        <p className="text-lg text-gray-700 mb-1">{acao.nome}</p>
        <p className="text-sm text-gray-500 mb-4">Responsável: {acao.secretaria}</p>
        {acao.polygonCoords.length > 0 && <p className="text-sm text-green-700 mb-4">Esta ação possui uma área de cobertura (polígono) no mapa.</p>}
        <hr className="my-4" />
        <h3 className="font-semibold mb-2">Denúncias Vinculadas ({denunciasVinculadas.length})</h3>
        <div className="border rounded-lg p-2 h-40 overflow-y-auto bg-gray-50 space-y-2">
          {denunciasVinculadas.map(d => (
            <div key={d.id} className="p-2 bg-white border rounded">
              <p className="font-medium text-gray-800">{d.titulo}</p>
              <p className="text-sm text-gray-600">{d.descricao}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end"><button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Fechar</button></div>
      </div>
    </div>
  );
}