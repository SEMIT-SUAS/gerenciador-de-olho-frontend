import { useEffect, useState } from 'react';
import { type CategoriaDenunciaModel } from '@/types/CategoriaDenuncia';
import categoriaService from '@/services/categoriaService';
import { toast } from 'sonner';
import { LayoutPage } from '../../components/LayoutPage';
import { SearchInput } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Pagination } from '@/components/Pagination';
import { CategoriasDenunciaList } from './components/CategoriaDenuncia/CategoriasDenunciaList';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import tiposDenunciaService from '@/services/tiposDenunciaService';
import type { TipoDenunciaModel } from '@/types/TipoDenuncia';
import { TiposDenunciaList } from './components/TipoDenuncia/TiposDenunciaList';
import secretariaService from '@/services/secretariaService';
import type { Secretaria } from '@/types/Secretaria';
import { AddTipoDenunciaModal } from './components/TipoDenuncia/AddTipoDenunciaModal';
import { EditTipoDenunciaModal } from './components/TipoDenuncia/EditTipoDenunciaModal';
import { AddCategoriaModal } from './components/CategoriaDenuncia/AddCategoriaModal';

export function DenunciaCategoriasPage() {
  const [categorias, setCategorias] = useState<CategoriaDenunciaModel[] | null>(
    null,
  );
  const [tipos, setTipos] = useState<TipoDenunciaModel[]>([]);
  const [activeTab, setActiveTab] = useState('categorias');

  const [isOpenAddCategoriaModal, setIsOpenAddCategoriaModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPageOptions = [5, 10, 15];
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
  const [IsOpenAddTipoModal, setIsOpenAddTipoModal] = useState(false);
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [tipoParaEditar, setTipoParaEditar] =
    useState<TipoDenunciaModel | null>(null);

  const handleOpenEditModal = (tipo: TipoDenunciaModel) => {
    setTipoParaEditar(tipo);
    setIsOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setIsOpenEditModal(false);
    setTipoParaEditar(null);
  };

  useEffect(() => {
    tiposDenunciaService
      .getAllTiposDenuncia()
      .then((data) => {
        setTipos(data);
      })
      .catch((error: any) => toast.error(error.message));

    categoriaService
      .getAll()
      .then((data) => {
        setCategorias(data);
      })
      .catch((error: any) => toast.error(error.message));

    secretariaService
      .getAllSecretarias()
      .then((data) => {
        setSecretarias(data);
      })
      .catch((error: any) => toast.error(error.message));
  }, []);

  const filteredCategorias = categorias?.filter((categoria) =>
    categoria.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredTipos = tipos.filter((tipo) =>
    tipo.nome.toLowerCase().includes(searchTerm.toLocaleLowerCase()),
  );

  const activeList =
    activeTab === 'categorias' ? filteredCategorias : filteredTipos;

  const totalPages = Math.ceil((activeList?.length ?? 0) / itemsPerPage);

  const currentCategorias =
    filteredCategorias?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    ) || [];

  const currentTipos =
    filteredTipos.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    ) || [];

  return (
    <>
      <LayoutPage>
        <div className="flex flex-col gap-6 py-8 px-36">
          <div className="w-[50%]">
            {activeTab === 'categorias' ? (
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Categorias de denúncia
              </h3>
            ) : (
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Tipos de denúncia
              </h3>
            )}

            <p className="text-slate-600 text-xs">
              Gerencie com precisão todas as categorias de uma denúncia.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="relative w-[320px]">
              <Tabs
                defaultValue=""
                value={activeTab}
                onValueChange={(value) => {
                  setActiveTab(value);
                }}
                className="w-[400px]"
              >
                <TabsList>
                  <TabsTrigger value="categorias">Categorias</TabsTrigger>
                  <TabsTrigger value="tipos">Tipos</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex gap-2">
              <SearchInput
                className="max-w-[320px]"
                placeholder="Pesquise pelo nome"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <Button
                className="flex items-center gap-2"
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

          {activeTab === 'categorias' ? (
            <CategoriasDenunciaList
              itemsPerPage={itemsPerPage}
              categories={currentCategorias}
              setCategories={setCategorias}
            />
          ) : (
            <TiposDenunciaList
              tipos={currentTipos}
              setTipos={setTipos}
              onEdit={handleOpenEditModal}
            />
          )}

          <Pagination
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            itemsPerPageOptions={itemsPerPageOptions}
          />
        </div>
      </LayoutPage>

      <AddCategoriaModal
        isOpen={isOpenAddCategoriaModal}
        onClose={() => setIsOpenAddCategoriaModal(false)}
        setCategorias={setCategorias}
      />

      <AddTipoDenunciaModal
        open={IsOpenAddTipoModal}
        onOpenChange={() => setIsOpenAddTipoModal(!open)}
        secretarias={secretarias}
        categorias={categorias!}
        setTipos={setTipos}
      />

      {tipoParaEditar && (
        <EditTipoDenunciaModal
          open={isOpenEditModal}
          onOpenChange={handleCloseEditModal} // Use a função que limpa o estado
          secretarias={secretarias}
          categorias={categorias!}
          setTipos={setTipos}
          tipoParaEditar={tipoParaEditar} // <-- PROP NOVA COM OS DADOS
        />
      )}
    </>
  );
}
