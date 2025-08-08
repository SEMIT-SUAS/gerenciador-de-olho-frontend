import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ServicoCategoria } from '@/types/CategoriaServico';
import type { Dispatch, SetStateAction } from 'react';
import { CategoriaListItem } from '../components/Forms/CategoriaForm/CategoriaItem';
interface CategoriasListProps {
  categorias: (ServicoCategoria & { id: number })[];
  setCategorias: Dispatch<
    SetStateAction<(ServicoCategoria & { id: number })[]>
  >;
  onEdit: (categoria: ServicoCategoria & { id: number }) => void;
}

export function CategoriasList({
  categorias,
  setCategorias,
  onEdit,
}: CategoriasListProps) {
  return (
    <>
      <Table className="rounded-md overflow-hidden border-2 border-gray-500 shadow-lg">
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
    </>
  );
}
