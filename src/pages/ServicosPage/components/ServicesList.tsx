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
          {Array.isArray(servicos) &&
            servicos
              .filter((s) => s.ativo) // <-- Adicione esta linha
              .map((servico) => (
                <ServicesListItem
                  key={servico.id}
                  servico={servico}
                  setServicos={setServicos}
                />
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
