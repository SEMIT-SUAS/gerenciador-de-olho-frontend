import { useEffect, useState } from 'react';
import type { Categoria, Categorias } from '../../../types/CategoriaDenuncia';
import categoriaService from '../../../services/categoriaService';
import { toast } from 'react-toastify';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // 1. Importar componentes do shadcn

type SelectCategoriaFilterProps = {
  onCategoriaChange: (categoria: Categorias) => void;
};

export function SelectCategoriaFilter({
  onCategoriaChange,
}: SelectCategoriaFilterProps) {
  const [categorias, setCategorias] = useState<Categoria[] | null>(null);

  // A lógica de fetch e state permanece a mesma
  useEffect(() => {
    async function fetchCategorias() {
      try {
        const data = await categoriaService.getAll();
        setCategorias(data);
      } catch {
        toast.error( // Usar toast.error para mensagens de erro é mais semântico
          'Não foi possível carregar as categorias, tente novamente mais tarde',
        );
      }
    }

    fetchCategorias();
  }, []);

  return (
    <div>
      <label
        htmlFor="categoria-select"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Categoria
      </label>

      <Select
        onValueChange={onCategoriaChange}
        defaultValue="todas" 
        disabled={!categorias} 
      >
        <SelectTrigger id="categoria-select" className="w-full">
          <SelectValue placeholder="Selecione uma categoria..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas</SelectItem>

          {categorias?.map((categoria) => (
            <SelectItem key={categoria.id} value={categoria.name}>
              {categoria.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}