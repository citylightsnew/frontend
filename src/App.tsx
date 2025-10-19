import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, RoleBasedDashboard } from './components';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import AdminDashboard from './pages/AdminDashboard';
import TrabajadorDashboard from './pages/TrabajadorDashboard';
import UserDashboard from './pages/UserDashboard';

import AreasComunesPage from './pages/booking/AreasComunesPage';

import PagosPage from './pages/payments/PagosPage';
import FacturasPage from './pages/payments/FacturasPage';

import EmpleadosPage from './pages/nomina/EmpleadosPage';

import UsuariosHabitacionesPage from './pages/UsuariosHabitacionesPage';
import ReservasPage from './pages/booking/ReservasPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <RoleBasedDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user" 
            element={
              <ProtectedRoute requireRole="user">
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trabajador" 
            element={
              <ProtectedRoute>
                <TrabajadorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/residente" 
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/booking/areas" 
            element={
              <ProtectedRoute>
                <AreasComunesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/booking/reservas" 
            element={
              <ProtectedRoute>
                <ReservasPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/payments/pagos" 
            element={
              <ProtectedRoute>
                <PagosPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payments/facturas" 
            element={
              <ProtectedRoute>
                <FacturasPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/nomina/empleados" 
            element={
              <ProtectedRoute requireRole="admin">
                <EmpleadosPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/users/habitaciones" 
            element={
              <ProtectedRoute requireRole="admin">
                <UsuariosHabitacionesPage />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
