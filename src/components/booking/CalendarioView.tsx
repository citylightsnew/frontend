import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import type { Reserva } from '../../types/booking.types';

interface CalendarioViewProps {
  reservas: Reserva[];
  onDateClick?: (date: Date) => void;
  onReservaClick?: (reserva: Reserva) => void;
}

export default function CalendarioView({ 
  reservas, 
  onDateClick,
  onReservaClick,
}: CalendarioViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { year, month } = useMemo(() => {
    return {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
    };
  }, [currentDate]);

  const daysInMonth = useMemo(() => {
    return new Date(year, month + 1, 0).getDate();
  }, [year, month]);

  const firstDayOfMonth = useMemo(() => {
    return new Date(year, month, 1).getDay();
  }, [year, month]);

  const monthName = useMemo(() => {
    return new Date(year, month).toLocaleDateString('es-BO', { month: 'long' });
  }, [year, month]);

  const reservasByDate = useMemo(() => {
    const map = new Map<string, Reserva[]>();
    
    reservas.forEach(reserva => {
      const startDate = new Date(reserva.inicio);
      const dateKey = `${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()}`;
      
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)?.push(reserva);
    });
    
    return map;
  }, [reservas]);

  const getReservasForDay = (day: number): Reserva[] => {
    const dateKey = `${year}-${month}-${day}`;
    return reservasByDate.get(dateKey) || [];
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const getStatusColor = (estado: string): string => {
    switch (estado) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      const day = i - firstDayOfMonth + 1;
      const isValidDay = day > 0 && day <= daysInMonth;
      const dayReservas = isValidDay ? getReservasForDay(day) : [];
      const today = isToday(day);

      days.push(
        <div
          key={i}
          className={`
            min-h-[120px] border border-gray-200 p-2
            ${isValidDay ? 'bg-white hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'}
            ${today ? 'ring-2 ring-blue-500' : ''}
          `}
          onClick={() => {
            if (isValidDay) {
              onDateClick?.(new Date(year, month, day));
            }
          }}
        >
          {isValidDay && (
            <>
              <div className={`
                text-sm font-semibold mb-1
                ${today ? 'text-blue-600' : 'text-gray-700'}
              `}>
                {day}
              </div>
              
              <div className="space-y-1">
                {dayReservas.slice(0, 3).map(reserva => (
                  <div
                    key={reserva.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onReservaClick?.(reserva);
                    }}
                    className={`
                      text-xs px-2 py-1 rounded border truncate
                      ${getStatusColor(reserva.estado)}
                      hover:opacity-80 transition-opacity
                    `}
                  >
                    {new Date(reserva.inicio).toLocaleTimeString('es-BO', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })} - {reserva.area?.nombre || 'Sin área'}
                  </div>
                ))}
                
                {dayReservas.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayReservas.length - 3} más
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900 capitalize">
            {monthName} {year}
          </h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleToday}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            Hoy
          </button>
          
          <button
            onClick={handlePrevMonth}
            className="p-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
            title="Mes anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleNextMonth}
            className="p-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
            title="Mes siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-0 mb-2">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0">
        {renderCalendarDays()}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-100 border border-green-300"></div>
          <span className="text-xs text-gray-600">Confirmada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-300"></div>
          <span className="text-xs text-gray-600">Pendiente</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300"></div>
          <span className="text-xs text-gray-600">Completada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-100 border border-red-300"></div>
          <span className="text-xs text-gray-600">Cancelada</span>
        </div>
      </div>
    </div>
  );
}
