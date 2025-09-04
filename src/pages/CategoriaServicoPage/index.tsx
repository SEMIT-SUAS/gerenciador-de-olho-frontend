import { useEffect, useState } from 'react';
import { LayoutPage } from '../../components/LayoutPage';
import { toast } from 'sonner';
import { categoriaServicoService } from '@/services/categoriaServicoService';
import type {
  ServicoCategoria,
  createServicoCategoria,
  ServicoCategoriaEditar,
} from '@/types/CategoriaServico';
import { CategoriasServicosList } from '@/pages/CategoriaServicoPage/components/Categorialist';
import { AddCategoriaForm } from '@/pages/CategoriaServicoPage/components/CategoriaServicoForm/CategoriaForm';
import PageHeader from '@/components/PageHeader';
import { TableHeaderActions } from '@/components/TableHeaderActions';
import { Pagination } from '@/components/Pagination';

export function CategoriasPage() {
  const [categorias, setCategorias] = useState<
    (ServicoCategoria & { id: number })[] | null
  >(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editCategoria, setEditCategoria] = useState<
    (ServicoCategoria & { id: number }) | null
  >(null);

  async function loadCategorias() {
    try {
      const categoriasData = await categoriaServicoService.getAll();
      setCategorias(categoriasData)
    } catch (error: any) {
      toast.error(error.message || 'Erro ao buscar as categorias.');
    }
  }

  useEffect(() => {
    loadCategorias()
  }, []);

  const handleSubmitCategoria = async (
    data: createServicoCategoria | (ServicoCategoriaEditar & { id: number }),
  ) => {
    try {
      if ('id' in data && data.id) {
        await categoriaServicoService.update(
          data as ServicoCategoriaEditar & { id: number },
        );
        toast.success('Categoria editada com sucesso!');
        setEditCategoria(null);
      } else {
        // Se não tem id, é criação
        await categoriaServicoService.create(data as createServicoCategoria);
        toast.success('Categoria criada com sucesso!');
        setShowCreateModal(false);
      }

      const newData = await categoriaServicoService.getAll();
      if (newData) {
        setCategorias(newData);
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar categoria');
    }
  };

  const filteredCategorias = categorias?.filter((categoria) =>
    categoria.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(
    (filteredCategorias?.length ?? 0) / itemsPerPage,
  );

  const currentCategorias =
    filteredCategorias?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    ) || [];

  const itemsPerPageOptions = [5, 10, 15, 20];

  return (
    <LayoutPage>
      <div className="flex flex-col gap-4 py-4 px-4 sm:gap-5 sm:py-6 sm:px-6 md:px-8 lg:px-12 xl:px-36">
        <PageHeader
          title="Categorias"
          description="Gerencie todas as categorias disponíveis no sistema, garantindo informações sempre organizadas e acessíveis."
        />
        <TableHeaderActions
          searchValue={searchTerm}
          onSearchChange={handleSearch}
          buttonText="Adicionar Categoria"
          onButtonClick={() => setShowCreateModal(true)}
        />
        <CategoriasServicosList
          itemsPerPage={itemsPerPage}
          categorias={currentCategorias}
          setCategorias={setCategorias}
          onEdit={setEditCategoria}
          reloadCategorias={loadCategorias}
        />

        <Pagination
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          itemsPerPageOptions={itemsPerPageOptions}
        />
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <AddCategoriaForm
              mode="create"
              onSubmit={handleSubmitCategoria}
              onCancel={() => setShowCreateModal(false)}
            />
          </div>
        </div>
      )}

      {editCategoria && (
        <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[60vh] overflow-y-auto">
            <AddCategoriaForm
              mode="edit"
              defaultValues={{
                id: editCategoria.id,
                nome: editCategoria.nome,
                icone: editCategoria.icone,
                ativo: editCategoria.ativo,
                visivel: editCategoria.visivel,
              }}
              onSubmit={handleSubmitCategoria}
              onCancel={() => setEditCategoria(null)}
            />
          </div>
        </div>
      )}
    </LayoutPage>
  );
}
