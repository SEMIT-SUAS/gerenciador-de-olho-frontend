import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ServicosListar } from '@/types/ServicosListar';
import type { Dispatch, SetStateAction } from 'react';
import { ServicesListItem } from './ServicesListItem';
import { RenderIf } from '@/components/RenderIf';
import { IconBriefcase } from '@tabler/icons-react';
import { ImageSkeleton } from '@/components/Loading/ImageSkeleton';
import { ListItemSkeleton } from '@/components/Loading/ListItemSkeleton';

interface ServicesListProps {
  servicos: ServicosListar[] | null;
  setServicos: Dispatch<SetStateAction<ServicosListar[] | null>>;
  itemsPerPage: number;
}

export function ServicesList({
  servicos,
  setServicos,
  itemsPerPage,
}: ServicesListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Persona</TableHead>
            <TableHead className="w-[10%]">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {servicos ? (
            <RenderIf
              condition={servicos.length > 0}
              ifRender={servicos
                .filter((servico) => servico.ativo)
                .map((servico) => (
                  <ServicesListItem
                    key={servico.id}
                    servico={servico}
                    setServicos={setServicos}
                  />
                ))}
              elseRender={
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <IconBriefcase className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto" />
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Nenhum serviço encontrado
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
                  <div className="flex gap-2">
                    <ImageSkeleton
                      height={20}
                      width={60}
                      className="rounded-full"
                    />
                    <ImageSkeleton
                      height={20}
                      width={60}
                      className="rounded-full"
                    />
                  </div>
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
