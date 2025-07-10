import type { TextareaHTMLAttributes } from 'react';

type FormTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function FormTextarea({ ...props }: FormTextareaProps) {
  return (
    <textarea
      {...props}
      className="block w-full rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm p-3 border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
    />
  );
}
