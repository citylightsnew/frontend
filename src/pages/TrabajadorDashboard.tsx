import { useAuth } from '../hooks/useAuth';
import { Button } from '../components';
import { LogOut, Briefcase, ClipboardList, AlertCircle } from 'lucide-react';
import logoImage from '../assets/logo.png';

export default function TrabajadorDashboard() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const getRoleLabel = () => {
    switch (user?.roleName) {
      case 'conserje':
        return 'Conserje';
      case 'limpieza':
        return 'Personal de Limpieza';
      case 'seguridad':
        return 'Personal de Seguridad';
      case 'mantenimiento':
        return 'Personal de Mantenimiento';
      default:
        return 'Trabajador';
    }
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
                <p className="text-xs text-gray-500">Panel de Trabajador</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 flex items-center justify-end">
                  <Briefcase size={12} className="mr-1" />
                  {getRoleLabel()}
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Bienvenido, {user?.name}</h2>
          <p className="text-gray-600 mt-1">Panel de {getRoleLabel()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Tareas Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <ClipboardList className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Tareas Completadas</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Incidencias</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Sistema de Gestión de Tareas
              </h3>
              <p className="text-blue-800 mb-4">
                Pronto podrás ver y gestionar tus tareas asignadas, reportar incidencias y coordinar con otros trabajadores del edificio desde este panel.
              </p>
              <div className="space-y-2 text-sm text-blue-700">
                <p>✓ Vista de tareas asignadas</p>
                <p>✓ Reportes de incidencias</p>
                <p>✓ Historial de mantenimientos</p>
                <p>✓ Coordinación con el equipo</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
