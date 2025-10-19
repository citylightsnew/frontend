import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RoleBasedDashboard() {
  const { user, logout } = useAuth();

  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  const categoria = user.role?.categoria;
  const roleName = user.roleName || user.role?.name;

  if (!categoria) {
    console.warn('Usuario sin categoria, usando fallback por nombre de rol:', roleName);
    
    if (!roleName) {
      console.error('Usuario sin rol válido, cerrando sesión');
      logout();
      return <Navigate to="/login" replace />;
    }
    
    if (roleName === 'admin' || roleName === 'user') {
      return <Navigate to="/admin" replace />;
    }
    
    if (['conserje', 'limpieza', 'seguridad', 'mantenimiento'].includes(roleName)) {
      return <Navigate to="/trabajador" replace />;
    }
    
    return <Navigate to="/residente" replace />;
  }

  if (categoria === 'superusuario') {
    return <Navigate to="/admin" replace />;
  }

  if (categoria === 'trabajador') {
    return <Navigate to="/trabajador" replace />;
  }

  return <Navigate to="/residente" replace />;
}
