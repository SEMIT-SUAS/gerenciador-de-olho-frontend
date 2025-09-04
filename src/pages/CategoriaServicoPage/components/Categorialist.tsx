import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ServicoCategoria } from '@/types/CategoriaServico';
import type { Dispatch, SetStateAction } from 'react';
import { CategoriaListItem } from './CategoriaItem';
import { ImageSkeleton } from '@/components/Loading/ImageSkeleton';
import { ListItemSkeleton } from '@/components/Loading/ListItemSkeleton';
import { IconCategory } from '@tabler/icons-react';
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { toast } from 'sonner';
import { CategoriaServicoService } from '@/services/categoriaServicoService';

interface CategoriasServicosListProps {
  categorias: (ServicoCategoria & { id: number })[] | null;
  setCategorias: Dispatch<
    SetStateAction<(ServicoCategoria & { id: number })[] | null>
  >;
  onEdit: (categoria: ServicoCategoria & { id: number }) => void;
  itemsPerPage: number;
  reloadCategorias: () => void
}

export function CategoriasServicosList({
  categorias,
  setCategorias,
  onEdit,
  itemsPerPage,
}: CategoriasServicosListProps) {
  async function handleDragEnd(result: any) {
    if (!result.destination || !categorias) {
      return;
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) {
      return;
    }

    const originalCategorias = [...categorias];
    const items = Array.from(categorias);

    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, reorderedItem);

    const categoriaId = Number(result.dragglableId)

    try {
      await new CategoriaServicoService().toggleOrdenacao(
        categoriaId,
        destinationIndex,
      );
    } catch (error: any) {
      toast.error('Não foi possível salvar a nova ordem. Tente novamente.');
      setCategorias(originalCategorias);
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ícone</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead className="w-[10%]">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="categorias-list">
            {(provided) => (
              <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                {!categorias &&
                  Array.from({ length: itemsPerPage }).map((_, idx) => (
                    <TableRow key={`skeleton-${idx}`}>
                      <TableCell className="border-r">
                        <div className="flex items-center justify-center">
                          <ImageSkeleton height={24} width={24} className="rounded" />
                        </div>
                      </TableCell>
                      <TableCell className="border-r">
                        <ListItemSkeleton titleWidth="3/4" className="p-0 border-0" />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <ImageSkeleton
                            height={24}
                            width={24}
                            className="rounded-full"
                          />
                          <ImageSkeleton
                            height={24}
                            width={24}
                            className="rounded-full"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                {categorias && categorias.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="py-8 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <IconCategory className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto" />
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Nenhuma categoria encontrada
                        </h3>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {categorias &&
                  categorias.map((categoria) => (
                    <CategoriaListItem
                      key={categoria.id}
                      categoria={categoria}
                      setCategorias={setCategorias}
                      onEdit={onEdit}
                    />
                  ))}
                {provided.placeholder}
              </TableBody>
            )}
          </Droppable>
        </DragDropContext>
      </Table>
    </div>
  );
}
