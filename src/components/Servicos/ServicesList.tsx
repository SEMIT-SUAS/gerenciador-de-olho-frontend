import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ServicosListar } from '@/types/ServicosListar';
import type { Dispatch, SetStateAction } from 'react';
import { ServicesListItem } from './ServicesListItem';

interface ServicesListProps {
  servicos: ServicosListar[];
  setServicos: Dispatch<SetStateAction<ServicosListar[]>>;
}

export function ServicesList({ servicos, setServicos }: ServicesListProps) {
  return (
    <>
      <Table className="rounded-md overflow-hidden border-2 border-gray-500 shadow-lg">
        <TableHeader>
          <TableRow>
            <TableHead> Nome </TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Persona</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.isArray(servicos) &&
            servicos.map((servico) => (
              <ServicesListItem
                key={servico.id}
                servico={servico}
                setServicos={setServicos}
              />
            ))}
        </TableBody>
      </Table>
    </>
  );
}
