import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'white' | 'gray' | 'green' | 'red';
  className?: string;
}

export default function Spinner({ 
  size = 'md', 
  color = 'blue', 
  className = '' 
}: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    blue: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-600',
    green: 'text-green-600',
    red: 'text-red-600',
  };

  const spinnerClasses = `
    ${sizeClasses[size]}
    ${colorClasses[color]}
    animate-spin
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return <Loader2 className={spinnerClasses} />;
}

interface LoadingScreenProps {
  message?: string;
  className?: string;
}

export function LoadingScreen({ 
  message = 'Cargando...', 
  className = '' 
}: LoadingScreenProps) {
  return (
    <div className={`
      fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm
      flex items-center justify-center z-50
      ${className}
    `}>
      <div className="text-center">
        <Spinner size="xl" />
        <p className="mt-4 text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
}

interface InlineLoadingProps {
  message?: string;
  className?: string;
}

export function InlineLoading({ 
  message = 'Cargando...', 
  className = '' 
}: InlineLoadingProps) {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <Spinner />
      <span className="ml-3 text-gray-600">{message}</span>
    </div>
  );
}
