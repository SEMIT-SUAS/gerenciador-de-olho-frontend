<<<<<<< HEAD
import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
=======
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
<<<<<<< HEAD
} from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

const Form = FormProvider;
=======
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
<<<<<<< HEAD
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);
=======
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
<<<<<<< HEAD
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;
=======
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
<<<<<<< HEAD
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

function FormItem({ className, ...props }: React.ComponentProps<'div'>) {
  const id = React.useId();
=======
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId()
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
<<<<<<< HEAD
        className={cn('grid gap-2', className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
=======
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
<<<<<<< HEAD
  const { error, formItemId } = useFormField();
=======
  const { error, formItemId } = useFormField()
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
<<<<<<< HEAD
      className={cn('data-[error=true]:text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();
=======
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
<<<<<<< HEAD
  );
}

function FormDescription({ className, ...props }: React.ComponentProps<'p'>) {
  const { formDescriptionId } = useFormField();
=======
  )
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField()
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
<<<<<<< HEAD
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

function FormMessage({ className, ...props }: React.ComponentProps<'p'>) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? '') : props.children;

  if (!body) {
    return null;
=======
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : props.children

  if (!body) {
    return null
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
<<<<<<< HEAD
      className={cn('text-destructive text-sm', className)}
=======
      className={cn("text-destructive text-sm", className)}
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266
      {...props}
    >
      {body}
    </p>
<<<<<<< HEAD
  );
=======
  )
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
<<<<<<< HEAD
};
=======
}
>>>>>>> 625e753ab51fcc8dcd66e856f1778ad1697fb266
