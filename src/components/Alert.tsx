import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import type { AlertProps } from '../types';

export default function Alert({
  type,
  title,
  message,
  onClose,
  autoClose = false,
  duration = 5000,
  className = '',
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose && duration > 0) {
      const timer = window.setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300); 
      }, duration);

      return () => window.clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  if (!isVisible) {
    return null;
  }

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-500',
      textColor: 'text-green-800',
      titleColor: 'text-green-900',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-500',
      textColor: 'text-red-800',
      titleColor: 'text-red-900',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-800',
      titleColor: 'text-yellow-900',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-500',
      textColor: 'text-blue-800',
      titleColor: 'text-blue-900',
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  const alertClasses = `
    ${config.bgColor} ${config.borderColor} ${config.textColor}
    border rounded-lg p-4 mb-4
    transition-all duration-300 ease-in-out
    ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={alertClasses} role="alert">
      <div className="flex items-start">
        {/* Icono */}
        <div className={`${config.iconColor} flex-shrink-0 mt-0.5`}>
          <Icon size={20} />
        </div>

        {/* Contenido */}
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`${config.titleColor} font-semibold text-sm mb-1`}>
              {title}
            </h3>
          )}
          <p className="text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {onClose && (
          <button
            onClick={handleClose}
            className={`
              ${config.iconColor} hover:opacity-70
              flex-shrink-0 ml-4 p-1 rounded-md
              transition-opacity duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50
              ${type === 'success' ? 'focus:ring-green-500' : ''}
              ${type === 'error' ? 'focus:ring-red-500' : ''}
              ${type === 'warning' ? 'focus:ring-yellow-500' : ''}
              ${type === 'info' ? 'focus:ring-blue-500' : ''}
            `}
            aria-label="Cerrar alerta"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {autoClose && duration > 0 && (
        <div className="mt-3 w-full bg-white bg-opacity-50 rounded-full h-1">
          <div 
            className={`
              h-1 rounded-full transition-all ease-linear
              ${type === 'success' ? 'bg-green-400' : ''}
              ${type === 'error' ? 'bg-red-400' : ''}
              ${type === 'warning' ? 'bg-yellow-400' : ''}
              ${type === 'info' ? 'bg-blue-400' : ''}
            `}
            style={{
              width: '100%',
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
          }
        `
      }} />
    </div>
  );
}
