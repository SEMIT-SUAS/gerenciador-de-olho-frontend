import type { ServicoExterno } from '@/types/ServicoExterno';
import type { Dispatch, SetStateAction } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { ServicesExternoListItem } from './ServicesExternoListItem';
import { RenderIf } from '@/components/RenderIf';
import { ImageSkeleton } from '@/components/Loading/ImageSkeleton';
import { ListItemSkeleton } from '@/components/Loading/ListItemSkeleton';
import { IconExternalLink } from '@tabler/icons-react';

interface ServicosExternosListProps {
  setServicos: Dispatch<SetStateAction<ServicoExterno[] | null>>;
  servicos: ServicoExterno[] | null;
  itemsPerPage: number;
}

export function ServicosExternosList({
  servicos,
  setServicos,
  itemsPerPage,
}: ServicosExternosListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Imagem</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Link</TableHead>
            <TableHead className="w-[10%]">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {servicos ? (
            <RenderIf
              condition={servicos.length > 0}
              ifRender={servicos
                .filter((s) => s.ativo)
                .map((servico) => (
                  <ServicesExternoListItem
                    key={servico.id}
                    servico={servico}
                    setServicos={setServicos}
                  />
                ))}
              elseRender={
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <IconExternalLink className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto" />
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Nenhum serviço externo encontrado
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
                    <ImageSkeleton height={56} width={56} className="rounded" />
                  </div>
                </TableCell>

                <TableCell className="border-r">
                  <div className="flex flex-col gap-2">
                    <ListItemSkeleton
                      titleWidth="3/4"
                      className="p-0 border-0"
                    />
                    <div className="flex gap-2">
                      <ImageSkeleton
                        height={16}
                        width={40}
                        className="rounded"
                      />
                      <ImageSkeleton
                        height={16}
                        width={30}
                        className="rounded"
                      />
                    </div>
                  </div>
                </TableCell>

                <TableCell className="border-r">
                  <ListItemSkeleton titleWidth="1/2" className="p-0 border-0" />
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
