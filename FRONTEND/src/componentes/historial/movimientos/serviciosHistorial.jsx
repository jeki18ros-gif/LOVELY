import React, { useState, useEffect } from 'react';
import { RotateCcw, Eye, X, History, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from "../../../lib/supabase";

export default function HistoryServicio() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  // Estado para el sistema de notificaciones flotantes (Toasts)
  const [notificacion, setNotificacion] = useState({ visible: false, mensaje: '', tipo: 'info' });

  const mostrarToast = (mensaje, tipo = 'info') => {
    setNotificacion({ visible: true, mensaje, tipo });
  };

  // Auto-cerrar el toast tras 4 segundos
  useEffect(() => {
    if (notificacion.visible) {
      const timer = setTimeout(() => {
        setNotificacion(prev => ({ ...prev, visible: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notificacion.visible]);

  const fetchHistorial = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('historial_servicios')
        .select('*')
        .order('fecha', { ascending: false });

      if (error) throw error;
      
      setLogs(data || []);
    } catch (error) {
      console.error("Error cargando historial de servicios:", error);
      mostrarToast("Error al conectar con la base de datos de servicios", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorial();
  }, []);

  const formatFechaLog = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleString('es-PE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRevertir = async (log) => {
    try {
      if (log.accion === 'Editado' && log.valores_anteriores) {
        const updateData = {
          precio: Number(log.valores_anteriores.precio),
          duracion: Number(log.valores_anteriores.duracion || 0),
        };

        if (log.valores_anteriores.nombre) updateData.nombre = log.valores_anteriores.nombre;
        if (log.valores_anteriores.descripcion) updateData.descripcion = log.valores_anteriores.descripcion;
        if (log.valores_anteriores.estado !== undefined) updateData.estado = log.valores_anteriores.estado;

        const { error } = await supabase
          .from('servicio')
          .update(updateData)
          .eq('id', log.servicio_id);

        if (error) throw error;

        mostrarToast(`¡Cambios en el servicio "${log.nombre_servicio}" revertidos con éxito!`, "success");
        fetchHistorial();
      }
    } catch (error) {
      console.error("Error al revertir servicio:", error);
      mostrarToast(`No se pudo revertir el servicio: ${error.message}`, "error");
    }
  };

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

      <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#D4AF37]">
        <History size={16} />
        Log de Auditoría de Servicios
      </div>

      <div className="border border-gray-200 dark:border-gray-800 rounded-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-[11px] uppercase tracking-widest opacity-60 bg-gray-50 dark:bg-[#1a1a1a]">
              <th className="p-4">Evento</th>
              <th className="p-4">Servicio</th>
              <th className="p-4">Cambios</th>
              <th className="p-4">Fecha</th>
              <th className="p-4 text-center">Detalles</th>
              <th className="p-4 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-xs uppercase tracking-widest opacity-40">
                  Cargando trazabilidad de servicios...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-xs uppercase tracking-widest opacity-40">
                  No hay registros de modificaciones aún.
                </td>
              </tr>
            ) : (
              logs.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div
                      className={`
                        inline-flex items-center gap-2 px-3 py-1 rounded-full
                        text-[11px] uppercase tracking-wider font-semibold
                        ${
                          m.accion === 'Creado' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                          m.accion === 'Editado' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                          m.accion === 'Revertido' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                          m.accion === 'Estado cambiado' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                          'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }
                      `}
                    >
                      <span>
                        {m.accion === 'Creado' ? '🟢' : m.accion === 'Editado' ? '✏️' : m.accion === 'Revertido' ? '↩️' : m.accion === 'Estado cambiado' ? '🔄' : '🗑️'}
                      </span>
                      {m.accion}
                    </div>
                  </td>
                  
                  <td className="p-4 font-medium">{m.nombre_servicio}</td>
                  
                  <td className="p-4 text-xs space-y-1">
                    {m.accion === 'Creado' ? (
                      <div className="text-emerald-400 font-medium">
                        Valor Inicial: S/ {Number(m.valores_actuales?.precio || 0).toFixed(2)} ({m.valores_actuales?.duracion || 0} min)
                      </div>
                    ) : m.accion === 'Eliminado' ? (
                      <div className="text-rose-400 opacity-80">
                        Servicio retirado del catálogo
                      </div>
                    ) : (
                      <>
                        {/* Render de Precios */}
                        {(m.valores_anteriores?.precio !== undefined || m.valores_actuales?.precio !== undefined) && (
                          <div className="flex items-center gap-2">
                            <span className="opacity-50 w-14">Precio:</span>
                            {m.accion === 'Editado' || m.accion === 'Revertido' ? (
                              <>
                                <span className="text-rose-400">
                                  S/ {Number(m.valores_anteriores?.precio || 0).toFixed(2)}
                                </span>
                                <span className="opacity-40">→</span>
                                <span className="text-emerald-400 font-semibold">
                                  S/ {Number(m.valores_actuales?.precio || 0).toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="text-emerald-400 font-semibold">
                                  S/ {Number(m.valores_actuales?.precio || m.valores_anteriores?.precio || 0).toFixed(2)}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Render de Duración */}
                        {(m.valores_anteriores?.duracion !== undefined || m.valores_actuales?.duracion !== undefined) && (
                          <div className="flex items-center gap-2">
                            <span className="opacity-50 w-14">Duración:</span>
                            {m.accion === 'Editado' || m.accion === 'Revertido' ? (
                              <>
                                <span className="text-rose-400">
                                  {m.valores_anteriores?.duracion} min
                                </span>
                                <span className="opacity-40">→</span>
                                <span className="text-emerald-400 font-semibold">
                                  {m.valores_actuales?.duracion} min
                                </span>
                              </>
                            ) : (
                              <span className="text-emerald-400 font-semibold">
                                {m.valores_actuales?.duracion || m.valores_anteriores?.duracion || 0} min
                              </span>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </td>
                  
                  <td className="p-4 text-xs opacity-70">{formatFechaLog(m.fecha)}</td>
                  
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => setSelectedLog(m)}
                      className="text-gray-400 hover:text-[#D4AF37] transition-colors"
                      title="Ver todos los campos modificados"
                    >
                      <Eye size={16} className="mx-auto" />
                    </button>
                  </td>

                  <td className="p-4 text-center">
                    {m.accion === 'Editado' && (
                      <button 
                        onClick={() => handleRevertir(m)}
                        className="text-xs text-[#D4AF37] font-medium tracking-wide hover:underline inline-flex items-center gap-1"
                      >
                        <RotateCcw size={12}/> Revertir
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL ELEGANTE */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-gray-800 p-6 rounded-sm w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]">
                Auditoría de Cambios / Servicio
              </h3>
              <button 
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-300">
              <p><span className="opacity-50 uppercase tracking-wider block text-[10px]">Servicio:</span> <strong className="text-white text-sm">{selectedLog.nombre_servicio}</strong></p>
              <p><span className="opacity-50 uppercase tracking-wider block text-[10px]">ID de Base de Datos:</span> <span className="font-mono opacity-80">{selectedLog.servicio_id}</span></p>
              <p><span className="opacity-50 uppercase tracking-wider block text-[10px]">Operación Realizada:</span> <span className="font-bold text-amber-400">{selectedLog.accion}</span></p>
              
              <div className="mt-4 space-y-3">
                {selectedLog.accion === 'Creado' ? (
                  <div className="bg-[#1a1a1a] border border-gray-800 rounded-sm p-4 space-y-2">
                    <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">Datos de Alta</div>
                    <p><span className="opacity-50">Precio:</span> S/ {Number(selectedLog.valores_actuales?.precio || 0).toFixed(2)}</p>
                    <p><span className="opacity-50">Duración:</span> {selectedLog.valores_actuales?.duracion || 0} minutos</p>
                    <p><span className="opacity-50">Descripción:</span> {selectedLog.valores_actuales?.descripcion || 'Sin descripción'}</p>
                  </div>
                ) : (
                  <>
                    {/* Bloque Precio Modificado */}
                    {(selectedLog.valores_anteriores?.precio !== undefined || selectedLog.valores_actuales?.precio !== undefined) && (
                      <div className="bg-[#1a1a1a] border border-gray-800 rounded-sm p-4">
                        <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Cambio de Precio</div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-[9px] text-gray-500 uppercase">Antes</div>
                            <div className="text-rose-400 text-lg font-semibold">
                              S/ {Number(selectedLog.valores_anteriores?.precio || 0).toFixed(2)}
                            </div>
                          </div>
                          <div className="text-gray-600 text-xl">→</div>
                          <div className="text-right">
                            <div className="text-[9px] text-gray-500 uppercase">Ahora</div>
                            <div className="text-emerald-400 text-lg font-semibold">
                              S/ {Number(selectedLog.valores_actuales?.precio || 0).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bloque Duración Modificada */}
                    {(selectedLog.valores_anteriores?.duracion !== undefined || selectedLog.valores_actuales?.duracion !== undefined) && (
                      <div className="bg-[#1a1a1a] border border-gray-800 rounded-sm p-4">
                        <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Cambio de Duración</div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-[9px] text-gray-500 uppercase">Antes</div>
                            <div className="text-rose-400 text-lg font-semibold">
                              {selectedLog.valores_anteriores?.duracion || 0} min
                            </div>
                          </div>
                          <div className="text-gray-600 text-xl">→</div>
                          <div className="text-right">
                            <div className="text-[9px] text-gray-500 uppercase">Ahora</div>
                            <div className="text-emerald-400 text-lg font-semibold">
                              {selectedLog.valores_actuales?.duracion || 0} min
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}