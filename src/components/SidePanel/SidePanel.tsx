/* import { useState, useEffect, useContext } from 'react';
import type { Denuncia } from '../../types/Denuncia';
import type { Acao } from '../../types/Acao';
import { ItemDetailsView } from './ItemDetailsView';
import { DenunciasList } from './DenunciasList';
import { AcoesList } from './AcoesList';
import { VincularAcaoView } from './VincularAcaoView';
import { useVincularDenunciaContext } from '../../context/vincularDenunciaContext';
import { IoIosAdd, IoIosClose } from 'react-icons/io';
import { AddDenunciaForm } from '../Forms/AddDenunciaForm';
import { AddDenunciaContext } from '../../context/AddDenunciaContext';
import { IndeferirDenunciaView } from './IndeferidoStatusView';
import { useIndeferirDenunciaContext } from '../../context/IndeferirDenunciaContext';
import type { ZoomToProps } from '../../pages/OcorrenciasPage';
import { useOcorrenciasContext } from '../../context/ocorrenciasContext';
import { FilterStatusSelect } from './Filters/FilterStatusSelect';
import { SelectCategoriaFilter } from './Filters/SelectCategoriaFilter';
import { SelectSecretariaFilter } from './Filters/SelectSecretariaFilter';
import { useFilters } from '../../context/FiltersContext';

interface SidePanelProps {
  denuncias: Denuncia[];
  acoes: Acao[];
  modoSelecao: boolean;
  denunciasSelecionadasCount: number;
  onItemClick: (item: Denuncia | Acao, zoomToData: ZoomToProps) => void;
  detailViewItem: Denuncia | Acao | null;
  onBackToList: () => void;
  setDenuncias: React.Dispatch<React.SetStateAction<Denuncia[]>>;
}

export function SidePanel({
  acoes,
  denuncias,
  modoSelecao,
  onItemClick,
  onBackToList,
  setDenuncias,
}: SidePanelProps) {
  const [abaAtiva, setAbaAtiva] = useState<'denuncias' | 'acoes'>('denuncias');
  const { denunciaParaVincular } = useVincularDenunciaContext();
  const [isAddingDenuncia, setIsAddingDenuncia] = useState(false);
  const { setNewDenunciaCoordinates } = useContext(AddDenunciaContext);
  const { denunciaParaIndeferir } = useIndeferirDenunciaContext();
  const { actualDetailItem } = useOcorrenciasContext();

  const {
    filtroStatusDenuncia,
    filtroStatusAcao,
    setFiltroStatusDenuncia,
    setFiltroStatusAcao,
    setFiltroCategoria,
    setFiltroSecretaria,
  } = useFilters();

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
          {isAddingDenuncia ? (
            <button
              onClick={() => setIsAddingDenuncia(false)}
              aria-label="Cancelar"
              className="p-1 rounded-full bg-red-600 cursor-pointer"
            >
              <IoIosClose size={36} color="white" />
            </button>
          ) : (
            <button
              onClick={() => setIsAddingDenuncia(true)}
              aria-label="Adicionar denúncia"
              className="p-1 rounded-full bg-blue-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={modoSelecao}
            >
              <IoIosAdd size={36} color="white" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar-blue">
          {denunciaParaVincular ? (
            <VincularAcaoView />
          ) : denunciaParaIndeferir ? (
            <IndeferirDenunciaView />
          ) : actualDetailItem ? (
            <ItemDetailsView
              item={actualDetailItem}
              denuncias={denuncias}
              onBack={onBackToList}
              onDenunciaClick={onItemClick}
            />
          ) : isAddingDenuncia ? (
            <AddDenunciaForm
              setIsAddingDenuncia={setIsAddingDenuncia}
              setDenuncias={setDenuncias}
            />
          ) : (
            <>
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
                    Denúncias ({denuncias.length})
                  </button>
                  <button
                    onClick={() => setAbaAtiva('acoes')}
                    className={`flex-1 p-4 text-center font-medium ${
                      abaAtiva === 'acoes'
                        ? 'text-green-600 border-b-2 border-green-600'
                        : 'text-gray-500'
                    }`}
                  >
                    Ações ({acoes.length})
                  </button>
                </nav>
              </div>

              <div className="grid grid-cols-2 gap-1 pt-4 px-4">
                <FilterStatusSelect
                  id="status-filter-select"
                  label="Status"
                  onStatusChange={(status) =>
                    abaAtiva === 'denuncias'
                      ? setFiltroStatusDenuncia(status)
                      : setFiltroStatusAcao(status)
                  }
                  value={
                    abaAtiva == 'denuncias'
                      ? filtroStatusDenuncia
                      : filtroStatusAcao
                  }
                />

                {abaAtiva === 'denuncias' ? (
                  <SelectCategoriaFilter
                    onCategoriaChange={(categoria) =>
                      setFiltroCategoria(categoria)
                    }
                  />
                ) : (
                  <SelectSecretariaFilter
                    onSecretariaChange={(secretaria) =>
                      setFiltroSecretaria(secretaria)
                    }
                  />
                )}
              </div>

              <div className="p-4 space-y-3">
                {modoSelecao && (
                  <div className="p-3 bg-blue-100 border-blue-300 text-blue-800 rounded-lg text-center font-semibold">
                    Modo de Seleção Ativo: Clique nos pinos no mapa.
                  </div>
                )}

                {abaAtiva == 'denuncias' ? (
                  <DenunciasList
                    denuncias={denuncias}
                    onItemClick={onItemClick}
                  />
                ) : (
                  <AcoesList acoes={acoes} onItemClick={onItemClick} />
                )}
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
 */