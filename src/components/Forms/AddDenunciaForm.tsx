import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { z } from 'zod/v4';
import type { Categoria } from '../../types/CategoriaDenuncia';
import categoriaService from '../../services/categoriaService';
import denunciasService from '../../services/denunciasService';
import { FormGroup } from './FormGroup';
import { Label } from './Label';
import { FormInput } from './FormInput';
import { FormInputError } from './FormInputError';
import { SelectArrowDown } from './SelectArrowDown';
import { useAddDenuncia } from '../../context/AddDenunciaContext';
import { toast } from 'react-toastify';
import { ConfirmModal } from '../Modals/ConfirmModal';
import { useOcorrenciasContext } from '../../context/OcorrenciasContext';

const addDenunciaFormType = z.object({
  categoryId: z.number().min(1, 'Selecione uma categoria'),
  categoryTipoId: z.number().min(1, 'Selecione o tipo da categoria'),
  address: z.object({
    bairro: z.string().min(3, 'No mínimo 3 caracteres'),
    rua: z.string().min(3, 'No mínimo 3 caracteres'),
    pontoDeReferencia: z.string().min(3, 'No mínimo 3 caracteres'),
  }),
  description: z.string().min(5, 'No mínimo 5 caracteres'),
  files: z
    .array(z.any())
    .nonempty('Uma denúncia precisa ter no mínimo 1 arquivo')
    .max(5, 'No máximo 5 arquivos'),
});

type AddDenunciaFormProps = {
  onCreateDenuncia: () => void;
};

export function AddDenunciaForm({ onCreateDenuncia }: AddDenunciaFormProps) {
  const {
    isSelectingNewDenunciaInMap,
    setIsSelectingNewDenunciaInMap,
    newDenunciaCoordinates,
  } = useAddDenuncia();

  const { setDenuncias } = useOcorrenciasContext();

  const [categories, setCategories] = useState<Categoria[] | null>(null);
  const [formData, setFormData] = useState<z.infer<typeof addDenunciaFormType>>(
    {
      categoryId: -1,
      categoryTipoId: 0,
      description: '',
      files: [],
      address: {
        bairro: '',
        rua: '',
        pontoDeReferencia: '',
      },
    },
  );
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});
  const [isLoadingAddressSearch, setIsLoadingAddressSearch] = useState(false);
  const [isSubmitingForm, setIsSubmitingForm] = useState(false);
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState(false);

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const data = await categoriaService.getAll();
        setCategories(data);
      } catch (error) {
        toast(error as string, {
          position: 'bottom-right',
          type: 'error',
        });
      }
    }

    fetchCategorias();
  }, []);

  useEffect(() => {
    if (!newDenunciaCoordinates) return;

    async function fetchEndereco() {
      try {
        setIsLoadingAddressSearch(true);
        const address = await denunciasService.getAddressByCoordinates(
          newDenunciaCoordinates!.longitude,
          newDenunciaCoordinates!.latitude,
        );

        setFormData((prev) => ({
          ...prev,
          address: {
            rua: address.rua,
            bairro: address.bairro,
            pontoDeReferencia: '',
          },
        }));
      } catch (error: any) {
        toast(error.message, {
          type: 'error',
        });
      } finally {
        setIsLoadingAddressSearch(false);
      }
    }

    fetchEndereco();
  }, [newDenunciaCoordinates]);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value, id } = e.target;

    if (id.startsWith('address')) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  function handleTextareaChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleSelectChange(e: ChangeEvent<HTMLSelectElement>) {
    const { name, value } = e.target;

    if (name === 'categoryId') {
      setFormData((prev) => ({
        ...prev,
        categoryId: Number(value),
        categoryTipoId: -1,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);

    setFormData((prev) => ({
      ...prev,
      files,
    }));
  }

  async function handleSubmitForm(e: FormEvent) {
    e.preventDefault();

    const result = addDenunciaFormType.safeParse(formData);

    if (!result.success) {
      const errors = result.error.format();
      setFormErrors(errors);
      return;
    }

    setIsOpenConfirmationModal(true);
  }

  async function submitForm() {
    try {
      setIsSubmitingForm(true);
      const createDenunciaData = {
        ...formData,
        address: {
          ...formData.address,
          lon: newDenunciaCoordinates!.longitude,
          lat: newDenunciaCoordinates!.latitude,
        },
      };

      const newDenunciaData = await denunciasService.createDenuncia(
        createDenunciaData,
      );
      setDenuncias((current) => [...current, newDenunciaData]);

      onCreateDenuncia();
      toast('Denuncia criada com sucesso!');
    } catch (error: any) {
      toast(error.message, {
        type: 'error',
      });
    } finally {
      setIsSubmitingForm(false);
    }
  }

  const selectedCategory = categories?.find(
    (c) => c.id === formData.categoryId,
  );

  return (
    <>
      <form onSubmit={handleSubmitForm} className="flex flex-col gap-4 px-1">
        <h2 className="text-2xl font-bold text-blue-500">Adicionar denúncia</h2>

        <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Endereço</h2>
            <p className="mt-1 text-sm text-gray-600">
              Os campos de endereço abaixo são preenchidos automaticamente ao
              selecionar no mapa o local da denúncia. Porém você pode editá-los
              posteriormente.
            </p>

            <div className="grid grid-cols-1 gap-4 mt-4">
              {['rua', 'bairro', 'pontoDeReferencia'].map((field) => (
                <FormGroup key={field}>
                  <Label htmlFor={`address-${field}`}>
                    {field === 'pontoDeReferencia'
                      ? 'Ponto de referência'
                      : field.charAt(0).toUpperCase() + field.slice(1)}
                  </Label>
                  <FormInput
                    id={`address-${field}`}
                    name={field}
                    value={
                      formData.address[field as keyof typeof formData.address]
                    }
                    disabled={!newDenunciaCoordinates}
                    onChange={handleInputChange}
                    placeholder={`Informe o ${
                      field === 'pontoDeReferencia'
                        ? 'ponto de referência'
                        : field
                    }`}
                  />
                  <FormInputError
                    message={formErrors.address?.[field]?._errors?.[0]}
                  />
                </FormGroup>
              ))}
            </div>
          </div>

          {/* Categoria */}
          <FormGroup>
            <Label htmlFor="categoryId">Categoria da denúncia</Label>
            <div className="relative">
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId < 1 ? '' : formData.categoryId}
                onChange={handleSelectChange}
                disabled={!newDenunciaCoordinates}
                className="w-full cursor-pointer rounded-lg border bg-white py-2.5 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <option value="" disabled>
                  Selecione uma categoria
                </option>

                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <SelectArrowDown />
            </div>
            <FormInputError message={formErrors.categoryId?._errors?.[0]} />
          </FormGroup>

          {/* Tipo da denúncia */}
          {formData.categoryId > 0 && (
            <FormGroup>
              <Label htmlFor="categoryTipoId">Tipo da denúncia</Label>
              <div className="relative">
                <select
                  id="categoryTipoId"
                  name="categoryTipoId"
                  value={
                    formData.categoryTipoId < 1 ? '' : formData.categoryTipoId
                  }
                  onChange={handleSelectChange}
                  className="w-full cursor-pointer rounded-lg border bg-white py-2.5 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none border-gray-300"
                >
                  <option value="" disabled>
                    Selecione um tipo
                  </option>
                  {selectedCategory?.tipos.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.name}
                    </option>
                  ))}
                </select>
                <SelectArrowDown />
              </div>
              <FormInputError
                message={formErrors.categoryTipoId?._errors?.[0]}
              />
            </FormGroup>
          )}

          {/* Descrição */}
          <FormGroup>
            <Label htmlFor="description">Descrição da ocorrência</Label>
            <textarea
              id="description"
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleTextareaChange}
              disabled={!newDenunciaCoordinates}
              placeholder="Descreva com detalhes o que está acontecendo..."
              className="block w-full rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm p-3 border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
            />
            <FormInputError message={formErrors.description?._errors?.[0]} />
          </FormGroup>

          {/* Upload de imagens */}
          <FormGroup>
            <Label htmlFor="files">Fotos ou Vídeos (até 5)</Label>
            <input
              type="file"
              id="files"
              name="files"
              multiple
              accept=".png, .jpg, .jpeg, .mp4"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 }"
            />
            <FormInputError message={formErrors.files?._errors?.[0]} />
          </FormGroup>
        </div>

        <div className="flex flex-col gap-4 py-4">
          <button
            type="button"
            className={`w-full ${
              isSelectingNewDenunciaInMap
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-bold py-3 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed`}
            onClick={() =>
              setIsSelectingNewDenunciaInMap((current) => !current)
            }
            disabled={isLoadingAddressSearch}
          >
            {isLoadingAddressSearch
              ? 'Buscando...'
              : isSelectingNewDenunciaInMap
              ? 'Cancelar seleção'
              : 'Selecionar no mapa'}
          </button>

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
        onConfirm={submitForm}
      />
    </>
  );
}
