import React, { useState, useEffect } from 'react';
import { Filter, Eye, Calendar, User, Search, X, ShoppingBag } from 'lucide-react';
import { supabase } from "../../../lib/supabase";

export default function Ventas() {
  // Estados para datos de Ventas (Tabla Principal)
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para Filtros Superiores
  const [filtroMetodo, setFiltroMetodo] = useState('Todos');
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  // Estados para el Modal de Detalle de Venta
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [detallesVenta, setDetallesVenta] = useState([]);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  // Formateador de Fecha/Hora Premium
  const formatFecha = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 1. Obtener Ventas desde Supabase
  const fetchVentas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ventas')
        .select('*')
        .order('fecha', { ascending: false });

      if (error) throw error;
      setVentas(data || []);
    } catch (error) {
      console.error('Error cargando ventas:', error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Obtener Detalle de Venta al abrir el Modal
  const fetchDetalleVenta = async (codigoVenta) => {
    setLoadingDetalle(true);
    try {
      const { data, error } = await supabase
        .from('detalle_venta')
        .select('*')
        .eq('codigo_venta', codigoVenta);

      if (error) throw error;
      setDetallesVenta(data || []);
    } catch (error) {
      console.error('Error cargando el detalle de la venta:', error);
    } finally {
      setLoadingDetalle(false);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  // Manejar apertura de detalles
  const handleVerDetalles = (venta) => {
    setVentaSeleccionada(venta);
    fetchDetalleVenta(venta.codigo_venta);
  };

  // Lógica de Filtrado en Frontend
  const ventasFiltradas = ventas.filter(v => {
    // Filtrar por Método de Pago (método de pago dinámico según tu BD de cierres)
    // Nota: Si en tu tabla ventas la columna método de pago se llama de otra forma o no está mapeada, 
    // asumimos 'metodo_pago' basándonos en tu tabla de gastos/cierres. Si no existe en ventas, puedes omitir este filtro.
    if (filtroMetodo !== 'Todos' && v.metodo_pago !== filtroMetodo) return false;

    // Filtrar por Búsqueda de Cliente
    if (busquedaCliente && v.nombre_cliente && !v.nombre_cliente.toLowerCase().includes(busquedaCliente.toLowerCase())) {
      return false;
    }

// Filtrar por Rango de Fechas (Corregido con Zona Horaria Local)
    if (v.fecha) {
      // 1. Creamos el objeto Date con la fecha de la BD
      const fechaObjeto = new Date(v.fecha);

      // 2. Extraemos año, mes y día en la zona horaria del navegador del usuario
      const anio = fechaObjeto.getFullYear();
      const mes = String(fechaObjeto.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
      const dia = String(fechaObjeto.getDate()).padStart(2, '0');

      // 3. Formateamos como 'YYYY-MM-DD' local
      const fechaVentaLocalTexto = `${anio}-${mes}-${dia}`;

      // 4. Comparamos los strings de forma segura
      if (fechaInicio && fechaVentaLocalTexto < fechaInicio) return false;
      if (fechaFin && fechaVentaLocalTexto > fechaFin) return false;
    }

    return true;
  });

  return (
    <div className="p-6 bg-white dark:bg-[#141414] transition-colors">
      
      {/* SECCIÓN DE FILTROS SUPERIORES */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-sm flex flex-wrap gap-6 items-center">
        
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-gray-500 dark:text-gray-400">
          <Filter size={14} className="text-[#D4AF37]" />
          Filtros de Venta:
        </div>

        {/* Buscador de Cliente */}
        <div className="flex items-center gap-2 text-xs bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 px-3 py-1.5 rounded-sm w-full sm:w-64">
          <Search size={14} className="opacity-40" />
          <input 
            type="text" 
            placeholder="Buscar por cliente..."
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

        {/* Limpiar Filtros */}
        {(busquedaCliente || fechaInicio || fechaFin || filtroMetodo !== 'Todos') && (
          <button 
            onClick={() => { setBusquedaCliente(''); setFechaInicio(''); setFechaFin(''); setFiltroMetodo('Todos'); }}
            className="text-[10px] uppercase tracking-widest font-bold text-rose-500 hover:underline ml-auto"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* TABLA PRINCIPAL (VENTAS) */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-[11px] uppercase tracking-widest opacity-60 bg-gray-50 dark:bg-[#1a1a1a]">
              <th className="p-4">Código de Venta</th>
              <th className="p-4">Fecha Emisión</th>
              <th className="p-4">Cliente</th>
              <th className="p-4 text-right">Total Facturado</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-xs uppercase tracking-widest opacity-40">
                  Cargando historial de ventas...
                </td>
              </tr>
            ) : ventasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-xs uppercase tracking-widest opacity-40">
                  No se encontraron registros de ventas
                </td>
              </tr>
            ) : (
              ventasFiltradas.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50/40 dark:hover:bg-white/2 transition-colors">
                  <td className="p-4 font-mono text-xs tracking-wider opacity-90">
                    {v.codigo_venta}
                  </td>
                  <td className="p-4 text-xs font-light">
                    {formatFecha(v.fecha)}
                  </td>
                  <td className="p-4 font-medium flex items-center gap-2">
                    <User size={13} className="text-gray-400" />
                    {v.nombre_cliente || "Cliente General"}
                  </td>
                  <td className="p-4 text-right text-[#D4AF37] font-bold">
                    S/ {Number(v.monto_total || 0).toFixed(2)}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleVerDetalles(v)}
                      className="text-[#D4AF37] hover:scale-125 transition-transform inline-block"
                      title="Ver desglose de artículos"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DETALLE DE VENTA ("VER MÁS") */}
      {ventaSeleccionada && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 w-full max-w-2xl shadow-2xl rounded-sm overflow-hidden animate-fadeIn">
            
            {/* Cabecera del Modal */}
            <div className="p-4 bg-gray-50 dark:bg-[#181818] border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                <ShoppingBag size={14} /> Detalle de Artículos / Servicios
              </div>
              <button 
                onClick={() => { setVentaSeleccionada(null); setDetallesVenta([]); }}
                className="text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Datos Generales de la Venta Abierta */}
            <div className="p-4 bg-gray-50/50 dark:bg-[#141414] border-b border-gray-100 dark:border-gray-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="block text-[10px] uppercase text-gray-400 tracking-wider">Código Comprobante</span>
                <span className="font-mono font-bold">{ventaSeleccionada.codigo_venta}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase text-gray-400 tracking-wider">Cliente</span>
                <span className="font-medium">{ventaSeleccionada.nombre_cliente || "Cliente General"}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase text-gray-400 tracking-wider">Fecha de Compra</span>
                <span className="font-light">{formatFecha(ventaSeleccionada.fecha)}</span>
              </div>
            </div>

            {/* Contenido / Tabla del Detalle */}
            <div className="p-4 max-h-[350px] overflow-y-auto">
              {loadingDetalle ? (
                <div className="p-8 text-center text-xs uppercase tracking-widest opacity-40">
                  Consultando sub-artículos...
                </div>
              ) : detallesVenta.length === 0 ? (
                <div className="p-8 text-center text-xs uppercase tracking-widest opacity-40 text-rose-400">
                  No se encontraron artículos registrados para esta venta.
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800 opacity-50 uppercase tracking-wider text-[10px]">
                      <th className="pb-2">Tipo</th>
                      <th className="pb-2">Cant.</th>
                      <th className="pb-2 text-right">Precio Unit.</th>
                      <th className="pb-2 text-right">Descuento</th>
                      <th className="pb-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
                    {detallesVenta.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/30 dark:hover:bg-white/1">
                        <td className="py-3 font-medium">
                          <span className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded-sm ${item.tipo === 'servicio' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'bg-blue-500/10 text-blue-400'}`}>
                            {item.tipo}
                          </span>
                        </td>
                        <td className="py-3 pl-2 opacity-80">{item.cantidad}</td>
                        <td className="py-3 text-right">S/ {Number(item.precio_unitario || 0).toFixed(2)}</td>
                        <td className="py-3 text-right text-rose-400">-S/ {Number(item.descuento || 0).toFixed(2)}</td>
                        <td className="py-3 text-right font-semibold text-gray-700 dark:text-gray-200">
                          S/ {Number(item.subtotal || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pie de Modal / Totalizador */}
            <div className="p-4 bg-gray-50 dark:bg-[#181818] border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <div className="text-left">
                <span className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold">Total Liquidado</span>
                <span className="text-base font-bold text-[#D4AF37]">S/ {Number(ventaSeleccionada.monto_total || 0).toFixed(2)}</span>
              </div>
              <button 
                onClick={() => { setVentaSeleccionada(null); setDetallesVenta([]); }}
                className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#222] transition-all rounded-sm"
              >
                Regresar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}