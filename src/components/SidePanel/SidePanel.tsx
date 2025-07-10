import { useState, useEffect } from 'react';
import { AddButton } from '../Buttons/AddButton';
import { useAddDenuncia } from '../../context/AddDenunciaContext';
import { useOcorrenciasContext } from '../../context/OcorrenciasContext';
import { ItemDetailsView } from './ItemDetailsView';
import { useFilters } from '../../context/FiltersContext';
import { AcoesTabContent } from './Acao/AcoesTabContent';
import { DenunciasTabContent } from './Denuncia/DenunciasTabContent';
import { useAddAcao } from '../../context/AddAcaoContext';

export function SidePanel() {
  const [abaAtiva, setAbaAtiva] = useState<'denuncias' | 'acoes'>('denuncias');
  const { setNewDenunciaCoordinates, isAddingDenuncia, setIsAddingDenuncia } =
    useAddDenuncia();
  const { actualDetailItem, setActualDetailItem } = useOcorrenciasContext();
  const { denunciasFiltradas, acoesFiltradas } = useFilters();
  const { isAddingAcao, setIsAddingAcao } = useAddAcao();

  useEffect(() => {
    if (!isAddingDenuncia) {
      setNewDenunciaCoordinates(null);
    }
  }, [isAddingDenuncia, setIsAddingDenuncia, setNewDenunciaCoordinates]);

  return (
    <>
      <aside className="w-full md:w-[450px] bg-white shadow-lg flex flex-col z-20 h-screen">
        <div className="flex items-center justify-between p-4 border-b-2 border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Painel de Ocorrências
            </h1>

            <span className="text-blue-500 text-sm font-semibold">
              De olho na cidade
            </span>
          </div>

          <AddButton
            label={`Adicionar ${isAddingDenuncia ? 'Denúncia' : 'Ação'}`}
            isAdding={isAddingDenuncia || isAddingAcao}
            disabled={!!actualDetailItem}
            onClick={() => {
              if (abaAtiva === 'denuncias') {
                setIsAddingDenuncia((current) => !current);
              } else {
                setIsAddingAcao((current) => !current);
              }
            }}
          />
        </div>

        {actualDetailItem && (
          <ItemDetailsView
            onBack={(item) => setActualDetailItem(item)}
            item={actualDetailItem}
            onDenunciaClick={(denuncia) => setActualDetailItem(denuncia)}
          />
        )}

        {!actualDetailItem && !isAddingDenuncia && !isAddingAcao && (
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

        <div className="p-4">
          {abaAtiva === 'denuncias' ? (
            <DenunciasTabContent />
          ) : (
            <AcoesTabContent />
          )}
        </div>
      </aside>
    </>
  );
}
