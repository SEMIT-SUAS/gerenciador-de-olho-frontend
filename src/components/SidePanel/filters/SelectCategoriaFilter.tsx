import { useEffect, useState, type ChangeEvent } from 'react';
import type { Categoria, Categorias } from '../../../types/CategoriaDenuncia';
import categoriaService from '../../../services/categoriaService';
import { toast } from 'react-toastify';
import { ArrowDown } from '../../ArrowDown';

type SelectCategoriaFilterProps = {
  onCategoriaChange: (categoria: Categorias) => void;
};

export function SelectCategoriaFilter({
  onCategoriaChange,
}: SelectCategoriaFilterProps) {
  const [categorias, setCategorias] = useState<Categoria[] | null>(null);

  async function fetchCategorias() {
    try {
      return await categoriaService.getAll();
    } catch {
      toast(
        'Não foi possível carregar as categorias, tente novamente mais tarde',
      );
      return null;
    }
  }

  function handleOnSelect(event: ChangeEvent<HTMLSelectElement>) {
    onCategoriaChange(event.target.value as Categorias);
  }

  useEffect(() => {
    fetchCategorias().then((categorias) => setCategorias(categorias));
  }, []);

  return (
    <div>
      <label
        htmlFor="categoria-select"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Categoria
      </label>

      <div className="relative">
        <select
          id="categoria-select"
          onChange={handleOnSelect}
          className="w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
        >
          <option value="todas">Todas</option>

          {categorias?.map((categoria) => {
            return (
              <option key={categoria.id} value={categoria.name}>
                {categoria.name}
              </option>
            );
          })}
        </select>

        <ArrowDown />
      </div>
    </div>
  );
}
