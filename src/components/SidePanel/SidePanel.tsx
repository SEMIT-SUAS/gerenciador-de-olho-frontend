import { useState, useEffect } from 'react';
import { AddButton } from '../Buttons/AddButton';
import { useAddDenuncia } from '../../context/AddDenunciaContext';
import { useOcorrenciasContext } from '../../context/OcorrenciasContext';
import { ItemDetailsView } from './ItemDetailsView';
import { useFilters } from '../../context/FiltersContext';
import { AcoesTabContent } from './Acao/AcoesTabContent';
import { DenunciasTabContent } from './Denuncia/DenunciasTabContent';
import { useAddAcao } from '../../context/AddAcaoContext';
import { TabButtons } from './TabButtons';
import { useVincularDenunciaContext } from '../../context/vincularDenunciaContext';

export function SidePanel() {
  const [abaAtiva, setAbaAtiva] = useState<'denuncias' | 'acoes'>('denuncias');
  const { setNewDenunciaCoordinates, isAddingDenuncia, setIsAddingDenuncia } =
    useAddDenuncia();
  const { actualDetailItem } = useOcorrenciasContext();
  const { denunciasFiltradas, acoesFiltradas } = useFilters();
  const { isAddingAcao, setIsAddingAcao } = useAddAcao();
  const { denunciaParaVincular } = useVincularDenunciaContext();

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

          {!actualDetailItem && (
            <AddButton
              label={`Adicionar ${isAddingDenuncia ? 'Denúncia' : 'Ação'}`}
              isAdding={isAddingDenuncia || isAddingAcao}
              onClick={() => {
                if (abaAtiva === 'denuncias') {
                  setIsAddingDenuncia((current) => !current);
                } else {
                  setIsAddingAcao((current) => !current);
                }
              }}
            />
          )}
        </div>

        {actualDetailItem && !denunciaParaVincular && (
          <div className="p-4 overflow-y-auto custom-scrollbar-blue h-full">
            <ItemDetailsView />
          </div>
        )}

        {!actualDetailItem && !isAddingAcao && !isAddingDenuncia && (
          <TabButtons
            acoesAmount={acoesFiltradas.length}
            denunciasAmount={denunciasFiltradas.length}
            currentTab={abaAtiva}
            setCurrentTab={(tab) => setAbaAtiva(tab)}
          />
        )}

        {(!actualDetailItem || denunciaParaVincular) && (
          <div className="p-4 overflow-y-auto custom-scrollbar-blue">
            {abaAtiva === 'denuncias' ? (
              <DenunciasTabContent />
            ) : (
              <AcoesTabContent />
            )}
          </div>
        )}
      </aside>
    </>
  );
}
