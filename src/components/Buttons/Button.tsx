// src/components/Button.tsx

import React from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

// Função utilitária para combinar clsx e twMerge
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean; // Conceito avançado para composição
}

const variantStyles = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  outline_primary: 'border-2 border-blue-600 text-blue-700 hover:bg-blue-700 focus: ring-blue-500',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  ghost: 'bg-transparent text-gray-800 hover:bg-gray-100 focus:ring-gray-400',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

// 3. O Componente Button
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    
    // Estilos base que se aplicam a todos os botões
    const baseStyle =
      'inline-flex items-center justify-center rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    return (
      <button
        ref={ref}
        className={cn(
          baseStyle,
          variantStyles[variant], // Aplica o estilo da variante
          sizeStyles[size],       // Aplica o estilo do tamanho
          className               // Permite sobrescrever ou adicionar classes externamente
        )}
        {...props} // Passa todas as outras props (onClick, disabled, etc.) para o botão
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
