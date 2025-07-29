import { useEffect, useState, type FormEvent } from 'react';
import { FormGroup } from '../FormGroup';
import { Label } from '../Label';
import { FormInput } from '../FormInput';
import { FormInputError } from '../FormInputError';
import { SelectArrowDown } from '../SelectArrowDown';
import { toast } from 'react-toastify';
import { ConfirmModal } from '../../Modals/ConfirmModal';
import { useOcorrencias } from '../../../context/OcorrenciasContext';
import { useMapActions } from '../../../context/MapActions';
import { useFilters } from '../../../context/FiltersContext';
import type { CreateDenunciaModel } from '../../../types/Denuncia';
import { useNavigate } from 'react-router-dom';
import { useAddDenunciaFormHook } from './addDenunciaFormHook';
import denunciaService from '../../../services/denunciasService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function AddDenunciaForm() {
  const { categorias } = useOcorrencias();
  const {
    setNewDenunciaCoordinates,
    newDenunciaCoordinates,
    isSelectingNewDenuncia,
    setIsSelectingNewDenuncia,
  } = useMapActions();

  const {
    cacheCurrentFilters,
    restoreCachedFilters,
    setIsVisibleAcoesInMap,
    setIsVisibleDenunciasInMap,
  } = useFilters();

  const {
    formData,
    setFormData,
    isLoadingAddressSearch,
    setIsLoadingAddressSearch,
    formErrors,
    isSubmitingForm,
    setIsSubmitingForm,
    onChangeInput,
    onChangeFileInput,
    validateForm,
    resetForm,
  } = useAddDenunciaFormHook();

  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);
  const navigate = useNavigate();

  async function loadAddress() {
    try {
      setIsLoadingAddressSearch(true);
      const address = await denunciaService.getAddressByCoordinates(
        newDenunciaCoordinates!.lat,
        newDenunciaCoordinates!.lng,
      );

      setFormData((formData) => ({
        ...formData,
        bairro: address.bairro,
        rua: address.rua,
      }));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoadingAddressSearch(false);
    }
  }

  useEffect(() => {
    cacheCurrentFilters();

    return () => {
      restoreCachedFilters();
      resetForm();
      setNewDenunciaCoordinates(null);
    };
  }, []);

  useEffect(() => {
    if (isSelectingNewDenuncia) {
      setIsVisibleAcoesInMap(false);
      setIsVisibleDenunciasInMap(false);
    } else {
      setIsVisibleAcoesInMap(true);
      setIsVisibleDenunciasInMap(true);
    }

    if (newDenunciaCoordinates) {
      loadAddress();
    }
  }, [isSelectingNewDenuncia, newDenunciaCoordinates]);

  async function handleFormSubmit(event: FormEvent) {
    event.preventDefault();
    if (isSubmitingForm) return;

    const isValid = validateForm();
    if (isValid) {
      setIsOpenConfirmationModal(true);
    }
  }

  async function handleConfirmSubmit() {
    try {
      setIsSubmitingForm(true);

      const createDenunciaData: CreateDenunciaModel = {
        latitude: newDenunciaCoordinates!.lat,
        longitude: newDenunciaCoordinates!.lng,
        bairro: formData.bairro,
        rua: formData.rua,
        pontoDeReferencia: formData.pontoDeReferencia,
        descricao: formData.descricao,
        tipoId: formData.categoryTipoId,
        files: formData.files,
      };

      const newDenunciaData = await denunciaService.createDenuncia(
        createDenunciaData,
      );

      toast.success('Denuncia criada com sucesso!');
      resetForm();
      navigate(`/ocorrencias/denuncias/${newDenunciaData.id}`);
    } catch (error: any) {
      toast(error.message, {
        type: 'error',
      });
    } finally {
      setIsSubmitingForm(false);
      setIsOpenConfirmationModal(false);
    }
  }

  const selectedCategory = categorias.find((c) => c.id === formData.categoryId);

  return (
    <>
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 px-1">
        <h2 className="text-2xl font-bold text-blue-500">Adicionar denúncia</h2>

        <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Endereço</h2>
            <p className="mt-1 text-sm text-gray-600">
              Os campos de endereço abaixo são preenchidos automaticamente ao
              selecionar no mapa o local da denúncia. Porém você pode editá-los
              posteriormente.
            </p>

            <button
              type="button"
              className={`w-full my-4 ${
                isSelectingNewDenuncia
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-bold py-3 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed`}
              onClick={() => setIsSelectingNewDenuncia((current) => !current)}
              disabled={isLoadingAddressSearch}
            >
              {isLoadingAddressSearch
                ? 'Buscando...'
                : isSelectingNewDenuncia
                ? 'Cancelar seleção'
                : 'Selecionar no mapa'}
            </button>

            <div className="grid grid-cols-1 gap-4 mt-4">
              {['rua', 'bairro', 'pontoDeReferencia'].map((field) => (
                <FormGroup key={field}>
                  <Label htmlFor={`address-${field}`}>
                    {field === 'pontoDeReferencia'
                      ? 'Ponto de referência'
                      : field.charAt(0).toUpperCase() + field.slice(1)}
                  </Label>

                  <FormInput
                    id={field}
                    name={field}
                    value={formData[field as keyof typeof formData]}
                    disabled={!newDenunciaCoordinates || isLoadingAddressSearch}
                    onChange={onChangeInput}
                    placeholder={`Informe o ${
                      field === 'pontoDeReferencia'
                        ? 'ponto de referência'
                        : field
                    }`}
                  />
                  <FormInputError message={formErrors[field]?._errors?.[0]} />
                </FormGroup>
              ))}
            </div>
          </div>

          <FormGroup>
            <Label htmlFor="categoryId">Categoria da denúncia</Label>
            <div className="relative">
              <Select
                name="categoryId"
                value={
                  formData.categoryId < 1 ? '' : String(formData.categoryId)
                }
                onValueChange={(value) => {
                  const numericValue = Number(value);
                  console.log(`Atualizando categoryId para: ${numericValue}`);
                  setFormData((prev) => ({
                    ...prev,
                    categoryId: numericValue,
                  }));
                }}
                disabled={!newDenunciaCoordinates || isLoadingAddressSearch}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <FormInputError message={formErrors.categoryId?._errors?.[0]} />
          </FormGroup>

          {formData.categoryId > 0 && (
            <FormGroup>
              <Label htmlFor="categoryTipoId">Tipo da denúncia</Label>
              <div className="relative">
                <Select
                  name="categoryTipoId"
                  value={
                    formData.categoryTipoId < 1
                      ? ''
                      : String(formData.categoryTipoId)
                  }
                  onValueChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      categoryTipoId: Number(value),
                    }));
                  }}
                  disabled={
                    !selectedCategory || !selectedCategory.tipos?.length
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategory?.tipos?.map((tipo) => (
                      <SelectItem key={tipo.id} value={String(tipo.id)}>
                        {tipo.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <FormInputError
                message={formErrors.categoryTipoId?._errors?.[0]}
              />
            </FormGroup>
          )}

          <FormGroup>
            <Label htmlFor="descricao">Descrição da ocorrência</Label>
            <textarea
              id="descricao"
              name="descricao"
              rows={5}
              value={formData.descricao}
              onChange={onChangeInput}
              disabled={!newDenunciaCoordinates || isLoadingAddressSearch}
              placeholder="Descreva com detalhes o que está acontecendo..."
              className="block w-full rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm p-3 border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
            />
            <FormInputError message={formErrors.descricao?._errors?.[0]} />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="files">Fotos ou Vídeos (até 5)</Label>
            <input
              type="file"
              id="files"
              name="files"
              multiple
              accept=".png, .jpg, .jpeg, .mp4"
              onChange={onChangeFileInput}
              disabled={!newDenunciaCoordinates || isLoadingAddressSearch}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 }"
            />

            <FormInputError message={formErrors.files?._errors?.[0]} />
          </FormGroup>
        </div>

        <div className="flex flex-col gap-4 py-4">
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!newDenunciaCoordinates || isSubmitingForm}
          >
            {isSubmitingForm ? 'Enviando...' : 'Adicionar denúncia'}
          </button>
        </div>
      </form>

      <ConfirmModal
        isOpen={isOpenConfirmationModal}
        title="Confirmação de envio"
        message="Você tem certeza que deseja enviar essa denúncia?"
        onCancel={() => setIsOpenConfirmationModal(false)}
        onConfirm={handleConfirmSubmit}
      />
    </>
  );
}
