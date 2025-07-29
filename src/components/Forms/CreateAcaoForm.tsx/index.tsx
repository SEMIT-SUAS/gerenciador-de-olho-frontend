import { FaBatteryEmpty } from 'react-icons/fa';
import { useMapActions } from '../../../context/MapActions';
import { useOcorrencias } from '../../../context/OcorrenciasContext';
import { Observacao } from '../../Observacao';
import { FormGroup } from '../FormGroup';
import { FormInput } from '../FormInput';
import { FormInputError } from '../FormInputError';
import { FormTextarea } from '../FormTextarea';
import { Label } from '../Label';
import { SelectArrowDown } from '../SelectArrowDown';
import { useAddAcaoFormHook } from './addAcaoFormHook';
import { DenunciaItem } from '../../SidePanel/Denuncia/DenunciaItem';
import { useEffect, useState, type FormEvent } from 'react';
import { ConfirmModal } from '../../Modals/ConfirmModal';
import { useFilters } from '../../../context/FiltersContext';
import type { CreateAcaoModel } from '../../../types/Acao';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import acoesService from '../../../services/acoesService';

export function AddAcaoForm() {
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const { secretarias, setDenuncias, setAcoes } = useOcorrencias();
  const {
    cacheCurrentFilters,
    restoreCachedFilters,
    setFiltroDenunciasComAcao,
  } = useFilters();

  const {
    setSalvarDenunciasOnClick,
    denunciasSelecionas,
    setDenunciasSelecionadas,
  } = useMapActions();

  const {
    formData,
    formErrors,
    isSubmitingForm,
    onChange,
    validateForm,
    setIsSubmitingForm,
    resetForm,
  } = useAddAcaoFormHook();

  const navigate = useNavigate();

  function handleSubmitForm(event: FormEvent) {
    event.preventDefault();
    if (isSubmitingForm) return;

    const isValid = validateForm();
    if (isValid) {
      setIsOpenConfirmationModal(true);
    }
  }

  async function handleConfirmSubmitForm() {
    try {
      setIsSubmitingForm(true);

      const createAcaoData: CreateAcaoModel = {
        nome: formData.title,
        denuncias: denunciasSelecionas,
        obs: formData.obs,
        secretariaId: formData.secretariaId,
      };

      const newAcao = await acoesService.createAcao(createAcaoData);
      const denunciasToUpdate = new Set(denunciasSelecionas.map((d) => d.id));

      setDenuncias((currentDenuncias) =>
        currentDenuncias.map((denuncia) => {
          if (denunciasToUpdate.has(denuncia.id)) {
            return {
              ...denuncia,
              acao: newAcao,
            };
          }

          return denuncia;
        }),
      );

      setAcoes((currentAcoes) => [...currentAcoes, newAcao]);

      toast.success('Ação criada com sucesso!');
      resetForm();
      navigate(`/ocorrencias/acoes/${newAcao.id}`);

      denunciasToUpdate.clear();
    } catch (error: any) {
      toast(error.message, {
        type: 'error',
      });
    } finally {
      setIsSubmitingForm(false);
      setIsOpenConfirmationModal(false);
    }
  }

  useEffect(() => {
    cacheCurrentFilters();

    setFiltroDenunciasComAcao('sem_acao');
    setSalvarDenunciasOnClick(true);

    return () => {
      setDenunciasSelecionadas([]);
      setSalvarDenunciasOnClick(false);
      restoreCachedFilters();
    };
  }, []);

  return (
    <>
      <form onSubmit={handleSubmitForm} className="flex flex-col gap-4 px-1">
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
              onChange={onChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <FormInputError message={formErrors?.title?._errors[0]} />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="secretariaId">Secretaria</Label>
            {secretarias && (
              <div className="relative">
                <select
                  id="secretariaId"
                  name="secretariaId"
                  onChange={onChange}
                  value={String(formData.secretariaId)}
                  className="w-full cursor-pointer appearance-none rounded-md border border-gray-300 bg-white py-2.5 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="0" disabled>
                    Selecione uma secretaria
                  </option>

                  {secretarias.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.sigla}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <FormInputError message={formErrors?.secretariaId?._errors[0]} />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="obs">Observações</Label>
            <FormTextarea
              id="obs"
              name="obs"
              rows={5}
              value={formData.obs}
              placeholder="Caso haja necessidade, informe aqui alguma observação"
              onChange={onChange}
            />
            <FormInputError message={formErrors?.obs?._errors[0]} />
          </FormGroup>
        </div>

        <Observacao
          color="red"
          text="Faça a seleção das denúncias automaticamente ao clicar em uma denúnica no mapa"
        />

        <div className="flex flex-col gap-4 max-h-[19rem] overflow-y-auto">
          {denunciasSelecionas.length === 0 ? (
            <span className="flex items-center gap-2 text-gray-500">
              <FaBatteryEmpty />
              Nenhum item selecionado
            </span>
          ) : (
            denunciasSelecionas.map((d) => (
              <DenunciaItem
                key={d.id}
                denuncia={d}
                onClick={() => {}}
                showDescription={false}
                showTag={false}
                isDeletable={true}
                onTrashClick={() => {
                  setDenunciasSelecionadas((denuncias) =>
                    denuncias.filter((dActual) => dActual.id !== d.id),
                  );
                }}
              />
            ))
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitingForm || denunciasSelecionas.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitingForm ? 'Criando...' : 'Criar Ação'}
        </button>
      </form>

      <ConfirmModal
        isOpen={isOpenConfirmationModal}
        title="Criar ação"
        message="Você realmente deseja criar essa ação? Após criada você não pode excluí-la, apenas indeferi-la"
        onCancel={() => setIsOpenConfirmationModal(false)}
        onConfirm={handleConfirmSubmitForm}
      />
    </>
  );
}
