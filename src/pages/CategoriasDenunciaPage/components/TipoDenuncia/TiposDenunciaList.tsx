import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { TipoDenunciaModel } from '@/types/TipoDenuncia';
import type { Dispatch, SetStateAction } from 'react';
import { TiposDenunciaListItem } from './TiposDenunciaListItem';
import { RenderIf } from '@/components/RenderIf';
import { IconCategoryFilled } from '@tabler/icons-react';
import { ImageSkeleton } from '@/components/Loading/ImageSkeleton';
import { ListItemSkeleton } from '@/components/Loading/ListItemSkeleton';

interface TiposDenunciaListProps {
  tipos: TipoDenunciaModel[];
  setTipos: Dispatch<SetStateAction<TipoDenunciaModel[]>>;
  onEdit: (tipo: TipoDenunciaModel) => void;
}

export function TiposDenunciaList({
  tipos,
  setTipos,
  onEdit,
}: TiposDenunciaListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ícone</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="w-[10%]">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tipos ? (
            <RenderIf
              condition={tipos.length > 0}
              ifRender={tipos?.map((tipo) => (
                <TiposDenunciaListItem
                  key={tipo.id}
                  tipo={tipo}
                  setTipos={setTipos}
                  onEdit={onEdit}
                />
              ))}
              elseRender={
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <IconCategoryFilled className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto" />
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Nenhuma categoria encontrada
                      </h3>
                    </div>
                  </TableCell>
                </TableRow>
              }
            />
          ) : (
            Array.from({ length: 5 }).map((_, idx) => (
              <TableRow key={`skeleton-${idx}`}>
                <TableCell className="border-r">
                  <div className="flex items-center gap-3">
                    <ImageSkeleton height={40} width={40} className="rounded" />
                    <ListItemSkeleton
                      titleWidth="20"
                      className="p-0 border-0"
                    />
                  </div>
                </TableCell>

                <TableCell className="border-r">
                  <ListItemSkeleton titleWidth="3/4" className="p-0 border-0" />
                </TableCell>

                <TableCell className="border-r">
                  <ListItemSkeleton titleWidth="1/2" className="p-0 border-0" />
                </TableCell>

                <TableCell>
                  <div className="flex gap-4">
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
