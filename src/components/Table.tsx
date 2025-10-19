import type { ReactNode } from 'react';
import { ChevronsUpDown } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => ReactNode;
  className?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
}

export default function Table<T extends Record<string, unknown>>({
  data,
  columns,
  onRowClick,
  loading = false,
  emptyMessage = 'No hay datos para mostrar',
  className = '',
  striped = true,
  hoverable = true,
}: TableProps<T>) {

  const renderCellValue = (column: Column<T>, row: T) => {
    const value = row[column.key as keyof T];
    
    if (column.render) {
      return column.render(value, row);
    }

    if (value === null || value === undefined) {
      return <span className="text-gray-400">-</span>;
    }

    if (typeof value === 'boolean') {
      return value ? 'Sí' : 'No';
    }

    if (value instanceof Date) {
      return value.toLocaleDateString();
    }

    return String(value);
  };

  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;
    console.log('Sort by:', column.key);
  };

  const renderSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;

    return <ChevronsUpDown className="w-4 h-4 ml-1 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="w-full overflow-x-auto">
        <div className="min-w-full bg-white rounded-lg shadow">
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full overflow-x-auto">
        <div className="min-w-full bg-white rounded-lg shadow">
          <div className="p-8 text-center text-gray-500">
            {emptyMessage}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((column, index) => (
              <th
                key={String(column.key) + index}
                onClick={() => handleSort(column)}
                className={`
                  px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider
                  ${column.sortable ? 'cursor-pointer hover:bg-gray-100 select-none' : ''}
                  ${column.className || ''}
                `}
              >
                <div className="flex items-center">
                  {column.label}
                  {renderSortIcon(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={`
                ${striped && rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                ${hoverable ? 'hover:bg-blue-50 transition-colors' : ''}
                ${onRowClick ? 'cursor-pointer' : ''}
              `}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={String(column.key) + colIndex}
                  className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${column.className || ''}`}
                >
                  {renderCellValue(column, row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
