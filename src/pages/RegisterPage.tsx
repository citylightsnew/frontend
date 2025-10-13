import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { AuthLayout, Input, Button, Alert } from '../components';
import { useAuth, useAuthRedirect } from '../hooks/useAuth';
import { 
  validateRegisterForm, 
  getPasswordStrength
} from '../utils/validators';
import type { RegisterFormData } from '../types';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();
  const { redirectIfAuthenticated } = useAuthRedirect();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    telephone: '',
  });

  const [formErrors, setFormErrors] = useState<{
    [key in keyof RegisterFormData]?: string;
  }>({});
  
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);
  const [touched, setTouched] = useState<{
    [key in keyof RegisterFormData]?: boolean;
  }>({});

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    redirectIfAuthenticated();
  }, [redirectIfAuthenticated]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    if (name === 'telephone') {
      processedValue = value.replace(/[^\d\s\-+()]/g, '');
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    
    if (formErrors[name as keyof RegisterFormData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
    
    if (name === 'password') {
      setShowPasswordStrength(value.length > 0);
    }
    
    clearError();
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (touched[name as keyof RegisterFormData]) {
      validateField(name as keyof RegisterFormData);
    }
  };

  const validateField = (fieldName: keyof RegisterFormData) => {
    const validation = validateRegisterForm(
      formData.name,
      formData.email,
      formData.password,
      formData.confirmPassword,
      formData.telephone
    );

    const fieldValidation = validation[fieldName];
    if (!fieldValidation.isValid) {
      setFormErrors(prev => ({
        ...prev,
        [fieldName]: fieldValidation.message
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      telephone: true,
    });

    const validation = validateRegisterForm(
      formData.name.trim(),
      formData.email.trim(),
      formData.password,
      formData.confirmPassword,
      formData.telephone.trim()
    );

    if (!validation.isValid) {
      setFormErrors({
        name: validation.name.isValid ? undefined : validation.name.message,
        email: validation.email.isValid ? undefined : validation.email.message,
        password: validation.password.isValid ? undefined : validation.password.message,
        confirmPassword: validation.confirmPassword.isValid ? undefined : validation.confirmPassword.message,
        telephone: validation.telephone.isValid ? undefined : validation.telephone.message,
      });
      return;
    }

    try {
      const response = await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        telephone: formData.telephone.trim(),
      });

      setSuccessMessage(
        `¡Registro exitoso! Hemos enviado un código de verificación a ${response.email}`
      );
      setShowSuccess(true);

      setTimeout(() => {
        navigate(`/verify-email?email=${encodeURIComponent(response.email)}`);
      }, 2000);

    } catch {
      // El error se maneja en el contexto
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const isFormValid = () => {
    return formData.name.trim() &&
           formData.email.trim() &&
           formData.password &&
           formData.confirmPassword &&
           formData.telephone.trim() &&
           Object.keys(formErrors).length === 0;
  };

  return (
    <AuthLayout 
      title="Crear cuenta" 
      subtitle="Únete al sistema City Lights"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
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

        <div className="space-y-4">
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Nombre completo"
            value={formData.name}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            error={touched.name ? formErrors.name : undefined}
            icon={<User size={20} />}
            autoComplete="name"
            required
          />

          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            error={touched.email ? formErrors.email : undefined}
            icon={<Mail size={20} />}
            autoComplete="email"
            required
          />

          <Input
            id="telephone"
            name="telephone"
            type="tel"
            placeholder="Teléfono (+1234567890)"
            value={formData.telephone}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            error={touched.telephone ? formErrors.telephone : undefined}
            icon={<Phone size={20} />}
            autoComplete="tel"
            required
          />

          <div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              error={touched.password ? formErrors.password : undefined}
              icon={<Lock size={20} />}
              autoComplete="new-password"
              required
            />
            
            {showPasswordStrength && formData.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600">Fortaleza de contraseña:</span>
                  <span className={`font-medium ${
                    passwordStrength.color === 'red' ? 'text-red-600' :
                    passwordStrength.color === 'orange' ? 'text-orange-600' :
                    passwordStrength.color === 'yellow' ? 'text-yellow-600' :
                    passwordStrength.color === 'green' ? 'text-green-600' :
                    'text-blue-600'
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      passwordStrength.color === 'red' ? 'bg-red-500' :
                      passwordStrength.color === 'orange' ? 'bg-orange-500' :
                      passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                      passwordStrength.color === 'green' ? 'bg-green-500' :
                      'bg-blue-500'
                    }`}
                    style={{ width: `${(passwordStrength.score + 1) * 20}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirmar contraseña"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            error={touched.confirmPassword ? formErrors.confirmPassword : undefined}
            icon={<Lock size={20} />}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Requisitos de contraseña:
          </h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${
                formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              Al menos 8 caracteres
            </li>
            <li className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${
                /[a-z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              Una letra minúscula
            </li>
            <li className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${
                /[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              Una letra mayúscula
            </li>
            <li className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${
                /\d/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              Un número
            </li>
            <li className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${
                /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'
              }`} />
              Un carácter especial
            </li>
          </ul>
        </div>

        <Button
          type="submit"
          loading={isLoading}
          disabled={!isFormValid()}
          fullWidth
        >
          Crear cuenta
        </Button>

        <div className="text-center">
          <div className="text-sm">
            <span className="text-gray-600">¿Ya tienes una cuenta? </span>
            <Link 
              to="/login" 
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}
