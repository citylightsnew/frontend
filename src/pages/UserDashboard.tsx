import { useAuth } from '../hooks/useAuth';
import { Button } from '../components';
import { LogOut, Shield, Mail, Phone, Calendar as CalendarIcon, Home, Car, MapPin, Building2 } from 'lucide-react';
import logoImage from '../assets/logo.png';
import { useEffect, useState } from 'react';
import apiService from '../services/api';
import { useNavigate } from 'react-router-dom';

interface UserWithHabitacion {
  habitacion?: {
    id: string
    numero: string
    piso: number
    area?: number
    dormitorios: number
    banos: number
    precio: number
    edificio: {
      nombre: string
      direccion: string
    }
  }
  garajes?: Array<{
    id: string
    numero: string
    piso: number
    precio: number
    edificio: {
      nombre: string
    }
  }>
}

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState<UserWithHabitacion | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user?.id) return;
      
      try {
        const response = await apiService.get<UserWithHabitacion>(`/api/users/${user.id}`);
        setUserDetails(response);
      } catch (error) {
        console.error('Error al cargar detalles del usuario:', error);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchUserDetails();
  }, [user?.id]);

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
                        <CalendarIcon className="w-5 h-5 text-gray-600" />
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

          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Acciones Rápidas</h3>
              <p className="text-sm text-gray-500 mt-1">
                Gestiona tus reservas de áreas comunes
              </p>
            </div>
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/booking/areas')}
                  className="flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <MapPin size={24} className="text-gray-600 group-hover:text-blue-600" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 group-hover:text-blue-900">Ver Áreas Comunes</div>
                    <div className="text-xs text-gray-500">Explora instalaciones disponibles</div>
                  </div>
                </button>
                <button
                  onClick={() => navigate('/booking/reservas')}
                  className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all group"
                >
                  <CalendarIcon size={24} className="text-white" />
                  <div className="text-left">
                    <div className="font-semibold text-white">Hacer una Reserva</div>
                    <div className="text-xs text-blue-100">Solicita uso de áreas comunes</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Mi Residencia
              </h3>
            </div>
            
            <div className="px-6 py-6">
              {loadingDetails ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Cargando información...</p>
                </div>
              ) : userDetails?.habitacion ? (
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Home className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          Habitación {userDetails.habitacion.numero}
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-500">Edificio</p>
                            <p className="font-medium text-gray-900">{userDetails.habitacion.edificio.nombre}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Piso</p>
                            <p className="font-medium text-gray-900">Piso {userDetails.habitacion.piso}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Dormitorios</p>
                            <p className="font-medium text-gray-900">{userDetails.habitacion.dormitorios} hab.</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Baños</p>
                            <p className="font-medium text-gray-900">{userDetails.habitacion.banos}</p>
                          </div>
                          {userDetails.habitacion.area && (
                            <div>
                              <p className="text-gray-500">Área</p>
                              <p className="font-medium text-gray-900">{userDetails.habitacion.area.toFixed(1)} m²</p>
                            </div>
                          )}
                          <div>
                            <p className="text-gray-500">Alquiler Mensual</p>
                            <p className="font-bold text-green-600">Bs {userDetails.habitacion.precio.toLocaleString('es-BO')}/mes</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{userDetails.habitacion.edificio.direccion}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {userDetails.garajes && userDetails.garajes.length > 0 ? (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <Car className="w-4 h-4" />
                        Garajes Asignados
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {userDetails.garajes.map((garaje) => (
                          <div
                            key={garaje.id}
                            className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                                <Car className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">{garaje.numero}</p>
                                <p className="text-xs text-gray-500">
                                  {garaje.piso === -1 ? 'Sótano 1' : garaje.piso === -2 ? 'Sótano 2' : `Piso ${garaje.piso}`}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-green-600">Bs {garaje.precio}/mes</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                      <Car className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">No tienes garajes asignados</p>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Resumen Mensual</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Alquiler de habitación</span>
                        <span className="font-medium text-gray-900">Bs {userDetails.habitacion.precio.toLocaleString('es-BO')}</span>
                      </div>
                      {userDetails.garajes && userDetails.garajes.length > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Garajes ({userDetails.garajes.length})
                          </span>
                          <span className="font-medium text-gray-900">
                            Bs {userDetails.garajes.reduce((sum, g) => sum + g.precio, 0).toLocaleString('es-BO')}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-base border-t border-gray-200 pt-2 mt-2">
                        <span className="font-semibold text-gray-900">Total Mensual</span>
                        <span className="font-bold text-green-600">
                          Bs {(userDetails.habitacion.precio + (userDetails.garajes?.reduce((sum, g) => sum + g.precio, 0) || 0)).toLocaleString('es-BO')}/mes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-yellow-300 rounded-lg bg-yellow-50">
                  <Home className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                  <p className="text-lg font-medium text-yellow-900 mb-1">
                    Pendiente de Asignación
                  </p>
                  <p className="text-sm text-yellow-700">
                    Tu habitación aún no ha sido asignada. Por favor contacta con el administrador.
                  </p>
                </div>
              )}
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
