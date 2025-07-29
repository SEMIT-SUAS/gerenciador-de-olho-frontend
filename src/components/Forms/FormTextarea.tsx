import type { TextareaHTMLAttributes } from 'react';
import { Textarea } from '../ui/textarea';

type FormTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function FormTextarea({ ...props }: FormTextareaProps) {
  return <Textarea {...props} />;
}
