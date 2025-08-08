import type { ServicoExterno } from '@/types/ServicoExterno';
import type { Dispatch, SetStateAction } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { ServicesExternoListItem } from './ServicesExternoListItem';

interface ServicosExternosListProps {
  setServicos: Dispatch<SetStateAction<ServicoExterno[]>>;
  servicos: ServicoExterno[];
}

export function ServicosExternosList({
  servicos,
  setServicos,
}: ServicosExternosListProps) {
  return (
    <Table className="rounded-md overflow-hidden border-2 border-gray-500 shadow-lg">
      <TableHeader>
        <TableRow>
          <TableHead>Imagem</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Link</TableHead>
          <TableHead className="w-[10%]">Ações</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {Array.isArray(servicos) &&
          servicos
            .filter((s) => s.ativo)
            .map((servico) => (
              <ServicesExternoListItem
                key={servico.id}
                servico={servico}
                setServicos={setServicos}
              />
            ))}
      </TableBody>
    </Table>
  );
}
