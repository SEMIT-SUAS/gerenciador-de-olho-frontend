import { type ChangeEvent } from 'react';
import { ArrowDown } from '../../ArrowDown';
import { useOcorrencias } from '../../../context/OcorrenciasContext';
import type { DenunciaStatusModelTypes } from '../../../types/Denuncia';
import type { AcaoStatusModelTypes } from '../../../types/AcaoStatus';

type SelectCategoriaFilterProps = {
  onCategoriaChange: (
    categoria: 'todas' | DenunciaStatusModelTypes | AcaoStatusModelTypes,
  ) => void;
};

export function SelectCategoriaFilter({
  onCategoriaChange,
}: SelectCategoriaFilterProps) {
  const { categorias } = useOcorrencias();

  function handleOnSelect(event: ChangeEvent<HTMLSelectElement>) {
    onCategoriaChange(
      event.target.value as DenunciaStatusModelTypes | AcaoStatusModelTypes,
    );
  }

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
              <option key={categoria.id} value={categoria.nome}>
                {categoria.nome}
              </option>
            );
          })}
        </select>

        <ArrowDown />
      </div>
    </div>
  );
}
