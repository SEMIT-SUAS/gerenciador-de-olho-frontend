import { useForm } from 'react-hook-form';
import { LoginFormSchema, type LoginFormData } from './types';
import { zodResolver } from '@hookform/resolvers/zod';

export function LoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
  });

  function handleLoginFormSubmit() {}

  return <form onSubmit={form.handleSubmit(handleLoginFormSubmit)}></form>;
}
