import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ServicoCategoria } from '@/types/CategoriaServico';
import type { Dispatch, SetStateAction } from 'react';
import { CategoriaListItem } from './CategoriaItem';

interface CategoriasServicosListProps {
  categorias: (ServicoCategoria & { id: number })[];
  setCategorias: Dispatch<
    SetStateAction<(ServicoCategoria & { id: number })[]>
  >;
  onEdit: (categoria: ServicoCategoria & { id: number }) => void;
}

export function CategoriasServicosList({
  categorias,
  setCategorias,
  onEdit,
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
          {Array.isArray(categorias) &&
            categorias.map((categoria) => (
              <CategoriaListItem
                key={categoria.id}
                categoria={categoria}
                setCategorias={setCategorias}
                onEdit={onEdit}
              />
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
