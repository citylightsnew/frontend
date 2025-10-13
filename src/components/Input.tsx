import { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import type { InputProps } from '../types';

const Input = forwardRef<HTMLInputElement, InputProps>(({
  id,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  error,
  icon,
  className = '',
  maxLength,
  autoComplete,
  autoFocus = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPasswordType = type === 'password';
  const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const containerClasses = `
    relative w-full
  `.trim();

  const inputClasses = `
    w-full px-4 py-3 
    ${icon ? 'pl-11' : 'pl-4'}
    ${isPasswordType ? 'pr-12' : 'pr-4'}
    border-2 rounded-lg
    font-medium text-gray-900 placeholder-gray-500
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-0
    ${error 
      ? 'border-red-500 bg-red-50 focus:border-red-600 focus:bg-red-50' 
      : isFocused 
        ? 'border-blue-500 bg-white focus:border-blue-600' 
        : 'border-gray-300 bg-gray-50 hover:border-gray-400 focus:border-blue-500 focus:bg-white'
    }
    ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-100' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const iconClasses = `
    absolute left-3 top-1/2 transform -translate-y-1/2
    w-5 h-5 transition-colors duration-200
    ${error ? 'text-red-500' : isFocused ? 'text-blue-500' : 'text-gray-400'}
  `.trim().replace(/\s+/g, ' ');

  const passwordToggleClasses = `
    absolute right-3 top-1/2 transform -translate-y-1/2
    p-1 rounded-md transition-colors duration-200
    ${error ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-gray-600'}
    hover:bg-gray-100 focus:outline-none focus:bg-gray-100
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={containerClasses}>
      {/* Label si se proporciona */}
      {placeholder && !value && !isFocused && (
        <label 
          htmlFor={id}
          className={`absolute ${icon ? 'left-11' : 'left-4'} top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none transition-all duration-200`}
        >
          {placeholder}
        </label>
      )}

      {icon && (
        <div className={iconClasses}>
          {icon}
        </div>
      )}

      <input
        ref={ref}
        id={id}
        name={name}
        type={inputType}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        className={inputClasses}
        placeholder={isFocused ? placeholder : ''}
        {...props}
      />

      {isPasswordType && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className={passwordToggleClasses}
          tabIndex={-1}
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}

      {error && (
        <div className="flex items-center mt-2 text-sm text-red-600">
          <AlertCircle size={16} className="mr-1 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
