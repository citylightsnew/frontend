import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, RotateCcw, CheckCircle, Clock } from 'lucide-react';
import { AuthLayout, Input, Button, Alert } from '../components';
import { useAuth, useAuthRedirect } from '../hooks/useAuth';
import { validateCode } from '../utils/validators';
import type { VerifyEmailFormData } from '../types';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyEmail, resendCode, isLoading, error, clearError } = useAuth();
  const { redirectIfAuthenticated } = useAuthRedirect();

  const emailFromUrl = searchParams.get('email') || '';

  const [formData, setFormData] = useState<VerifyEmailFormData>({
    code: '',
  });

  const [email, setEmail] = useState(emailFromUrl);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [canResend, setCanResend] = useState(true);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    redirectIfAuthenticated();
  }, [redirectIfAuthenticated]);

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    if (/^\d{0,6}$/.test(value)) {
      setFormData({ code: value });
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const codeValidation = validateCode(formData.code);
    if (!codeValidation.isValid) {
      return;
    }

    try {
      await verifyEmail({
        email: email,
        code: formData.code,
      });

      setSuccessMessage('¡Email verificado correctamente! Redirigiendo al login...');
      setShowSuccess(true);

      setTimeout(() => {
        navigate('/login?verified=true');
      }, 2000);

    } catch {
      setFormData({ code: '' });
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    clearError();
    setCanResend(false);
    setResendCountdown(60); // 60 segundos de espera

    try {
      await resendCode({ email });
      
      setSuccessMessage('Código reenviado exitosamente a tu email.');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);

    } catch {
      setCanResend(true);
      setResendCountdown(0);
      return;
    }

    const countdownInterval = setInterval(() => {
      setResendCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    clearError();
  };

  return (
    <AuthLayout 
      title="Verifica tu email" 
      subtitle="Hemos enviado un código a tu correo electrónico"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Alertas */}
        {showSuccess && (
          <Alert
            type="success"
            message={successMessage}
            onClose={() => setShowSuccess(false)}
          />
        )}

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={clearError}
          />
        )}

        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail size={40} className="text-blue-600" />
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Código de verificación enviado
          </h3>
          
          <p className="text-gray-600 mb-4">
            Revisa tu bandeja de entrada y spam. El código tiene una validez de 15 minutos.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico:
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="tu-email@ejemplo.com"
              className="text-center"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
              Código de verificación (6 dígitos)
            </label>
            <Input
              id="code"
              type="text"
              value={formData.code}
              onChange={handleCodeChange}
              placeholder="123456"
              maxLength={6}
              autoFocus
              className="text-center text-2xl font-mono tracking-widest"
              autoComplete="one-time-code"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-center text-xs text-gray-500">
            <Clock size={14} className="mr-1" />
            <span>El código expira en 15 minutos</span>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            type="submit"
            disabled={formData.code.length !== 6 || !email}
            loading={isLoading}
            fullWidth
            icon={<CheckCircle size={20} />}
          >
            Verificar código
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={!canResend || isLoading}
              className={`
                inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg
                transition-colors duration-200
                ${canResend && !isLoading
                  ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                  : 'text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <RotateCcw size={16} className="mr-2" />
              {canResend ? (
                'Reenviar código'
              ) : (
                `Reenviar en ${resendCountdown}s`
              )}
            </button>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                ¿No recibiste el código?
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Revisa tu carpeta de spam o correo no deseado</li>
                  <li>Verifica que el email esté escrito correctamente</li>
                  <li>El código puede tardar hasta 5 minutos en llegar</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <div className="text-sm text-gray-600">
            <Link 
              to="/register" 
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Volver al registro
            </Link>
          </div>
          
          <div className="text-sm text-gray-600">
            ¿Ya tienes una cuenta? {' '}
            <Link 
              to="/login" 
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Inicia sesión
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}
