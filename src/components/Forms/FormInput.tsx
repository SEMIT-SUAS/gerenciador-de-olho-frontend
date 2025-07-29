type FormInputProps = React.InputHTMLAttributes<HTMLInputElement>;
import { Input } from '../ui/input';

export function FormInput(props: FormInputProps) {
  return <Input {...props} />;
}
