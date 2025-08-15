import React from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'ghost'
    | 'outline_primary'
    | 'outline_secondary'
    | 'outline_danger'
    | 'outline_ghost'
    | 'outline_gradient';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

const variantStyles = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  outline_primary:
    'border-2 border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white focus:ring-blue-500',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
  outline_secondary:
    'border-2 border-gray-400 text-gray-800 hover:bg-gray-400 hover:text-white focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  outline_danger:
    'border-2 border-red-700 text-red-700 hover:bg-red-700 hover:text-white focus:ring-red-500',

  outline_gradient:
    'p-[2px] bg-gradient-to-r from-[#39A6DE] via-[#56B2B8] via-[#79C096] via-[#9AC670] via-[#BBD050] via-[#DADB32] to-[#FAEA25] rounded-md text-gray-800 hover:opacity-90 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 [&>span]:bg-white [&>span]:rounded-md [&>span]:w-full [&>span]:h-full',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-lg',
};

const BaseButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', children, ...props },
    ref,
  ) => {
    const baseStyle =
      'inline-flex items-center justify-center font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none';

    if (variant === 'outline_gradient') {
      return (
        <button
          ref={ref}
          className={cn(baseStyle, variantStyles[variant], className)}
          {...props}
        >
          <span
            className={cn(sizeStyles[size], 'flex items-center justify-center')}
          >
            {children}
          </span>
        </button>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyle,
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

BaseButton.displayName = 'Button';

export { BaseButton };
