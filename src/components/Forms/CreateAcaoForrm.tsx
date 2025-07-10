import { useEffect, useState, type FormEvent } from 'react';
import { FormGroup } from './FormGroup';
import { Label } from './Label';
import { FormInput } from './FormInput';
import { FormTextarea } from './FormTextarea';
import { useOcorrenciasContext } from '../../context/OcorrenciasContext';
import { Observacao } from '../Observacao';
import { SelectArrowDown } from './SelectArrowDown';
import { useAddAcao } from '../../context/AddAcaoContext';
import { useFilters } from '../../context/FiltersContext';
import { DenunciaItem } from '../SidePanel/Denuncia/DenunciaItem';
import { FaBatteryEmpty } from 'react-icons/fa';

export function CreateAcaoForm() {
  const { secretarias } = useOcorrenciasContext();
  const { denunciasVinculadas, setDenunciasVinculadas } = useAddAcao();
  const { setIsVisibleAcoesInMap, setFiltroStatusDenuncia } = useFilters();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    secretariaId: -1,
    obs: '',
  });

  useEffect(() => {
    setIsVisibleAcoesInMap(false);
    setFiltroStatusDenuncia('aberto');
  }, []);

  function handleCreateAcaoFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form
      onSubmit={handleCreateAcaoFormSubmit}
      className="flex flex-col gap-4 px-1"
    >
      <Observacao
        text="Você está adicionando uma nova ação ao sistema."
        color="blue"
      />

      <div className="flex flex-col gap-4">
        <FormGroup>
          <Label htmlFor="title">Título</Label>
          <FormInput
            id="title"
            name="title"
            type="text"
            value={formData.title}
            placeholder="Informa o título da ação"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="secretariaId">Secretaria</Label>
          {secretarias && (
            <div className="relative">
              <select
                id="secretariaId"
                name="secretariaId"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    secretariaId: Number(e.target.value),
                  })
                }
                value={String(formData.secretariaId)}
                className="w-full cursor-pointer appearance-none rounded-md border border-gray-300 bg-white py-2.5 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="0" disabled>
                  Selecione uma secretaria
                </option>
                {secretarias.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.name}
                  </option>
                ))}
              </select>

              <SelectArrowDown />
            </div>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="obs">Observações</Label>
          <FormTextarea
            id="obs"
            name="obs"
            rows={5}
            value={formData.obs}
            placeholder="Caso haja necessidade, informe aqui alguma observação"
            onChange={(e) => setFormData({ ...formData, obs: e.target.value })}
          />
        </FormGroup>
      </div>

      <Observacao
        color="red"
        text="Faça a seleção de denúncias automaticamente ao clicar em uma denúnica no mapa"
      />

      <div className="flex flex-col gap-4 max-h-[50%] overflow-y-auto">
        {denunciasVinculadas.length === 0 ? (
          <span className="flex items-center gap-2 text-gray-500">
            <FaBatteryEmpty />
            Nenhum item selecionado
          </span>
        ) : (
          denunciasVinculadas.map((d) => (
            <DenunciaItem
              key={d.id}
              denuncia={d}
              onClick={() => {}}
              showDescription={false}
              showTag={false}
              isDeletable={true}
              onTrashClick={() => {
                setDenunciasVinculadas((denuncias) =>
                  denuncias.filter((dActual) => dActual.id !== d.id),
                );
              }}
            />
          ))
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || denunciasVinculadas.length === 0}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Criando...' : 'Criar Ação'}
      </button>
    </form>
  );
}
