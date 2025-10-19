import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { Button } from '../';

interface ModalConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'warning' | 'danger' | 'success' | 'info';
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export default function ModalConfirm({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false,
}: ModalConfirmProps) {
  if (!isOpen) return null;

  const typeStyles = {
    warning: {
      icon: <AlertCircle size={48} className="text-orange-500" />,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      buttonVariant: 'primary' as const,
    },
    danger: {
      icon: <AlertCircle size={48} className="text-red-500" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      buttonVariant: 'danger' as const,
    },
    success: {
      icon: <CheckCircle size={48} className="text-green-500" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      buttonVariant: 'primary' as const,
    },
    info: {
      icon: <AlertCircle size={48} className="text-blue-500" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      buttonVariant: 'primary' as const,
    },
  };

  const style = typeStyles[type];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-gray-900/50 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pt-6 pb-4">
            <div className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full ${style.bgColor} border-2 ${style.borderColor}`}>
              {style.icon}
            </div>
            
            <div className="mt-4 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {title}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              {cancelText}
            </Button>
            <Button
              variant={style.buttonVariant}
              onClick={onConfirm}
              loading={loading}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
