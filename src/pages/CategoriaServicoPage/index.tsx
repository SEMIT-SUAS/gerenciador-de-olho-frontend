import { useEffect, useState } from 'react';
import { LayoutPage } from '../../components/LayoutPage';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from '@tabler/icons-react';

import { categoriaServicoService } from '@/services/categoriaServicoService';
import type {
  ServicoCategoria,
  createServicoCategoria,
  ServicoCategoriaEditar,
} from '@/types/CategoriaServico';
import { CategoriasServicosList } from '@/pages/CategoriaServicoPage/components/Categorialist';
import { AddCategoriaForm } from '@/pages/CategoriaServicoPage/components/CategoriaServicoForm/CategoriaForm';

export function CategoriasPage() {
  const [categorias, setCategorias] = useState<
    (ServicoCategoria & { id: number })[] | null
  >(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editCategoria, setEditCategoria] = useState<
    (ServicoCategoria & { id: number }) | null
  >(null);

  async function getAllCategoriasData() {
    try {
      // setLoading(true);
      const data = await categoriaServicoService.getAll();
      setCategorias(data);
    } catch (err: any) {
      // setError(err.message || 'Erro ao buscar as categorias.');
      toast.error(err.message || 'Erro ao buscar as categorias.');
    } finally {
      // setLoading(false);
    }
  }

  useEffect(() => {
    categoriaServicoService.getAll().then((categoriasData) => {
      if (categoriasData) {
        setCategorias(categoriasData);
      }
    });

    return () => {
      setCategorias(null);
    };
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

  const totalPages = Math.ceil(
    (filteredCategorias?.length ?? 0) / itemsPerPage,
  );

  const currentCategorias =
    filteredCategorias?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    ) || [];

  const itemsPerPageOptions = [8, 16, 24];

  return (
    <LayoutPage>
      <div className="flex flex-col gap-4 py-4 px-4 sm:gap-5 sm:py-6 sm:px-6 md:px-8 lg:px-12 xl:px-36">
        <div className="max-w-[640px]">
          <h2 className="text-3xl font-bold tracking-tight">Categorias</h2>
          <p className="text-slate-600 text-sm sm:text-xs mt-1">
            Gerencie as categorias disponíveis com clareza e objetividade.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-2">
          <div className="w-full sm:w-[280px] md:w-[320px]">
            <SearchInput
              placeholder="Pesquise por nome"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div>
            <Button
              className="w-full sm:w-auto"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar categoria
            </Button>
          </div>
        </div>

        <CategoriasServicosList
          itemsPerPage={itemsPerPage}
          categorias={currentCategorias}
          setCategorias={setCategorias}
          onEdit={setEditCategoria}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex text-sm text-gray-600">
              Linhas por página:
            </span>

            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-20 h-8">
                <SelectValue placeholder={itemsPerPage} />
              </SelectTrigger>
              <SelectContent>
                {itemsPerPageOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </span>

            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <IconChevronsLeft stroke={2} />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <IconChevronLeft stroke={2} />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <IconChevronRight />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <IconChevronsRight stroke={2} />
              </Button>
            </div>
          </div>
        </div>
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
