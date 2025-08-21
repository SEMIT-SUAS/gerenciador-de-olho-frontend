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
import { RenderIf } from '@/components/RenderIf';
import { ImageSkeleton } from '@/components/Loading/ImageSkeleton';
import { ListItemSkeleton } from '@/components/Loading/ListItemSkeleton';
import { IconCategory } from '@tabler/icons-react';

interface CategoriasServicosListProps {
  categorias: (ServicoCategoria & { id: number })[] | null;
  setCategorias: Dispatch<
    SetStateAction<(ServicoCategoria & { id: number })[] | null>
  >;
  onEdit: (categoria: ServicoCategoria & { id: number }) => void;
  itemsPerPage: number;
}

export function CategoriasServicosList({
  categorias,
  setCategorias,
  onEdit,
  itemsPerPage,
}: CategoriasServicosListProps) {
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

        <TableBody>
          {categorias ? (
            <RenderIf
              condition={categorias.length > 0}
              ifRender={categorias.map((categoria) => (
                <CategoriaListItem
                  key={categoria.id}
                  categoria={categoria}
                  setCategorias={setCategorias}
                  onEdit={onEdit}
                />
              ))}
              elseRender={
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
              }
            />
          ) : (
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
