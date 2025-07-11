import { useState, type FormEvent } from 'react';
import { z } from 'zod';
import { FormGroup } from './FormGroup';
import { Label } from './Label';
import { FormInput } from './FormInput';
import { FormTextarea } from './FormTextarea';
import { useOcorrenciasContext } from '../../context/OcorrenciasContext';
import { Observacao } from '../Observacao';
import { SelectArrowDown } from './SelectArrowDown';
import { useAddAcao } from '../../context/AddAcaoContext';
import { DenunciaItem } from '../SidePanel/Denuncia/DenunciaItem';
import { FaBatteryEmpty } from 'react-icons/fa';
import { FormInputError } from './FormInputError';
import { toast } from 'react-toastify';
import type { Acao } from '../../types/Acao';
import { getConvexHull, getPolygonoCenter } from '../../utils/geometry';

const createAcaoFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'O título deve ter no mínimo 3 caracteres.' })
    .max(100, { message: 'O título deve ter no máximo 100 caracteres.' }),
  secretariaId: z
    .number({ invalid_type_error: 'Selecione uma secretaria.' })
    .gt(0, { message: 'Selecione uma secretaria.' }),
  obs: z
    .string()
    .max(500, { message: 'A observação deve ter no máximo 500 caracteres.' })
    .optional(),
});

export function CreateAcaoForm() {
  const { secretarias, setAcoes, setDenuncias, setActualDetailItem } =
    useOcorrenciasContext();
  const { denunciasVinculadas, setDenunciasVinculadas, setIsAddingAcao } =
    useAddAcao();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<z.ZodFormattedError<
    z.infer<typeof createAcaoFormSchema>
  > | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    secretariaId: -1,
    obs: '',
  });

  function handleCreateAcaoFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors(null);

    const validation = createAcaoFormSchema.safeParse(formData);

    if (!validation.success) {
      setErrors(validation.error.format());
      return;
    }

    try {
      setIsSubmitting(true);

      const denunciasVinculadasOrdernated = getConvexHull(
        denunciasVinculadas.map((d) => ({
          lat: d.endereco.latitude,
          lon: d.endereco.longitude,
        })),
      );

      const actionCoordinates = getPolygonoCenter(
        denunciasVinculadasOrdernated,
      );

      const newActionData: Acao = {
        id: Math.random(),
        nome: formData.title,
        lat: actionCoordinates[0],
        lon: actionCoordinates[1],
        polygonCoords: denunciasVinculadasOrdernated,
        secretaria: {
          ...secretarias.find((sec) => sec.id === formData.secretariaId)!,
        },
        status: 'aberto',
      };

      setDenuncias((denuncias) =>
        denuncias.map((d) => {
          if (denunciasVinculadas.find((dc) => dc.id == d.id)) {
            return {
              ...d,
              acaoId: newActionData.id,
            };
          }

          return d;
        }),
      );

      setAcoes((acoes) => [...acoes, newActionData]);
      setActualDetailItem(newActionData);
      setIsAddingAcao(false);

      toast('Ação criada!', {
        type: 'success',
      });
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleCreateAcaoFormSubmit}
      className="flex flex-col gap-4 px-1"
    >
      <h2 className="text-2xl font-bold text-green-500">Criar ação</h2>

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
          <FormInputError message={errors?.title?._errors[0]} />
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
                <option value="-1" disabled>
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
          <FormInputError message={errors?.secretariaId?._errors[0]} />
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
          <FormInputError message={errors?.obs?._errors[0]} />
        </FormGroup>
      </div>

      <Observacao
        color="red"
        text="Faça a seleção das denúncias automaticamente ao clicar em uma denúnica no mapa"
      />

      <div className="flex flex-col gap-4 max-h-[19rem] overflow-y-auto">
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
