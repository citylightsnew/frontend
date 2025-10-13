import { useAuth } from '../hooks/useAuth';
import { Button } from '../components';
import { LogOut, Shield, Mail, Phone, Calendar } from 'lucide-react';
import logoImage from '../assets/logo.png';

export default function UserDashboard() {
  const { user, logout } = useAuth();

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
      </header>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                ¡Bienvenido, {user?.name}!
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Esta es tu información personal
              </p>
            </div>
            
            <div className="px-6 py-6">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Nombre completo</p>
                    <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Correo electrónico</p>
                    <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                    <p className="text-xs text-green-600 mt-1">
                      {user?.emailVerified ? '✓ Verificado' : '⚠️ No verificado'}
                    </p>
                  </div>
                </div>

                {user?.telephone && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Teléfono</p>
                      <p className="text-lg font-semibold text-gray-900">{user.telephone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-orange-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Rol en el sistema</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">{user?.roleName}</p>
                  </div>
                </div>

                {user?.createdAt && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-gray-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Miembro desde</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Estado de seguridad
              </h3>
            </div>
            
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`${
                  user?.emailVerified 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                } border rounded-lg p-4`}>
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      user?.emailVerified 
                        ? 'bg-green-100' 
                        : 'bg-red-100'
                    }`}>
                      <span className={`text-lg ${
                        user?.emailVerified 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {user?.emailVerified ? '✓' : '✗'}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${
                        user?.emailVerified 
                          ? 'text-green-900' 
                          : 'text-red-900'
                      }`}>
                        Email
                      </p>
                      <p className={`text-sm ${
                        user?.emailVerified 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
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
                        Autenticación 2FA
                      </p>
                      <p className={`text-sm ${
                        user?.twoFactorEnabled 
                          ? 'text-green-600' 
                          : 'text-yellow-600'
                      }`}>
                        {user?.twoFactorEnabled ? 'Activada' : 'Desactivada'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
