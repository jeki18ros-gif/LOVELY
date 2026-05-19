import React, { useState, useEffect } from 'react';
import { RotateCcw, Eye, X, History } from 'lucide-react';
import { supabase } from "../../../lib/supabase";

export default function HistoryProductos() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para controlar el modal "Ver más"
  const [selectedLog, setSelectedLog] = useState(null);

  // Cargar el historial desde Supabase
  const fetchHistorial = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('historial_productos')
        .select('*')
        .order('fecha', { ascending: false });

      if (error) {
        alert("Error de Supabase: " + error.message);
        throw error;
      }
      
      console.log("Datos recibidos de Supabase:", data);
      setLogs(data || []);
    } catch (error) {
      console.error("Error cargando historial de productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorial();
  }, []);

  // Función para formatear fechas de auditoría
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

  // Función para revertir el cambio
  const handleRevertir = async (log) => {
    try {
      if (log.accion === 'Editado' && log.valores_anteriores) {
        // Restaurar los valores en la tabla original de productos usando el FK producto_id
        const { error } = await supabase
          .from('producto')
          .update({
            precio: Number(log.valores_anteriores.precio),
            stock: parseInt(log.valores_anteriores.stock, 10),
          })
          .eq('id', log.producto_id);

        if (error) throw error;
        
        // Registrar la reversión como una nueva edición
        await supabase.from('historial_productos').insert({
          producto_id: log.producto_id,
          nombre_producto: log.nombre_producto,
          accion: 'Editado',
          valores_anteriores: log.valores_actuales,
          valores_actuales: log.valores_anteriores
        });

        alert('¡Cambio revertido con éxito!');
        fetchHistorial(); // Recargar tabla
      }
    } catch (error) {
      console.error("Error al revertir:", error);
      alert("No se pudo revertir: " + error.message);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-[#141414] transition-colors relative">
      
      <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#D4AF37]">
        <History size={16} />
        Log de Auditoría de Inventario
      </div>

      <div className="border border-gray-200 dark:border-gray-800 rounded-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 text-[11px] uppercase tracking-widest opacity-60 bg-gray-50 dark:bg-[#1a1a1a]">
              <th className="p-4">Evento</th>
              <th className="p-4">Producto</th>
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
                  Cargando trazabilidad de productos...
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
                <tr key={m.id} className="hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors">
                  
                  {/* Badge de Evento (Operación) */}
                  <td className="p-4">
                    <div
                      className={`
                        inline-flex items-center gap-2 px-3 py-1 rounded-full
                        text-[11px] uppercase tracking-wider font-semibold
                        ${
                          m.accion === 'Creado'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : m.accion === 'Editado'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }
                      `}
                    >
                      <span>
                        {m.accion === 'Creado'
                          ? '🟢'
                          : m.accion === 'Editado'
                          ? '✏️'
                          : '🗑️'}
                      </span>
                      {m.accion}
                    </div>
                  </td>
                  
                  {/* Nombre del Producto */}
                  <td className="p-4 font-medium">{m.nombre_producto}</td>
                  
                  {/* Resumen Real de Cambios (Auditoría) */}
                  <td className="p-4 text-xs">
                    <div className="space-y-1">
                      {/* PRECIO */}
                      {(m.valores_anteriores?.precio !== undefined || m.valores_actuales?.precio !== undefined) && (
                        <div className="flex items-center gap-2">
                          <span className="opacity-50 w-14">Precio</span>
                          {m.accion === 'Editado' ? (
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

                      {/* STOCK */}
                      {(m.valores_anteriores?.stock !== undefined || m.valores_actuales?.stock !== undefined) && (
                        <div className="flex items-center gap-2">
                          <span className="opacity-50 w-14">Stock</span>
                          {m.accion === 'Editado' ? (
                            <>
                              <span className="text-rose-400">
                                {m.valores_anteriores?.stock}
                              </span>
                              <span className="opacity-40">→</span>
                              <span className="text-emerald-400 font-semibold">
                                {m.valores_actuales?.stock}
                              </span>
                            </>
                          ) : (
                            <span className="text-emerald-400 font-semibold">
                              {m.valores_actuales?.stock || m.valores_anteriores?.stock}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  {/* Fecha Log */}
                  <td className="p-4 text-xs opacity-70">{formatFechaLog(m.fecha)}</td>
                  
                  {/* Ver más detalles */}
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => setSelectedLog(m)}
                      className="text-gray-400 hover:text-[#D4AF37] transition-colors"
                      title="Ver todos los campos modificados"
                    >
                      <Eye size={16} className="mx-auto" />
                    </button>
                  </td>

                 {/* Acción Sincronizada / Revertir */}
<td className="p-4 text-center">
  {/* Modificado para que SÓLO aparezca si fue Editado */}
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

      {/* MODAL ELEGANTE: "VER MÁS" */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-gray-800 p-6 rounded-sm w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]">
                Auditoría de Cambios
              </h3>
              <button 
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-300">
              <p><span className="opacity-50 uppercase tracking-wider block text-[10px]">Producto:</span> <strong className="text-white text-sm">{selectedLog.nombre_producto}</strong></p>
              <p><span className="opacity-50 uppercase tracking-wider block text-[10px]">ID de Base de Datos:</span> <span className="font-mono opacity-80">{selectedLog.producto_id}</span></p>
              <p><span className="opacity-50 uppercase tracking-wider block text-[10px]">Operación Realizada:</span> <span className="font-bold text-amber-400">{selectedLog.accion}</span></p>
              
              {/* Contenedor Visual de Cambios Sin JSON Crudo */}
              <div className="mt-4 space-y-3">
                {/* PRECIO */}
                {(selectedLog.valores_anteriores?.precio !== undefined || selectedLog.valores_actuales?.precio !== undefined) && (
                  <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
                    <div className="text-[11px] uppercase tracking-widest text-gray-500 mb-2">
                      Cambio de Precio
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase">Antes</div>
                        <div className="text-rose-400 text-lg font-semibold">
                          S/ {Number(selectedLog.valores_anteriores?.precio || 0).toFixed(2)}
                        </div>
                      </div>
                      <div className="text-gray-600 text-xl">→</div>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-500 uppercase">Ahora</div>
                        <div className="text-emerald-400 text-lg font-semibold">
                          S/ {Number(selectedLog.valores_actuales?.precio || 0).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STOCK */}
                {(selectedLog.valores_anteriores?.stock !== undefined || selectedLog.valores_actuales?.stock !== undefined) && (
                  <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4">
                    <div className="text-[11px] uppercase tracking-widest text-gray-500 mb-2">
                      Cambio de Stock
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase">Antes</div>
                        <div className="text-rose-400 text-lg font-semibold">
                          {selectedLog.valores_anteriores?.stock || 0}
                        </div>
                      </div>
                      <div className="text-gray-600 text-xl">→</div>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-500 uppercase">Ahora</div>
                        <div className="text-emerald-400 text-lg font-semibold">
                          {selectedLog.valores_actuales?.stock || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}