import { useState } from 'react';
import { Modal, ModalFooter } from '../';
import { CreditCard, Banknote, Smartphone, Building2 } from 'lucide-react';
import type { MetodoPago } from '../../types/payments.types';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (metodo: MetodoPago) => void;
  amount: number;
  description?: string;
}

export default function PaymentMethodModal({ 
  isOpen, 
  onClose, 
  onSelect,
  amount,
  description,
}: PaymentMethodModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<MetodoPago | null>(null);

  const paymentMethods = [
    {
      value: 'STRIPE_CARD' as MetodoPago,
      label: 'Tarjeta de Crédito/Débito',
      description: 'Pago seguro con Stripe',
      icon: <CreditCard className="w-8 h-8" />,
      color: 'blue',
    },
    {
      value: 'STRIPE_TRANSFER' as MetodoPago,
      label: 'Transferencia Bancaria',
      description: 'Transferencia mediante Stripe',
      icon: <Building2 className="w-8 h-8" />,
      color: 'purple',
    },
    {
      value: 'QR_BANCARIO' as MetodoPago,
      label: 'QR Bancario',
      description: 'Pago con código QR',
      icon: <Smartphone className="w-8 h-8" />,
      color: 'green',
    },
    {
      value: 'CASH' as MetodoPago,
      label: 'Efectivo',
      description: 'Pago en efectivo',
      icon: <Banknote className="w-8 h-8" />,
      color: 'orange',
    },
  ];

  const handleSelect = () => {
    if (selectedMethod) {
      onSelect(selectedMethod);
      onClose();
    }
  };

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors = {
      blue: isSelected 
        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500' 
        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50',
      purple: isSelected 
        ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-500' 
        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50',
      green: isSelected 
        ? 'border-green-500 bg-green-50 ring-2 ring-green-500' 
        : 'border-gray-200 hover:border-green-300 hover:bg-green-50',
      orange: isSelected 
        ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-500' 
        : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconColor = (color: string, isSelected: boolean) => {
    if (!isSelected) return 'text-gray-400';
    
    const colors = {
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      green: 'text-green-600',
      orange: 'text-orange-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Seleccionar Método de Pago"
      size="md"
    >
      <div className="space-y-4">
        {/* Amount Display */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-center">
          <p className="text-white/80 text-sm mb-1">Monto a pagar</p>
          <p className="text-white text-3xl font-bold">
            Bs. {amount.toFixed(2)}
          </p>
          {description && (
            <p className="text-white/90 text-sm mt-2">
              {description}
            </p>
          )}
        </div>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-1 gap-3">
          {paymentMethods.map((method) => {
            const isSelected = selectedMethod === method.value;
            
            return (
              <button
                key={method.value}
                onClick={() => setSelectedMethod(method.value)}
                className={`
                  p-4 border-2 rounded-lg text-left transition-all
                  ${getColorClasses(method.color, isSelected)}
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`
                    flex-shrink-0 transition-colors
                    ${getIconColor(method.color, isSelected)}
                  `}>
                    {method.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {method.label}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {method.description}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Info Note */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600">
            💡 <strong>Nota:</strong> Todos los pagos son procesados de forma segura. 
            Los pagos con tarjeta son procesados mediante Stripe.
          </p>
        </div>
      </div>

      <ModalFooter>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSelect}
          disabled={!selectedMethod}
          className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuar con {selectedMethod && paymentMethods.find(m => m.value === selectedMethod)?.label}
        </button>
      </ModalFooter>
    </Modal>
  );
}
