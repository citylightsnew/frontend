import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Smartphone, Clock } from 'lucide-react';
import { AuthLayout, Input, Button, Alert, Spinner } from '../components';
import { useAuth, useAuthRedirect } from '../hooks/useAuth';
import { validateLoginForm } from '../utils/validators';
import { authService } from '../services/authService';
import type { LoginFormData, TwoFactorFormData } from '../types';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, verify2FA, check2FAStatus, isLoading, error, clearError } = useAuth();
  const { redirectIfAuthenticated } = useAuthRedirect();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const [twoFactorStep, setTwoFactorStep] = useState<'none' | 'email' | 'push'>('none');
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorFormData>({
    code: '',
  });
  const [twoFactorEmail, setTwoFactorEmail] = useState('');
  const [twoFactorRequestId, setTwoFactorRequestId] = useState('');
  const [pollingActive, setPollingActive] = useState(false);
  const [waitingMessage, setWaitingMessage] = useState('');
  const [countdown, setCountdown] = useState(0);
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showRejectionAlert, setShowRejectionAlert] = useState(false);

  useEffect(() => {
    if (twoFactorStep === 'none') {
      redirectIfAuthenticated();
    }
  }, [redirectIfAuthenticated, twoFactorStep]);

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setShowSuccess(true);
      setSuccessMessage('Email verificado correctamente. Ahora puedes iniciar sesión.');
    }
    if (searchParams.get('expired') === 'true') {
      // El error se maneja automáticamente por el contexto
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const validation = validateLoginForm(formData.email, formData.password);
    
    if (!validation.isValid) {
      setFormErrors({
        email: validation.email.isValid ? undefined : validation.email.message,
        password: validation.password.isValid ? undefined : validation.password.message,
      });
      return;
    }

    try {
      const response = await login(formData);

      if (response.requiresTwoFactor) {
        setTwoFactorEmail(formData.email);
        
        if (response.usePushNotification) {
          setTwoFactorStep('push');
          setTwoFactorRequestId(response.requestId || '');
          setWaitingMessage(response.message || 'Revisa la notificación en tu dispositivo móvil');
          setPollingActive(true); // Activar polling (el useEffect se encarga del resto)
          setCountdown(120); // 2 minutos
        } else {
          setTwoFactorStep('email');
        }
      } else {
        setSuccessMessage('Inicio de sesión exitoso. Redirigiendo...');
        setShowSuccess(true);
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch {
      // El error se maneja en el contexto
    }
  };

  const handleTwoFactorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (/^\d{0,6}$/.test(value)) {
      setTwoFactorData({ code: value });
      clearError();
    }
  };

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (twoFactorData.code.length !== 6) {
      return;
    }

    try {
      await verify2FA({ email: twoFactorEmail, code: twoFactorData.code });
      setSuccessMessage('Verificación exitosa. Redirigiendo...');
      setShowSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch {
      // El error se maneja en el contexto
    }
  };

  const cancelPolling = () => {
    setPollingActive(false);
    setTwoFactorStep('none');
    setCountdown(0);
    setTwoFactorRequestId('');
    setShowRejectionAlert(false);
  };

  useEffect(() => {
    if (!pollingActive || !twoFactorRequestId || !twoFactorEmail) {
      return;
    }

    const countdownInterval = window.setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const stopPolling = authService.startPolling(twoFactorRequestId, twoFactorEmail, {
      intervalMs: 2000,
      timeoutMs: 120000,
      onApproved: async () => {
        setPollingActive(false);
        try {
          await check2FAStatus({ email: twoFactorEmail, requestId: twoFactorRequestId });
          
          setTwoFactorStep('none');
          setTwoFactorRequestId('');
          setTwoFactorEmail('');
          
          setSuccessMessage('✅ Acceso aprobado desde tu dispositivo móvil');
          setShowSuccess(true);
          
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } catch (error) {
          console.error('Error al actualizar estado de autenticación:', error);
        }
      },
      onRejected: () => {
        setPollingActive(false);
        setShowRejectionAlert(true);
        setTwoFactorStep('none');
        setTwoFactorRequestId('');
        setTwoFactorEmail('');
      },
      onTimeout: () => {
        setPollingActive(false);
        setTwoFactorStep('none');
        setTwoFactorRequestId('');
      },
      onError: (error) => {
        console.error('Error en polling:', error);
      },
    });

    return () => {
      stopPolling();
      window.clearInterval(countdownInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollingActive, twoFactorRequestId, twoFactorEmail]);

  if (twoFactorStep === 'push' && pollingActive) {
    return (
      <AuthLayout 
        title="Esperando aprobación" 
        subtitle="Revisa tu dispositivo móvil"
      >
        <div className="text-center py-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Smartphone size={64} className="text-blue-500" />
              <div className="absolute -top-2 -right-2">
                <Spinner size="sm" />
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {waitingMessage}
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">
              Usuario: <span className="font-medium">{twoFactorEmail}</span>
            </p>
            <p className="text-sm text-gray-600">
              Tiempo restante: <span className="font-mono font-medium">{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</span>
            </p>
          </div>

          <div className="space-y-3 text-sm text-gray-600 mb-6">
            <div className="flex items-center justify-center">
              <Clock size={16} className="mr-2" />
              <span>Esperando tu aprobación...</span>
            </div>
          </div>

          <Button 
            variant="secondary" 
            onClick={cancelPolling}
            fullWidth
          >
            Cancelar
          </Button>
        </div>
      </AuthLayout>
    );
  }

  if (twoFactorStep === 'email') {
    return (
      <AuthLayout 
        title="Verificación en dos pasos" 
        subtitle="Ingresa el código enviado a tu email"
      >
        <form onSubmit={handleTwoFactorSubmit} className="space-y-6">
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={clearError}
            />
          )}

          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail size={32} className="text-blue-600" />
              </div>
            </div>
            <p className="text-gray-600">
              Hemos enviado un código de 6 dígitos a:
            </p>
            <p className="font-medium text-gray-900">{twoFactorEmail}</p>
          </div>

          <Input
            type="text"
            value={twoFactorData.code}
            onChange={handleTwoFactorChange}
            placeholder="000000"
            maxLength={6}
            autoFocus
            className="text-center text-2xl font-mono tracking-widest"
            autoComplete="one-time-code"
          />

          <div className="space-y-3">
            <Button
              type="submit"
              disabled={twoFactorData.code.length !== 6}
              loading={isLoading}
              fullWidth
            >
              Verificar código
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setTwoFactorStep('none')}
              fullWidth
            >
              Volver al inicio de sesión
            </Button>
          </div>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Iniciar sesión" 
      subtitle="Accede a tu cuenta de City Lights"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {showSuccess && (
          <Alert
            type="success"
            message={successMessage}
            onClose={() => setShowSuccess(false)}
          />
        )}

        {showRejectionAlert && (
          <Alert
            type="error"
            message="❌ Acceso rechazado desde tu dispositivo móvil. Si no fuiste tú, cambia tu contraseña."
            onClose={() => setShowRejectionAlert(false)}
          />
        )}

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={clearError}
          />
        )}

        <div className="space-y-4">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            error={formErrors.email}
            icon={<Mail size={20} />}
            autoComplete="email"
            required
          />

          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleInputChange}
            error={formErrors.password}
            icon={<Lock size={20} />}
            autoComplete="current-password"
            required
          />
        </div>

        <Button
          type="submit"
          loading={isLoading}
          disabled={!formData.email || !formData.password}
          fullWidth
        >
          Iniciar sesión
        </Button>

        <div className="text-center space-y-4">
          <div className="text-sm">
            <span className="text-gray-600">¿No tienes una cuenta? </span>
            <Link 
              to="/register" 
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Regístrate aquí
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}
