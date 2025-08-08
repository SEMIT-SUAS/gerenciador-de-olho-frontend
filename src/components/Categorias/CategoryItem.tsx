import type { CategoriaDenunciaModel } from '@/types/CategoriaDenuncia';
import type { Dispatch, SetStateAction } from 'react';
import { TableCell, TableRow } from '../ui/table';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { CategoryVisibility } from './CategoryVisibility';
import { Badge } from '../ui/badge';

interface CategoryItem {
  category: CategoriaDenunciaModel;
  setCategories: Dispatch<SetStateAction<CategoriaDenunciaModel[] | null>>;
}

export function CategoryItem({ category, setCategories }: CategoryItem) {
  return (
    <TableRow className="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
      <TableCell className="p-3 w-16">
        <img
          src={category.icone}
          alt={category.nome}
          className="w-8 h-8 object-contain"
        />
      </TableCell>

      <TableCell className="p-3 font-medium text-slate-800">
        {category.nome}
      </TableCell>

      <TableCell className="p-3 text-slate-600 text-sm max-w-[200px] truncate">
        {category.descricao}
      </TableCell>

      <TableCell className="p-3">
        <span
          className="inline-block rounded-full px-3 py-1 text-xs font-medium"
          style={{
            backgroundColor: `${category.cor}20`,
            color: category.cor,
            border: `1px solid ${category.cor}`,
          }}
        >
          {category.cor.toUpperCase()}
        </span>
      </TableCell>

      <TableCell className="p-3">
        {category.destaque ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            Sim
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            Não
          </span>
        )}
      </TableCell>

      <TableCell className="p-3">
        <div className="flex items-center gap-3">
          <button onClick={() => null} aria-label="Editar">
            <IconEdit stroke={2.3} size={18} />
          </button>

          <CategoryVisibility
            category={category}
            setCategories={setCategories}
          />

          <button onClick={() => null} aria-label="Excluir">
            <IconTrash stroke={2.3} size={18} />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
}
