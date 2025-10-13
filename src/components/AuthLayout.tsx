import type { ReactNode } from 'react';
import { Building2, Shield } from 'lucide-react';
import logoImage from '../assets/logo.png';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showLogo?: boolean;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  showLogo = true,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex min-h-screen">
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="absolute top-20 left-20 w-72 h-72 bg-white bg-opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400 bg-opacity-20 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex flex-col justify-center px-12 py-24 text-white">
            <div className="max-w-md">
              {showLogo && (
                <div className="flex items-center mb-8">
                  <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-lg mr-4 p-2">
                    <img src={logoImage} alt="City Lights" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">City Lights</h1>
                    <p className="text-blue-200 text-sm">Control de Edificios</p>
                  </div>
                </div>
              )}
              <h2 className="text-4xl font-bold mb-6 leading-tight">
                Sistema de Control Inteligente
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Gestiona y controla todos los aspectos de tu edificio de manera segura y eficiente.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Shield size={20} className="text-green-400 mr-3" />
                  <span className="text-blue-100">Autenticación con 2FA</span>
                </div>
                <div className="flex items-center">
                  <Building2 size={20} className="text-green-400 mr-3" />
                  <span className="text-blue-100">Control de acceso por roles</span>
                </div>
                <div className="flex items-center">
                  <Shield size={20} className="text-green-400 mr-3" />
                  <span className="text-blue-100">Gestión segura de dispositivos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {showLogo && (
              <div className="flex items-center justify-center mb-8 lg:hidden">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg mr-3 p-2">
                    <img src={logoImage} alt="City Lights" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">City Lights</h1>
                    <p className="text-gray-600 text-sm">Control de Edificios</p>
                  </div>
                </div>
              </div>
            )}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {title}
              </h2>
              {subtitle && (
                <p className="text-gray-600 text-lg">
                  {subtitle}
                </p>
              )}
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              {children}
            </div>
            <div className="text-center mt-6 text-sm text-gray-500">
              <p>© 2025 City Lights. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
