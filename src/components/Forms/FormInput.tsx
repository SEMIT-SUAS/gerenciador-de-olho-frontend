type FormInputProps = React.InputHTMLAttributes<HTMLInputElement>

export function FormInput(props: FormInputProps) {
  return (
    <input
      {...props}
      className="block w-full rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm p-3 border-gray-300 focus:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
    />
  )
}
