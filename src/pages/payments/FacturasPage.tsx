import { useState } from 'react';
import { Search, Filter, FileText, Download } from 'lucide-react';
import { FacturaCard } from '../../components';
import { useFacturas } from '../../hooks/usePayments';

export default function FacturasPage() {
  const { facturas, loading, error, anularFactura, downloadPdf } = useFacturas();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<'all' | 'EMITIDA' | 'ANULADA'>('all');

  const handleAnular = async (id: string) => {
    const motivo = prompt('¿Por qué desea anular esta factura?');
    if (motivo && motivo.trim()) {
      await anularFactura(id, { motivoAnulacion: motivo.trim() });
    }
  };

  const handleDownload = async (id: string) => {
    try {
      await downloadPdf(id);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert('Error al descargar el PDF de la factura');
    }
  };

  const filteredFacturas = facturas?.filter(factura => {
    const matchesSearch = factura.numeroFactura.toString().includes(searchTerm) ||
                         factura.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         factura.nit.includes(searchTerm);
    
    const matchesEstado = filterEstado === 'all' || factura.estado === filterEstado;
    
    return matchesSearch && matchesEstado;
  });

  const getEstadisticas = () => {
    if (!facturas) return { total: 0, monto: 0, emitidas: 0, anuladas: 0 };
    
    const emitidas = facturas.filter(f => f.estado === 'EMITIDA');
    
    return {
      total: facturas.length,
      monto: emitidas.reduce((sum, f) => sum + f.monto, 0),
      emitidas: emitidas.length,
      anuladas: facturas.filter(f => f.estado === 'ANULADA').length,
    };
  };

  const stats = getEstadisticas();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Facturas</h1>
        <p className="text-gray-600">Gestiona las facturas emitidas</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-gray-600" />
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <p className="text-sm text-gray-600">Total Facturas</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-sm p-4 text-white">
          <p className="text-xl font-bold mb-1">Bs. {stats.monto.toFixed(2)}</p>
          <p className="text-xs text-green-100">Monto Facturado</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-sm p-4">
          <p className="text-2xl font-bold text-green-600">{stats.emitidas}</p>
          <p className="text-sm text-green-700">Emitidas</p>
        </div>
        <div className="bg-red-50 rounded-lg shadow-sm p-4">
          <p className="text-2xl font-bold text-red-600">{stats.anuladas}</p>
          <p className="text-sm text-red-700">Anuladas</p>
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
              placeholder="Buscar por número, razón social o NIT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filter */}
          <div className="flex gap-2 items-center">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value as typeof filterEstado)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="EMITIDA">Emitidas</option>
              <option value="ANULADA">Anuladas</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            onClick={() => alert('Exportar funcionalidad en desarrollo')}
          >
            <Download className="w-5 h-5" />
            Exportar
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
      {!loading && filteredFacturas?.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FileText className="mx-auto h-16 w-16" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay facturas</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterEstado !== 'all'
              ? 'No se encontraron facturas con los filtros aplicados'
              : 'Las facturas aparecerán aquí cuando se generen'}
          </p>
        </div>
      )}

      {/* Facturas Grid */}
      {!loading && filteredFacturas && filteredFacturas.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFacturas.map((factura) => (
              <FacturaCard
                key={factura.id}
                factura={factura}
                showActions
                onDownload={() => handleDownload(factura.id)}
                onAnular={() => handleAnular(factura.id)}
              />
            ))}
          </div>

          {/* Pagination Info */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Mostrando {filteredFacturas.length} de {facturas?.length || 0} facturas
          </div>
        </>
      )}
    </div>
  );
}
