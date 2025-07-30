import { FaBatteryEmpty } from 'react-icons/fa';
import { useMapActions } from '../../../context/MapActions';
import { useOcorrencias } from '../../../context/OcorrenciasContext';
import { Observacao } from '../../Observacao';
import { FormGroup } from '../FormGroup';
import { FormInput } from '../FormInput';
import { FormInputError } from '../FormInputError';
import { FormTextarea } from '../FormTextarea';
import { Label } from '../Label';
import { useAddAcaoFormHook } from './addAcaoFormHook';
import { DenunciaItem } from '../../SidePanel/Denuncia/DenunciaItem';
import { useEffect, useState, type FormEvent } from 'react';
import { ConfirmModal } from '../../Modals/ConfirmModal';
import { useFilters } from '../../../context/FiltersContext';
import type { CreateAcaoModel } from '../../../types/Acao';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/Buttons/BaseButton';
import { BackButton } from '@/components/Buttons/Backbutton';

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
    setFormData,
    formData,
    formErrors,
    isSubmitingForm,
    onChange,
    validateForm,
    setIsSubmitingForm,
    resetForm,
  } = useAddAcaoFormHook();

  const navigate = useNavigate();

  useEffect(() => {
    cacheCurrentFilters();

    setFiltroDenunciasComAcao('sem_acao');
    setSalvarDenunciasOnClick(true);

    return () => {
      restoreCachedFilters();
      setDenunciasSelecionadas([]);
      setSalvarDenunciasOnClick(false);
    };
  }, []);

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

  return (
    <>
      <form onSubmit={handleSubmitForm} className="flex flex-col gap-4 px-1">
        <div className="flex flex-col gap-4">
          <BackButton to="/ocorrencias/acoes" children="Criar Ação" />
          <p className="text-sm text-gray-500">
            Crie uma ação para agrupar denúncias relacionadas
          </p>
        </div>
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
            />
            <FormInputError message={formErrors?.title?._errors[0]} />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="secretariaId">Secretaria</Label>
            {secretarias && (
              <div className="relative">
                <Select
                  name="secretariaId"
                  value={
                    formData.secretariaId < 1
                      ? ''
                      : String(formData.secretariaId)
                  }
                  onValueChange={(value) => {
                    const numericValue = Number(value) || 0;
                    setFormData((prev) => ({
                      ...prev,
                      secretariaId: numericValue,
                    }));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma secretaria" />
                  </SelectTrigger>
                  <SelectContent>
                    {secretarias.map((sec) => (
                      <SelectItem key={sec.id} value={String(sec.id)}>
                        {sec.sigla}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                showDate={true}
                denuncia={d}
                onClick={() => {}}
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

        <Button
          size="md"
          type="submit"
          disabled={isSubmitingForm || denunciasSelecionas.length === 0}
        >
          {isSubmitingForm ? 'Criando...' : 'Criar Ação'}
        </Button>
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
