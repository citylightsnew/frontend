import { Navigate } from 'react-router-dom';
import { useRole } from '../hooks/useAuth';

export default function RoleBasedDashboard() {
  const { isAdmin } = useRole();

  if (isAdmin()) {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/user" replace />;
}
