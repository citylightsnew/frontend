import { useState } from 'react';
import { Plus, Search, Filter, DollarSign } from 'lucide-react';
import { PagoCard, PaymentMethodModal } from '../../components';
import { usePagosReserva } from '../../hooks/usePayments';
import type { MetodoPago } from '../../types/payments.types';

export default function PagosPage() {
  const { pagos, loading, error, confirmPago, refundPago } = usePagosReserva();
  
  const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<'all' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'>('all');
  const [filterMetodo, setFilterMetodo] = useState<'all' | MetodoPago>('all');

  const handleCreatePayment = () => {
    setIsPaymentMethodModalOpen(true);
  };

  const handleMethodSelect = async (metodo: MetodoPago) => {
    // Here you would typically navigate to a payment creation form
    // For now, just close the modal
    console.log('Selected payment method:', metodo);
    setIsPaymentMethodModalOpen(false);
  };

  const handleConfirm = async (id: string) => {
    if (confirm('¿Confirmar este pago?')) {
      await confirmPago(id);
    }
  };

  const handleRefund = async (id: string) => {
    if (confirm('¿Está seguro de reembolsar este pago? Esta acción no se puede deshacer.')) {
      await refundPago(id);
    }
  };

  const filteredPagos = pagos?.filter(pago => {
    const matchesSearch = pago.usuarioNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pago.usuarioEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pago.reservaArea.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = filterEstado === 'all' || pago.estado === filterEstado;
    const matchesMetodo = filterMetodo === 'all' || pago.metodoPago === filterMetodo;
    
    return matchesSearch && matchesEstado && matchesMetodo;
  });

  const getEstadisticas = () => {
    if (!pagos) return { total: 0, monto: 0, pending: 0, completed: 0, failed: 0, refunded: 0 };
    
    return {
      total: pagos.length,
      monto: pagos.reduce((sum, p) => sum + p.monto, 0),
      pending: pagos.filter(p => p.estado === 'PENDING').length,
      completed: pagos.filter(p => p.estado === 'COMPLETED').length,
      failed: pagos.filter(p => p.estado === 'FAILED').length,
      refunded: pagos.filter(p => p.estado === 'REFUNDED').length,
    };
  };

  const stats = getEstadisticas();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pagos de Reservas</h1>
        <p className="text-gray-600">Gestiona los pagos de las reservas de áreas comunes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-600">Total Pagos</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-sm p-4 text-white">
          <div className="flex items-center gap-1 mb-1">
            <DollarSign className="w-4 h-4" />
            <p className="text-xl font-bold">Bs. {stats.monto.toFixed(2)}</p>
          </div>
          <p className="text-xs text-green-100">Monto Total</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow-sm p-4">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-yellow-700">Pendientes</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-sm p-4">
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          <p className="text-sm text-green-700">Completados</p>
        </div>
        <div className="bg-red-50 rounded-lg shadow-sm p-4">
          <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
          <p className="text-sm text-red-700">Fallidos</p>
        </div>
        <div className="bg-orange-50 rounded-lg shadow-sm p-4">
          <p className="text-2xl font-bold text-orange-600">{stats.refunded}</p>
          <p className="text-sm text-orange-700">Reembolsados</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por usuario, email o área..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 items-center flex-wrap">
            <Filter className="w-5 h-5 text-gray-600" />
            
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value as typeof filterEstado)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="PENDING">Pendientes</option>
              <option value="PROCESSING">Procesando</option>
              <option value="COMPLETED">Completados</option>
              <option value="FAILED">Fallidos</option>
              <option value="REFUNDED">Reembolsados</option>
            </select>

            <select
              value={filterMetodo}
              onChange={(e) => setFilterMetodo(e.target.value as typeof filterMetodo)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los métodos</option>
              <option value="STRIPE_CARD">Tarjeta (Stripe)</option>
              <option value="STRIPE_TRANSFER">Transferencia (Stripe)</option>
              <option value="QR_BANCARIO">QR Bancario</option>
              <option value="CASH">Efectivo</option>
            </select>
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreatePayment}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nuevo Pago
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredPagos?.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay pagos</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterEstado !== 'all' || filterMetodo !== 'all'
              ? 'No se encontraron pagos con los filtros aplicados'
              : 'Los pagos aparecerán aquí cuando se realicen'}
          </p>
        </div>
      )}

      {/* Pagos Grid */}
      {!loading && filteredPagos && filteredPagos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPagos.map((pago) => (
            <PagoCard
              key={pago.id}
              pago={pago}
              showActions
              onConfirm={() => handleConfirm(pago.id)}
              onRefund={() => handleRefund(pago.id)}
            />
          ))}
        </div>
      )}

      {/* Payment Method Modal */}
      <PaymentMethodModal
        isOpen={isPaymentMethodModalOpen}
        onClose={() => setIsPaymentMethodModalOpen(false)}
        onSelect={handleMethodSelect}
        amount={0}
        description="Nuevo pago de reserva"
      />
    </div>
  );
}
