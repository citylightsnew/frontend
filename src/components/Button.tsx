import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import type { ButtonProps } from '../types';

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  icon,
  fullWidth = false,
  ...props
}, ref) => {
  const isDisabled = disabled || loading;

  const baseClasses = `
    inline-flex items-center justify-center
    font-semibold rounded-lg
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-4 focus:ring-opacity-50
    disabled:opacity-60 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `.trim().replace(/\s+/g, ' ');

  const variantClasses = {
    primary: `
      bg-blue-600 text-white border-2 border-blue-600
      hover:bg-blue-700 hover:border-blue-700
      active:bg-blue-800 active:border-blue-800
      focus:ring-blue-500
      disabled:bg-blue-400 disabled:border-blue-400
    `,
    secondary: `
      bg-gray-100 text-gray-700 border-2 border-gray-300
      hover:bg-gray-200 hover:border-gray-400
      active:bg-gray-300 active:border-gray-500
      focus:ring-gray-500
    `,
    danger: `
      bg-red-600 text-white border-2 border-red-600
      hover:bg-red-700 hover:border-red-700
      active:bg-red-800 active:border-red-800
      focus:ring-red-500
      disabled:bg-red-400 disabled:border-red-400
    `,
    outline: `
      bg-transparent text-blue-600 border-2 border-blue-600
      hover:bg-blue-50 hover:text-blue-700
      active:bg-blue-100
      focus:ring-blue-500
    `,
  };

  // Tamaños
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant].trim().replace(/\s+/g, ' ')}
    ${sizeClasses[size]}
    ${className}
  `.trim();

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={buttonClasses}
      {...props}
    >
      {loading && (
        <Loader2 
          size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} 
          className={`animate-spin ${icon || children ? 'mr-2' : ''}`} 
        />
      )}
      
      {!loading && icon && (
        <span className={children ? 'mr-2' : ''}>
          {icon}
        </span>
      )}
      
      {children && !loading && (
        <span>{children}</span>
      )}
      
      {loading && !children && !icon && (
        <span className="sr-only">Cargando...</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
