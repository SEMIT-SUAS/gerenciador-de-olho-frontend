import { type Dispatch, type SetStateAction } from 'react';
import type { Portais } from '@/types/Portais';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PortaisListItem } from './PortaisListItem';
import { ImageSkeleton } from '@/components/Loading/ImageSkeleton';
import { ListItemSkeleton } from '@/components/Loading/ListItemSkeleton';
import { IconWorld } from '@tabler/icons-react';
import { RenderIf } from '@/components/RenderIf';

interface PortaisListProps {
  portais: Portais[] | null;
  setPortais: Dispatch<SetStateAction<Portais[] | null>>;
  itemsPerPage: number;
}

export function PortaisList({
  portais,
  setPortais,
  itemsPerPage,
}: PortaisListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Destaque</TableHead>
            <TableHead className="w-[10%]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {portais ? (
            <RenderIf
              condition={portais.length > 0}
              ifRender={portais
                .filter((p) => p.ativo)
                .map((portal) => (
                  <PortaisListItem
                    key={portal.id}
                    portal={portal}
                    setPortais={setPortais}
                  />
                ))}
              elseRender={
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <IconWorld className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto" />
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Nenhum portal encontrado
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
                  <ListItemSkeleton titleWidth="3/4" className="p-0 border-0" />
                </TableCell>

                <TableCell className="border-r">
                  <ListItemSkeleton titleWidth="1/2" className="p-0 border-0" />
                </TableCell>

                <TableCell className="border-r">
                  <ImageSkeleton
                    height={20}
                    width={60}
                    className="rounded-full"
                  />
                </TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    <ImageSkeleton
                      height={18}
                      width={18}
                      className="rounded-full"
                    />
                    <ImageSkeleton
                      height={18}
                      width={18}
                      className="rounded-full"
                    />
                    <ImageSkeleton
                      height={18}
                      width={18}
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
