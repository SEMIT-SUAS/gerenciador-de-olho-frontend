import { useState, type ChangeEvent, type FormEvent } from 'react';
import { AddDenunciaFormSchema } from './types';
import type { z } from 'zod/v4';

export function useAddDenunciaFormHook() {
  const initialData = {
    bairro: '',
    rua: '',
    categoryId: 0,
    categoryTipoId: 0,
    descricao: '',
    pontoDeReferencia: '',
    files: [],
  };

  const [formData, setFormData] =
    useState<z.infer<typeof AddDenunciaFormSchema>>(initialData);

  const [formErrors, setFormErrors] = useState<Record<string, any>>({});
  const [isLoadingAddressSearch, setIsLoadingAddressSearch] = useState(false);
  const [isSubmitingForm, setIsSubmitingForm] = useState(false);

  function resetForm() {
    setFormData(initialData);
    setFormErrors({});
  }

  function onChangeInput(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target;
    const tagName = event.target.tagName.toLowerCase();

    setFormData((prev) => ({
      ...prev,
      [name]: tagName == 'select' ? Number(value) : value,
    }));
  }

  function validateForm(): boolean {
    const result = AddDenunciaFormSchema.safeParse(formData);
    if (!result.success) {
      const errors = result.error.format();
      setFormErrors(errors);
      return false;
    }

    return true;
  }

  function onChangeFileInput(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);

    setFormData((prev) => ({
      ...prev,
      files,
    }));
  }

  return {
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    isLoadingAddressSearch,
    setIsLoadingAddressSearch,
    isSubmitingForm,
    setIsSubmitingForm,

    validateForm,
    onChangeInput,
    onChangeFileInput,
    resetForm,
  };
}
