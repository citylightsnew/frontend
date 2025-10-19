import type { ReactNode } from 'react';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'secondary' | 'default';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  className?: string;
}

const variantClasses = {
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  primary: 'bg-blue-600 text-white border-blue-700',
  secondary: 'bg-gray-100 text-gray-800 border-gray-200',
  default: 'bg-gray-100 text-gray-700 border-gray-200',
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  rounded = true,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center justify-center font-medium border
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${rounded ? 'rounded-full' : 'rounded'}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toUpperCase();
  
  const variantMap: Record<string, BadgeProps['variant']> = {
    PENDING: 'warning',
    CONFIRMED: 'success',
    CANCELLED: 'danger',
    COMPLETED: 'info',
    
    PROCESSING: 'info',
    FAILED: 'danger',
    REFUNDED: 'secondary',
    
    ACTIVO: 'success',
    INACTIVO: 'secondary',
    SUSPENDIDO: 'danger',
    VACACIONES: 'info',
    PAGADO: 'success',
    RECHAZADO: 'danger',
    PENDIENTE: 'warning',
    
    EMITIDA: 'success',
    ANULADA: 'danger',
  };

  const variant = variantMap[normalizedStatus] || 'default';

  const displayText = status
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');

  return <Badge variant={variant}>{displayText}</Badge>;
}

export function RoleBadge({ role }: { role: string }) {
  const roleMap: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    admin: { variant: 'primary', label: 'Administrador' },
    user: { variant: 'secondary', label: 'Usuario' },
    'super-user': { variant: 'info', label: 'Super Usuario' },
  };

  const config = roleMap[role.toLowerCase()] || { variant: 'default', label: role };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
