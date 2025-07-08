import { FaExclamation } from 'react-icons/fa'

type FormInputErrorProps = {
  message?: string
}

export function FormInputError({ message }: FormInputErrorProps) {
  if (!message) return null

  return (
    <p className="flex items-center gap-1 text-sm text-red-600">
      <FaExclamation size={16} />
      {message}
    </p>
  )
};
