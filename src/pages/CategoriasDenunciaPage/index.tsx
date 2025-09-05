import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PlusIcon, Loader2 } from 'lucide-react';
import type { CategoriaDenunciaModel } from '@/types/CategoriaDenuncia';
import type { TipoDenunciaModel } from '@/types/TipoDenuncia';
import type { Secretaria } from '@/types/Secretaria';
import { CategoriaDenunciaService } from '@/services/CategoriaDenunciaService';
import { TipoDenunciaService } from '@/services/tiposDenunciaService';
import { secretariaService } from '@/services/secretariaService';
import { LayoutPage } from '../../components/LayoutPage';
import { SearchInput } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/Pagination';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoriasDenunciaList } from './components/CategoriaDenuncia/CategoriasDenunciaList';
import { TiposDenunciaList } from './components/TipoDenuncia/TiposDenunciaList';
import { AddCategoriaModal } from './components/CategoriaDenuncia/AddCategoriaModal';
import { AddTipoDenunciaModal } from './components/TipoDenuncia/AddTipoDenunciaModal';
import { EditTipoDenunciaModal } from './components/TipoDenuncia/EditTipoDenunciaModal';
import PageHeader from '@/components/PageHeader';

export function DenunciaCategoriasPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get('tab') || 'categorias';

  const [categorias, setCategorias] = useState<CategoriaDenunciaModel[]>([]);
  const [tipos, setTipos] = useState<TipoDenunciaModel[]>([]);
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);

  const [isOpenAddCategoriaModal, setIsOpenAddCategoriaModal] = useState(false);
  const [IsOpenAddTipoModal, setIsOpenAddTipoModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [tipoParaEditar, setTipoParaEditar] =
    useState<TipoDenunciaModel | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPageOptions = [5, 10, 15];
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);

  const loadDenunciaCategories = useCallback(async () => {
    try {
      const categoriesData = await new CategoriaDenunciaService().getAll();
      setCategorias(categoriesData);
    } catch (error: any) {
      setError('Falha ao carregar as categorias.');
      toast.error(error.message);
    }
  }, [categorias])

  const loadDenunciaTipos = useCallback(async () => {
    try {
      const tiposData = await new TipoDenunciaService().getAll();
      setTipos(tiposData);
    } catch (error: any) {
      setError('Falha ao carregar os tipos de denúncia.');
      toast.error(error.message);
    }
  }, [tipos])

  const loadSecretarias = useCallback(async () => {
    try {
      const data = await secretariaService.getAll();
      setSecretarias(data);
    } catch (error: any) {
      toast.error('Falha ao carregar as secretarias.');
    }
  }, []);

  // Efeito para carregar todos os dados iniciais de uma vez
  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      setError(null);
      await Promise.all([
        loadDenunciaCategories(),
        loadDenunciaTipos(),
        loadSecretarias(),
      ]);
      setIsLoading(false);
    }
    loadInitialData();
  }, []);

  // Efeito para garantir que a aba na URL seja sempre válida
  useEffect(() => {
    const tabFromUrl = queryParams.get('tab');
    if (!tabFromUrl || !['categorias', 'tipos'].includes(tabFromUrl)) {
      navigate(`${location.pathname}?tab=categorias`, { replace: true });
    }
  }, [location.search, location.pathname, navigate, queryParams]);

  // Handlers de eventos da UI
  const handleTabChange = (newTab: string) => {
    navigate(`${location.pathname}?tab=${newTab}`);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleOpenEditModal = (tipo: TipoDenunciaModel) => {
    setTipoParaEditar(tipo);
    setIsOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setIsOpenEditModal(false);
    setTipoParaEditar(null);
  };

  const filteredCategorias = categorias?.filter((categoria) =>
    categoria.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredTipos =
    tipos?.filter((tipo) =>
      tipo.nome.toLowerCase().includes(searchTerm.toLowerCase()),
    ) ?? [];

  const activeList =
    activeTab === 'categorias' ? filteredCategorias : filteredTipos;
  const totalPages = Math.ceil((activeList.length ?? 0) / itemsPerPage);

  const currentCategorias = filteredCategorias.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const currentTipos = filteredTipos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
          <span className="ml-2 text-slate-500">Carregando dados...</span>
        </div>
      );
    }

    if (activeList.length === 0) {
      return (
        <div className="text-center h-64 flex justify-center items-center">
          <p className="text-slate-500">
            {searchTerm
              ? `Nenhum resultado encontrado para "${searchTerm}".`
              : `Nenhum(a) ${activeTab} cadastrado(a) no momento.`}
          </p>
        </div>
      );
    }

    return activeTab === 'categorias' ? (
      <CategoriasDenunciaList
        categories={currentCategorias}
        setCategories={setCategorias}
        itemsPerPage={itemsPerPage}
      />
    ) : (
      <TiposDenunciaList
        tipos={currentTipos}
        setTipos={setTipos}
        onEdit={handleOpenEditModal}
      />
    );
  };

  return (
    <>
      <LayoutPage>
        <div className="flex flex-col gap-6 px-4 py-8 lg:px-36">
          <PageHeader
            title={
              activeTab === 'categorias'
                ? 'Categorias de denúncia'
                : 'Tipos de denúncia'
            }
            description="Gerencie as categorias e tipos de denúncia disponíveis no sistema, mantendo registros completos, atualizados e acessíveis a qualquer momento."
          />
          <div className="flex flex-col items-stretch gap-6 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-auto">
              <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full md:w-[400px]"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="categorias">Categorias</TabsTrigger>
                  <TabsTrigger value="tipos">Tipos</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <SearchInput
                className="w-full"
                placeholder="Pesquise pelo nome"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <Button
                className="flex items-center justify-center gap-2"
                onClick={() => {
                  activeTab === 'categorias'
                    ? setIsOpenAddCategoriaModal(true)
                    : setIsOpenAddTipoModal(true);
                }}
              >
                <PlusIcon className="h-4 w-4" />
                {activeTab === 'categorias'
                  ? 'Adicionar Categoria'
                  : 'Adicionar Tipo'}
              </Button>
            </div>
          </div>

          <div className="min-h-[300px]">{renderContent()}</div>

          {!isLoading && !error && activeList.length > 0 && (
            <Pagination
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              itemsPerPageOptions={itemsPerPageOptions}
            />
          )}
        </div>
      </LayoutPage>

      <AddCategoriaModal
        isOpen={isOpenAddCategoriaModal}
        onClose={() => setIsOpenAddCategoriaModal(false)}
        setCategorias={setCategorias}
        reloadCategoriestList={loadDenunciaCategories}
      />
      <AddTipoDenunciaModal
        open={IsOpenAddTipoModal}
        onOpenChange={setIsOpenAddTipoModal}
        secretarias={secretarias}
        categorias={categorias}
        setTipos={setTipos}
        reloadTipos={loadDenunciaTipos}
      />
      {tipoParaEditar && (
        <EditTipoDenunciaModal
          open={isOpenEditModal}
          onOpenChange={handleCloseEditModal}
          secretarias={secretarias}
          categorias={categorias}
          setTipos={setTipos}
          tipoParaEditar={tipoParaEditar}
        />
      )}
    </>
  );
}
