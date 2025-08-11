import { useEffect, useState } from 'react';
import { type CategoriaDenunciaModel } from '@/types/CategoriaDenuncia';
import categoriaService from '@/services/categoriaService';
import { toast } from 'sonner';
import { LayoutPage } from './LayoutPage';
import { SearchInput } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Pagination } from '@/components/Pagination';
import { CategoriasList } from '@/components/Categorias/CategoriasList';
import { AddCategoriaModal } from '@/components/Categorias/Modals/AddCategoriaModal';

export function DenunciaCategoriasPage() {
  const [categorias, setCategorias] = useState<CategoriaDenunciaModel[] | null>(
    null,
  );

  const [isOpenAddCategoriaModal, setIsOpenAddCategoriaModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPageOptions = [5, 10, 15];
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);

  useEffect(() => {
    categoriaService
      .getAll()
      .then((data) => {
        setCategorias(data);
      })
      .catch((error: any) => toast.error(error.message));
  }, []);

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

  return (
    <>
      <LayoutPage additionalStyles="px-[39px]">
        <div className="flex flex-col gap-6 py-8 px-36">
          <div className="w-[50%]">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Categorias de denúncia
            </h3>
            <p className="text-slate-600 text-xs">
              Gerencie com precisão todas as categorias de uma denúncia.
            </p>
          </div>

          <div className="flex items-center justify-end gap-4">
            <div className="relative w-[320px]">
              <SearchInput
                placeholder="Pesquise pelo nome"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <Button
              className="flex items-center gap-2"
              onClick={() => setIsOpenAddCategoriaModal(true)}
            >
              <PlusIcon className="h-4 w-4" />
              Adicionar categoria
            </Button>
          </div>

          <CategoriasList
            itemsPerPage={itemsPerPage}
            categories={currentCategorias}
            setCategories={setCategorias}
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
      </LayoutPage>

      <AddCategoriaModal
        isOpen={isOpenAddCategoriaModal}
        onClose={() => setIsOpenAddCategoriaModal(false)}
        setCategorias={setCategorias}
      />
    </>
  );
}
