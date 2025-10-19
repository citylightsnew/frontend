import { useState, useEffect } from 'react';
import { loadStripe, type Stripe, type StripeElements } from '@stripe/stripe-js';
import { CreditCard, Lock, AlertCircle, CheckCircle } from 'lucide-react';

interface StripeCheckoutProps {
  amount: number;
  currency?: string;
  description?: string;
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

export default function StripeCheckout({
  amount,
  currency = 'BOB',
  description,
  clientSecret,
  onSuccess,
  onError,
  onCancel,
}: StripeCheckoutProps) {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [elements, setElements] = useState<StripeElements | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Card details state
  const [cardholderName, setCardholderName] = useState('');

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        // Load Stripe
        const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
        
        if (!stripePublishableKey) {
          setError('Stripe no está configurado correctamente');
          setLoading(false);
          return;
        }

        const stripeInstance = await loadStripe(stripePublishableKey);
        
        if (!stripeInstance) {
          setError('No se pudo cargar Stripe');
          setLoading(false);
          return;
        }

        setStripe(stripeInstance);

        // Create elements
        const elementsInstance = stripeInstance.elements({
          clientSecret,
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#2563eb',
              colorBackground: '#ffffff',
              colorText: '#1f2937',
              colorDanger: '#ef4444',
              fontFamily: 'system-ui, sans-serif',
              spacingUnit: '4px',
              borderRadius: '8px',
            },
          },
        });

        setElements(elementsInstance);
        setLoading(false);

        // Mount payment element
        const paymentElement = elementsInstance.create('payment');
        paymentElement.mount('#payment-element');

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al inicializar Stripe');
        setLoading(false);
      }
    };

    initializeStripe();
  }, [clientSecret]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: submitError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: cardholderName,
            },
          },
        },
        redirect: 'if_required',
      });

      if (submitError) {
        setError(submitError.message || 'Error al procesar el pago');
        setProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setSuccess(true);
        setTimeout(() => {
          onSuccess(paymentIntent.id);
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pago');
      setProcessing(false);
      onError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Cargando checkout...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Pago Exitoso!
          </h2>
          <p className="text-gray-600 mb-4">
            Tu pago ha sido procesado correctamente.
          </p>
          <div className="animate-pulse text-blue-600 text-sm">
            Redirigiendo...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Checkout Seguro
          </h2>
        </div>
        <p className="text-sm text-gray-600">
          Procesa tu pago de forma segura con Stripe
        </p>
      </div>

      {/* Amount Display */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6 border border-blue-200">
        <p className="text-gray-600 text-sm mb-1">Total a pagar</p>
        <p className="text-3xl font-bold text-gray-900">
          {currency} {amount.toFixed(2)}
        </p>
        {description && (
          <p className="text-sm text-gray-600 mt-2">
            {description}
          </p>
        )}
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Cardholder Name */}
        <div>
          <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del titular
          </label>
          <input
            type="text"
            id="cardholderName"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            placeholder="Nombre completo"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Payment Element (Stripe) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Información de pago
          </label>
          <div 
            id="payment-element" 
            className="border border-gray-300 rounded-lg p-3"
          >
            {/* Stripe mounts here */}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Security Info */}
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <Lock className="w-4 h-4 text-gray-500" />
          <span>Tus datos están protegidos con encriptación SSL</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!stripe || processing}
            className="flex-1 px-4 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Procesando...
              </span>
            ) : (
              `Pagar ${currency} ${amount.toFixed(2)}`
            )}
          </button>
        </div>
      </form>

      {/* Stripe Branding */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          Powered by <span className="font-semibold text-blue-600">Stripe</span>
        </p>
      </div>
    </div>
  );
}
