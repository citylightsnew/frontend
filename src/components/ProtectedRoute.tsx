import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, useRole } from '../hooks/useAuth';
import { LoadingScreen } from './Spinner';

interface ProtectedRouteProps {
  children: ReactNode;
  requireRole?: 'admin' | 'user';
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requireRole,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { hasRole } = useRole();

  if (isLoading) {
    return <LoadingScreen message="Verificando autenticación..." />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requireRole && !hasRole(requireRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Acceso Denegado
          </h2>
          <p className="text-gray-600 mb-4">
            No tienes los permisos necesarios para acceder a esta página.
          </p>
          <p className="text-sm text-gray-500">
            Rol requerido: <span className="font-semibold">{requireRole}</span>
            <br />
            Tu rol actual: <span className="font-semibold">{user.roleName}</span>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}


