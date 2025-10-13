import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import type { AuthContextType } from '../types';

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
}

export function useRole() {
  const { user } = useAuth();
  
  return {
    hasRole: (role: string) => user?.roleName === role,
    isAdmin: () => user?.roleName === 'admin',
    isUser: () => user?.roleName === 'user',
    currentRole: user?.roleName || null,
  };
}

export function useAuthRedirect() {
  const { isAuthenticated, isLoading } = useAuth();
  
  const redirectToLogin = () => {
    window.location.href = '/login';
  };
  
  const redirectToDashboard = () => {
    window.location.href = '/dashboard';
  };
  
  const redirectIfAuthenticated = () => {
    if (!isLoading && isAuthenticated) {
      redirectToDashboard();
    }
  };
  
  const redirectIfNotAuthenticated = () => {
    if (!isLoading && !isAuthenticated) {
      redirectToLogin();
    }
  };
  
  return {
    redirectToLogin,
    redirectToDashboard,
    redirectIfAuthenticated,
    redirectIfNotAuthenticated,
  };
}

export function useProtectedRoute(requireRole?: 'admin' | 'user') {
  const { isAuthenticated, user } = useAuth();
  const { hasRole } = useRole();

  const hasAccess = isAuthenticated && user && (!requireRole || hasRole(requireRole));
  
  return {
    hasAccess,
    isAuthenticated,
    user,
    currentRole: user?.roleName,
    requireRole,
  };
}
