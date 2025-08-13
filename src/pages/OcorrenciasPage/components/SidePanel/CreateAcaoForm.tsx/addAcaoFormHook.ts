import { useState, type ChangeEvent } from 'react';
import type { z } from 'zod/v4';
import { CreateAcaoFormSchema } from './types';

export function useAddAcaoFormHook() {
  const [isSubmitingForm, setIsSubmitingForm] = useState(false);

  const initialData = {
    title: '',
    secretariaId: 0,
    obs: '',
  };

  const [formErrors, setFormErrors] = useState<z.ZodFormattedError<
    z.infer<typeof CreateAcaoFormSchema>
  > | null>(null);

  const [formData, setFormData] = useState(initialData);

  function onChange(
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
    const result = CreateAcaoFormSchema.safeParse(formData);
    if (!result.success) {
      const errors = result.error.format();
      setFormErrors(errors);
      return false;
    }

    return true;
  }

  function resetForm() {
    setFormData(initialData);
    setFormErrors({
      _errors: [],
    });
  }

  return {
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    isSubmitingForm,
    setIsSubmitingForm,
    onChange,
    validateForm,
    resetForm,
  };
}
