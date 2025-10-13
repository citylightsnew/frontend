import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components';
import { LogOut, Shield, Users, UserCog, LayoutDashboard } from 'lucide-react';
import logoImage from '../assets/logo.png';
import UsersManagement from './UsersManagement';
import RolesManagement from './RolesManagement';

type ActiveView = 'dashboard' | 'users' | 'roles';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const menuItems = [
    { id: 'dashboard' as ActiveView, label: 'Panel Principal', icon: LayoutDashboard },
    { id: 'users' as ActiveView, label: 'Usuarios', icon: Users },
    { id: 'roles' as ActiveView, label: 'Roles', icon: UserCog },
  ];

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
                <p className="text-xs text-gray-500">Panel de Administración</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 flex items-center justify-end">
                  <Shield size={12} className="mr-1" />
                  Administrador
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

      <div className="flex max-w-7xl mx-auto">
        <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-4rem)] border-r">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {activeView === 'dashboard' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Panel Principal</h2>
                <p className="text-gray-600 mt-1">Resumen del sistema</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                      <p className="text-2xl font-bold text-gray-900">-</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <UserCog className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Roles</p>
                      <p className="text-2xl font-bold text-gray-900">-</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
                      <p className="text-2xl font-bold text-gray-900">-</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => setActiveView('users')}
                    variant="outline"
                    icon={<Users size={20} />}
                    fullWidth
                  >
                    Gestionar Usuarios
                  </Button>
                  <Button
                    onClick={() => setActiveView('roles')}
                    variant="outline"
                    icon={<UserCog size={20} />}
                    fullWidth
                  >
                    Gestionar Roles
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeView === 'users' && <UsersManagement />}
          {activeView === 'roles' && <RolesManagement />}
        </main>
      </div>
    </div>
  );
}
