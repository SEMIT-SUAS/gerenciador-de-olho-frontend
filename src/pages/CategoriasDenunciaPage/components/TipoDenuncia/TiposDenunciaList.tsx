import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { TipoDenunciaModel } from '@/types/TipoDenuncia';
import type { Dispatch, SetStateAction } from 'react';
import { TiposDenunciaListItem } from './TiposDenunciaListItem';

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
          {tipos.map((tipo) => (
            <TiposDenunciaListItem
              key={tipo.id}
              tipo={tipo}
              setTipos={setTipos}
              onEdit={onEdit}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
