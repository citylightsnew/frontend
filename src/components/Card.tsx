import type { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  onClick?: () => void;
  className?: string;
}

const variantClasses = {
  default: 'bg-white border border-gray-200',
  outlined: 'bg-transparent border-2 border-gray-300',
  elevated: 'bg-white shadow-lg',
};

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export default function Card({
  children,
  title,
  subtitle,
  footer,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  onClick,
  className = '',
}: CardProps) {
  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      className={`
        rounded-lg transition-all
        ${variantClasses[variant]}
        ${hoverable || isClickable ? 'hover:shadow-xl hover:scale-[1.02] cursor-pointer' : ''}
        ${isClickable ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {(title || subtitle) && (
        <div className={`border-b border-gray-200 ${paddingClasses[padding]}`}>
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
      )}

      <div className={paddingClasses[padding]}>
        {children}
      </div>

      {footer && (
        <div className={`border-t border-gray-200 ${paddingClasses[padding]} bg-gray-50`}>
          {footer}
        </div>
      )}
    </div>
  );
}

export function CardSection({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`py-3 ${className}`}>
      {children}
    </div>
  );
}
