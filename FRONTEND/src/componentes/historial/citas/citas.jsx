import React, { useState, useEffect } from 'react';
import { Filter, Calendar, Search } from 'lucide-react';
import { supabase } from "../../../lib/supabase";

export default function Citas() {
  // Estados para datos de Citas desde Supabase
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para Filtros Avanzados en el Frontend
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  // Formateador de Fecha Simple (AAAA-MM-DD -> DD/MM/AAAA)
  const formatFechaManual = (dateString) => {
    if (!dateString) return '-';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // Formateador de Hora (HH:MM:SS -> HH:MM)
  const formatHora = (timeString) => {
    if (!timeString) return '-';
    return timeString.substring(0, 5);
  };

  // Obtener Citas Filtradas desde la Base de Datos
  const fetchCitasHistoricas = async () => {
    setLoading(true);
    try {
      // Traemos la data cruzando con las tablas relacionales de clientes y servicio
      const { data, error } = await supabase
        .from('citas')
        .select(`
          id,
          fecha,
          hora_inicio,
          duracion_minutos,
          precio,
          estado,
          notas,
          clientes ( nombre ),
          servicio ( nombre )
        `)
        .in('estado', ['Realizada', 'Cancelada']) // Filtro estricto solicitado
        .order('fecha', { ascending: false })
        .order('hora_inicio', { ascending: false });

      if (error) throw error;
      setCitas(data || []);
    } catch (error) {
      console.error('Error cargando el historial de citas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitasHistoricas();
  }, []);

  // Lógica de Filtros en Frontend
  const citasFiltradas = citas.filter(c => {
    // 1. Filtro por selector de Estado (Realizada o Cancelada)
    if (filtroEstado !== 'Todos' && c.estado !== filtroEstado) return false;

    // 2. Filtro por búsqueda del Cliente
    const nombreCliente = c.clientes?.nombre || 'Cliente General';
    if (busquedaCliente && !nombreCliente.toLowerCase().includes(busquedaCliente.toLowerCase())) {
      return false;
    }

    // 3. Filtro por Rango de Fechas
    if (c.fecha) {
      const fechaCitaMs = new Date(c.fecha).getTime();
      if (fechaInicio && fechaCitaMs < new Date(fechaInicio).getTime()) return false;
      if (fechaFin && fechaCitaMs > new Date(fechaFin).getTime()) return false;
    }

    return true;
  });

  return (
    <div className="p-6 bg-white dark:bg-[#141414] transition-colors">
      
      {/* SECCIÓN DE FILTROS SUPERIORES */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-sm flex flex-wrap gap-6 items-center">
        
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-gray-500 dark:text-gray-400">
          <Filter size={14} className="text-[#D4AF37]" />
          Auditoría de Citas:
        </div>

        {/* Buscador de Cliente */}
        <div className="flex items-center gap-2 text-xs bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 px-3 py-1.5 rounded-sm w-full sm:w-64">
          <Search size={14} className="opacity-40" />
          <input 
            type="text" 
            placeholder="Buscar cliente..."
            value={busquedaCliente}
            onChange={(e) => setBusquedaCliente(e.target.value)}
            className="bg-transparent outline-none w-full text-gray-600 dark:text-gray-300"
          />
        </div>

        {/* Rango de Fechas */}
        <div className="flex items-center gap-2 text-xs">
          <Calendar size={14} className="opacity-50" />
          <input 
            type="date" 
            value={fechaInicio} 
            onChange={(e) => setFechaInicio(e.target.value)}
            className="bg-transparent border-b border-gray-300 dark:border-gray-700 pb-0.5 outline-none focus:border-[#D4AF37] text-gray-600 dark:text-gray-300"
          />
          <span className="opacity-40 font-light">hasta</span>
          <input 
            type="date" 
            value={fechaFin} 
            onChange={(e) => setFechaFin(e.target.value)}
            className="bg-transparent border-b border-gray-300 dark:border-gray-700 pb-0.5 outline-none focus:border-[#D4AF37] text-gray-600 dark:text-gray-300"
          />
        </div>

        {/* Selector de Estado */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider">
          <span className="opacity-50">Estado:</span>
          <select 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)} 
            className="bg-transparent border-b border-gray-300 dark:border-gray-700 pb-0.5 outline-none focus:text-[#D4AF37] font-medium cursor-pointer dark:bg-[#1a1a1a]"
          >
            <option value="Todos">Ver Todas</option>
            <option value="Realizada">Realizada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>

        {/* Botón Limpiar Filtros */}
        {(busquedaCliente || fechaInicio || fechaFin || filtroEstado !== 'Todos') && (
          <button 
            onClick={() => { setBusquedaCliente(''); setFechaInicio(''); setFechaFin(''); setFiltroEstado('Todos'); }}
            className="text-[10px] uppercase tracking-widest font-bold text-rose-500 hover:underline ml-auto"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* TABLA PRINCIPAL DE CITAS PROCESADAS */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-[11px] uppercase tracking-widest opacity-60 bg-gray-50 dark:bg-[#1a1a1a]">
              <th className="p-4">Cliente</th>
              <th className="p-4">Tratamiento / Servicio</th>
              <th className="p-4">Planificación</th>
              <th className="p-4">Duración</th>
              <th className="p-4 text-right">Costo</th>
              <th className="p-4 text-center">Flujo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-xs uppercase tracking-widest opacity-40">
                  Cargando historial de agenda...
                </td>
              </tr>
            ) : citasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-xs uppercase tracking-widest opacity-40">
                  No se encontraron citas finalizadas o canceladas
                </td>
              </tr>
            ) : (
              citasFiltradas.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors">
                  {/* Cliente */}
                  <td className="p-4 font-medium">
                    {c.clientes?.nombre || 'Cliente General'}
                  </td>
                  
                  {/* Tratamiento / Servicio */}
                  <td className="p-4 text-xs tracking-wider opacity-90">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {c.servicio?.nombre || 'Servicio Desconocido'}
                    </span>
                    {c.notas && (
                      <span className="block text-[11px] text-gray-400 italic font-light truncate max-w-xs mt-0.5">
                        Nota: {c.notas}
                      </span>
                    )}
                  </td>
                  
                  {/* Planificación (Fecha y Hora) */}
                  <td className="p-4 text-xs font-light">
                    {formatFechaManual(c.fecha)} a las <span className="font-medium">{formatHora(c.hora_inicio)}</span>
                  </td>

                  {/* Duración */}
                  <td className="p-4 text-xs opacity-70">
                    {c.duracion_minutos || 0} min
                  </td>
                  
                  {/* Costo / Precio */}
                  <td className="p-4 text-right text-[#D4AF37] font-bold">
                    S/ {Number(c.precio || 0).toFixed(2)}
                  </td>
                  
                  {/* Flujo / Estado Badge */}
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-sm tracking-wider ${
                      c.estado === 'Realizada' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {c.estado}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}