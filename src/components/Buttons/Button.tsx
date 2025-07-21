
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline_primary' | 'outline_secondary' | 'outline_danger' | 'outline_ghost';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean; 
}

const variantStyles = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  outline_primary: 'border-2 border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white focus: ring-blue-500',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
  outline_secondary: 'border-2 border-gray-400 text-gray-800 hover:bg-gray-400 hover:text-white focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  outline_danger: 'border-2 border-red-700 text-red-700 hover:bg-red-700 hover:text-white focus:ring-red-500',
  ghost: 'bg-transparent text-gray-800 hover:bg-gray-100 focus:ring-gray-400',
  outline_ghost: 'border-2 border-gray-300 text-gray-800 hover:bg-gray-300 hover:text-white focus:ring-gray-500',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    
    const baseStyle =
      'inline-flex items-center justify-center rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    return (
      <button
        ref={ref}
        className={cn(
          baseStyle,
          variantStyles[variant], 
          sizeStyles[size],       
          className             
        )}
        {...props} 
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
