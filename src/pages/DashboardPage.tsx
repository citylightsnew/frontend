import { useAuth, useRole } from '../hooks/useAuth';
import { Button } from '../components';
import { Building2, Users, Settings, LogOut, Shield } from 'lucide-react';
import logoImage from '../assets/logo.png';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { isAdmin, currentRole } = useRole();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg mr-3 p-1">
                <img src={logoImage} alt="City Lights" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">City Lights</h1>
                <p className="text-xs text-gray-500">Control de Edificios</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 flex items-center">
                  <Shield size={12} className="mr-1" />
                  {currentRole === 'admin' ? 'Administrador' : 'Usuario'}
                </p>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                icon={<LogOut size={16} />}
              >
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Bienvenido, {user?.name}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Sistema de control de edificios City Lights
              </p>
            </div>
            
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Shield className="w-8 h-8 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-900">Tu rol</p>
                      <p className="text-lg font-bold text-blue-600">
                        {currentRole === 'admin' ? 'Administrador' : 'Usuario'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-lg">✓</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-900">Email</p>
                      <p className="text-sm text-green-600">
                        {user?.emailVerified ? 'Verificado' : 'No verificado'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`${
                  user?.twoFactorEnabled 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-yellow-50 border-yellow-200'
                } border rounded-lg p-4`}>
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      user?.twoFactorEnabled 
                        ? 'bg-green-100' 
                        : 'bg-yellow-100'
                    }`}>
                      <span className={`text-lg ${
                        user?.twoFactorEnabled 
                          ? 'text-green-600' 
                          : 'text-yellow-600'
                      }`}>
                        {user?.twoFactorEnabled ? '🔒' : '⚠️'}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${
                        user?.twoFactorEnabled 
                          ? 'text-green-900' 
                          : 'text-yellow-900'
                      }`}>
                        2FA
                      </p>
                      <p className={`text-sm ${
                        user?.twoFactorEnabled 
                          ? 'text-green-600' 
                          : 'text-yellow-600'
                      }`}>
                        {user?.twoFactorEnabled ? 'Activado' : 'Desactivado'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Acciones disponibles
              </h3>
            </div>
            
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isAdmin() && (
                  <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center mb-3">
                      <Users className="w-6 h-6 text-blue-600" />
                      <h4 className="ml-2 text-sm font-medium text-gray-900">
                        Gestión de usuarios
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Administrar usuarios del sistema
                    </p>
                    <Button size="sm" variant="outline" fullWidth>
                      Administrar usuarios
                    </Button>
                  </div>
                )}

                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center mb-3">
                    <Building2 className="w-6 h-6 text-green-600" />
                    <h4 className="ml-2 text-sm font-medium text-gray-900">
                      Control de edificio
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Monitorear y controlar sistemas
                  </p>
                  <Button size="sm" variant="outline" fullWidth>
                    Acceder al control
                  </Button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center mb-3">
                    <Settings className="w-6 h-6 text-purple-600" />
                    <h4 className="ml-2 text-sm font-medium text-gray-900">
                      Configuración
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Ajustar preferencias y seguridad
                  </p>
                  <Button size="sm" variant="outline" fullWidth>
                    Configurar cuenta
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
