import React, { useState, useEffect } from 'react';
import { Eye, Calendar, Filter, X, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from "../../../lib/supabase";
import { calcularArqueo } from '../../finanzas/cierredecaja/cuadreCaja';

export default function CierreCaja() {
  // Estados para los filtros superiores
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [cierresCaja, setCierresCaja] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para controlar el modal de "Ver más"
  const [cierreSeleccionado, setCierreSeleccionado] = useState(null);

  // Estado para el sistema de notificaciones flotantes (Toasts)
  const [notificacion, setNotificacion] = useState({ visible: false, mensaje: '', tipo: 'info' });

  // Formateador de fecha/hora
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

  const mostrarToast = (mensaje, tipo = 'info') => {
    setNotificacion({ visible: true, mensaje, tipo });
  };

  // Auto-cerrar la notificación después de 4 segundos
useEffect(() => {
    let isMounted = true;

    const fetchCierresCaja = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('cierre_caja')
          .select('*')
          .order('fecha_cierre', { ascending: false });

        if (error) throw error;
        const cierresUnicosPorDia = {};

        (data || []).forEach((cierre) => {
          const fechaStr = cierre.fecha_cierre || cierre.fecha_apertura;
          if (!fechaStr) return;

          const claveDia = fechaStr.split('T')[0];

          const totalContado = 
            Number(cierre.efectivo_contado || 0) +
            Number(cierre.yape_contado || 0) +
            Number(cierre.plin_contado || 0) +
            Number(cierre.tarjeta_contado || 0);

          const saldoEsperado = 
            Number(cierre.base_inicial || 0) + 
            Number(cierre.ingresos_sistema || 0) - 
            Number(cierre.egresos_sistema || 0);
          const arqueo = calcularArqueo(saldoEsperado, totalContado);

          const cierreProcesado = {
            ...cierre,
            diferenciaCalculada: arqueo.diferencia,
            estadoArqueo: arqueo.estado,
            deficitGlobal: arqueo.deficitGlobal,
            totalContado
          };

          if (!cierresUnicosPorDia[claveDia]) {
            cierresUnicosPorDia[claveDia] = cierreProcesado;
          } else {
            const fechaActual = new Date(cierreProcesado.fecha_cierre || 0);
            const fechaExistente = new Date(cierresUnicosPorDia[claveDia].fecha_cierre || 0);
            if (fechaActual > fechaExistente) {
              cierresUnicosPorDia[claveDia] = cierreProcesado;
            }
          }
        });

        const listaFinal = Object.values(cierresUnicosPorDia).sort((a, b) => {
          return new Date(b.fecha_cierre || 0) - new Date(a.fecha_cierre || 0);
        });

        if (isMounted) {
          setCierresCaja(listaFinal);
        }
      } catch (error) {
        console.error('Error cargando cierres:', error);
        if (isMounted) mostrarToast("Error al conectar con la base de datos de auditoría", "error");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCierresCaja();

    return () => {
      isMounted = false;
    };
  }, []);

  // Lógica de Filtrado por Estado y Fechas
  const cierresFiltrados = cierresCaja.filter(c => {
    if (filtroEstado !== 'Todos' && c.estadoArqueo !== filtroEstado) {
      return false;
    }

    const fechaBase = c.fecha_cierre || c.fecha_apertura;
    if (fechaBase) {
      const claveFechaCierre = fechaBase.split('T')[0];
      if (fechaInicio && claveFechaCierre < fechaInicio) return false;
      if (fechaFin && claveFechaCierre > fechaFin) return false;
    }

    return true;
  });

  return (
    <div className="p-6 bg-white dark:bg-[#141414] transition-colors relative">
      
      {/* NOTIFICACIÓN FLOTANTE (TOAST) */}
      {notificacion.visible && (
        <div className={`fixed bottom-5 right-5 z-[60] flex items-center gap-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300 ${
          notificacion.tipo === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' :
          notificacion.tipo === 'warning' ? 'bg-yellow-600/10 border-yellow-600/30 text-yellow-600 dark:text-yellow-400' :
          'bg-red-500/10 border-red-500/30 text-red-500'
        }`}>
          {notificacion.tipo === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <p className="text-sm font-medium">{notificacion.mensaje}</p>
          <button 
            type="button"
            onClick={() => setNotificacion(prev => ({ ...prev, visible: false }))} 
            className="ml-2 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}
      
      {/* SECCIÓN DE FILTROS SUPERIORES */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-sm flex flex-wrap gap-6 items-center">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-gray-500 dark:text-gray-400">
          <Filter size={14} className="text-[#D4AF37]" />
          Filtros de Auditoría:
        </div>

        {/* Filtro por rango de fecha */}
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

        {/* Filtro por estado */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider">
          <span className="opacity-50">Estado:</span>
          <select 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="bg-transparent border-b border-gray-300 dark:border-gray-700 pb-0.5 outline-none focus:text-[#D4AF37] font-medium cursor-pointer dark:bg-[#1a1a1a]"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Cuadrado">Cuadrado</option>
            <option value="Déficit / Pérdida">Déficit / Pérdida</option>
            <option value="Faltante">Faltante</option>
            <option value="Sobrante">Sobrante</option>
          </select>
        </div>

        {/* Botón para limpiar filtros */}
        {(fechaInicio || fechaFin || filtroEstado !== 'Todos') && (
          <button 
            onClick={() => { setFechaInicio(''); setFechaFin(''); setFiltroEstado('Todos'); }}
            className="text-[10px] uppercase tracking-widest font-bold text-rose-500 hover:underline ml-auto"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* TABLA DE CONTENIDO PRINCIPAL */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-[11px] uppercase tracking-widest opacity-60 bg-gray-50 dark:bg-[#1a1a1a]">
              <th className="p-4">Fecha de Cierre</th>
              <th className="p-4 text-right">Ingresos Sistema</th>
              <th className="p-4 text-right">Egresos Sistema</th>
              <th className="p-4 text-right">Diferencia</th>
              <th className="p-4 text-center">Estado</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-xs uppercase tracking-widest opacity-40">
                  Cargando cierres de caja...
                </td>
              </tr>
            ) : cierresFiltrados.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-xs uppercase tracking-widest opacity-40">
                  No se encontraron datos
                </td>
              </tr>
            ) : (
              cierresFiltrados.map((c) => {
                const dif = c.diferenciaCalculada;
                const textoEstado = c.estadoArqueo;
                const badgeEstilo = textoEstado === 'Déficit / Pérdida'
                  ? 'bg-red-950/20 text-red-800 border border-red-800/40 dark:text-red-400'
                  : textoEstado === 'Faltante'
                    ? 'bg-rose-500/10 text-rose-400'
                    : textoEstado === 'Sobrante'
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'bg-emerald-500/10 text-emerald-400';

                return (
                  <tr key={c.id} className="hover:bg-gray-50/40 dark:hover:bg-white/2 transition-colors">
                    <td className="p-4 font-light text-xs">
                      {formatFecha(c.fecha_cierre || c.fecha_apertura)}
                    </td>
                    <td className="p-4 text-right text-emerald-500 font-medium">
                      <span className="notranslate" translate="no">S/ {Number(c.ingresos_sistema || 0).toFixed(2)}</span>
                    </td>
                    <td className="p-4 text-right text-rose-500">
                      <span className="notranslate" translate="no">S/ {Number(c.egresos_sistema || 0).toFixed(2)}</span>
                    </td>
                    <td className={`p-4 text-right font-bold ${textoEstado === 'Déficit / Pérdida' || textoEstado === 'Faltante' ? 'text-rose-500' : textoEstado === 'Sobrante' ? 'text-amber-500' : 'text-emerald-500'}`}>
                      <span className="block notranslate" translate="no">S/ {Number(dif || 0).toFixed(2)}</span>
                      {textoEstado === 'Déficit / Pérdida' && (
                        <span className="block text-[10px] font-semibold text-red-800 dark:text-red-400 notranslate" translate="no">
                          Déficit: S/ {Number(c.deficitGlobal || 0).toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-sm tracking-wider ${badgeEstilo}`}>
                        {textoEstado}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => setCierreSeleccionado(c)}
                        className="text-[#D4AF37] hover:scale-125 transition-transform inline-block"
                        title="Ver detalles de auditoría"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DETALLE DE "VER MÁS" */}
      {cierreSeleccionado && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 w-full max-w-lg shadow-2xl rounded-sm overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Cabecera del Detalle */}
            <div className="p-4 bg-gray-50 dark:bg-[#181818] border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                <DollarSign size={14} /> Desglose Físico Completo
              </div>
              <button 
                onClick={() => setCierreSeleccionado(null)}
                className="text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Cuerpo de la Información */}
            <div className="p-6 space-y-5">
              
              {/* Tiempos de Cierre */}
              <div className="grid grid-cols-2 gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-medium">Fecha Cierre</span>
                  <span className="text-xs font-light">{formatFecha(cierreSeleccionado.fecha_cierre)}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-medium">Base Inicial</span>
                  <span className="text-xs font-semibold text-blue-400 notranslate" translate="no">S/ {Number(cierreSeleccionado.base_inicial || 0).toFixed(2)}</span>
                </div>
              </div>

              {/* Bloque Financiero Desglosado */}
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-[#161616] p-3 space-y-2 rounded-sm border border-gray-100 dark:border-gray-800/80">
                  <span className="block text-[10px] uppercase tracking-widest font-bold opacity-40 mb-1 text-[#D4AF37]">Conteo de Dinero Físico</span>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="opacity-70">Efectivo Contado:</span>
                    <span className="font-medium notranslate" translate="no">S/ {Number(cierreSeleccionado.efectivo_contado || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="opacity-70">Yape Contado:</span>
                    <span className="font-medium notranslate" translate="no">S/ {Number(cierreSeleccionado.yape_contado || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="opacity-70">Tarjeta Contada:</span>
                    <span className="font-medium notranslate" translate="no">S/ {Number(cierreSeleccionado.tarjeta_contado || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="opacity-70">Plin Contado:</span>
                    <span className="font-medium notranslate" translate="no">S/ {Number(cierreSeleccionado.plin_contado || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Totalizadores finales */}
              <div className="pt-2 grid grid-cols-2 gap-4 text-center">
                <div className="p-2 bg-emerald-500/5 border border-emerald-500/10 rounded-sm">
                  <span className="block text-[9px] uppercase tracking-wider text-emerald-400 font-bold">Total Sistema</span>
                  <span className="text-sm font-bold text-emerald-500 notranslate" translate="no">S/ {Number(cierreSeleccionado.ingresos_sistema || 0).toFixed(2)}</span>
                </div>
                <div className="p-2 bg-black/10 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-sm">
                  <span className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold">Diferencia Final</span>
                  <span className={`text-sm font-bold ${cierreSeleccionado.estadoArqueo === 'Déficit / Pérdida' ? 'text-red-800 dark:text-red-400' : cierreSeleccionado.estadoArqueo === 'Faltante' ? 'text-rose-500' : cierreSeleccionado.estadoArqueo === 'Sobrante' ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {cierreSeleccionado.estadoArqueo}
                    <span className="block notranslate" translate="no">Diferencia: S/ {Number(cierreSeleccionado.diferenciaCalculada || 0).toFixed(2)}</span>
                    {cierreSeleccionado.estadoArqueo === 'Déficit / Pérdida' && (
                      <span className="block text-xs notranslate" translate="no">Déficit: S/ {Number(cierreSeleccionado.deficitGlobal || 0).toFixed(2)}</span>
                    )}
                  </span>
                </div>
              </div>

            </div>

            {/* Pie del Modal */}
            <div className="p-3 bg-gray-50 dark:bg-[#181818] border-t border-gray-200 dark:border-gray-800 text-right">
              <button 
                onClick={() => setCierreSeleccionado(null)}
                className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#222] transition-all rounded-sm"
              >
                Cerrar Auditoría
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}