import { useState, useEffect } from 'react';
import { AddButton } from '../Buttons/AddButton';
import { DenunciasTabContent } from './DenunciasTabContent';
import { useAddDenuncia } from '../../context/AddDenunciaContext';
import { useOcorrenciasContext } from '../../context/ocorrenciasContext';
import { ItemDetailsView } from './ItemDetailsView';
import { useFilters } from '../../context/FiltersContext';
import { AcoesTabContent } from './AcoesTabContent';

export function SidePanel() {
  const [abaAtiva, setAbaAtiva] = useState<'denuncias' | 'acoes'>('denuncias');
  const { setNewDenunciaCoordinates, isAddingDenuncia, setIsAddingDenuncia } =
    useAddDenuncia();
  const { actualDetailItem, setActualDetailItem } = useOcorrenciasContext();
  const { denunciasFiltradas, acoesFiltradas } = useFilters();

  useEffect(() => {
    if (!isAddingDenuncia) {
      setNewDenunciaCoordinates(null);
    }
  }, [isAddingDenuncia, setIsAddingDenuncia, setNewDenunciaCoordinates]);

  return (
    <>
      <aside className="w-full md:w-[450px] bg-white shadow-lg flex flex-col z-20 h-screen">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Painel de Ocorrências
          </h1>

          <AddButton
            label={`Adicionar ${isAddingDenuncia ? 'Denúncia' : 'Ação'}`}
            isAdding={isAddingDenuncia}
            disabled={!!actualDetailItem}
            onClick={() => setIsAddingDenuncia((current) => !current)}
          />
        </div>

        {actualDetailItem && (
          <ItemDetailsView
            onBack={(item) => setActualDetailItem(item)}
            item={actualDetailItem}
            onDenunciaClick={(denuncia) => setActualDetailItem(denuncia)}
          />
        )}

        {!actualDetailItem && !isAddingDenuncia && (
          <div>
            <nav className="flex">
              <button
                onClick={() => setAbaAtiva('denuncias')}
                className={`flex-1 p-4 text-center font-medium ${
                  abaAtiva === 'denuncias'
                    ? 'text-blue-600  border-b-2 border-blue-600'
                    : 'text-gray-500'
                }`}
              >
                Denúncias ({denunciasFiltradas.length})
              </button>

              <button
                onClick={() => setAbaAtiva('acoes')}
                className={`flex-1 p-4 text-center font-medium ${
                  abaAtiva === 'acoes'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-500'
                }`}
              >
                Ações ({acoesFiltradas.length})
              </button>
            </nav>
          </div>
        )}

        {abaAtiva === 'denuncias' ? (
          <DenunciasTabContent />
        ) : (
          <AcoesTabContent />
        )}
      </aside>
    </>
  );
}
