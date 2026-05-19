import React from 'react';
import { RotateCcw } from 'lucide-react';

export default function HistoryServicio({ movimientos }) {
  // Filtrar solo los de tipo "Servicio"
  const servicios = movimientos.filter(m => m.tipo === 'Servicio');

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-gray-200 dark:border-gray-800 text-[11px] uppercase tracking-widest opacity-60 bg-gray-50 dark:bg-[#1a1a1a]">
          <th className="p-4">Operación</th>
          <th className="p-4">Servicio Modificado</th>
          <th className="p-4">Auditoría de Valores (Precio)</th>
          <th className="p-4">Autor</th>
          <th className="p-4">Fecha Log</th>
          <th className="p-4 text-center">Acción Sincronizada</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
        {servicios.map(m => (
          <tr key={m.id} className="hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors">
            <td className="p-4">
              <span className={`px-2 py-0.5 text-[10px] rounded-sm font-bold uppercase ${
                m.accion === 'Creado' ? 'text-emerald-400 bg-emerald-500/10' : m.accion === 'Editado' ? 'text-amber-400 bg-amber-500/10' : 'text-rose-400 bg-rose-500/10'
              }`}>
                {m.accion}
              </span>
            </td>
            <td className="p-4 font-light">{m.nombre}</td>
            <td className="p-4 text-xs">
              {m.anterior && m.actual ? (
                <span>
                  <span className="text-rose-400 line-through">S/ {m.anterior.precio}</span>
                  <span className="mx-2 text-gray-400">→</span>
                  <span className="text-emerald-400 font-medium">S/ {m.actual.precio}</span>
                </span>
              ) : m.accion === 'Creado' ? (
                <span className="text-emerald-400 font-medium">Alta: S/ {m.actual?.precio}</span>
              ) : (
                <span className="text-rose-400 font-medium">Baja (S/ {m.anterior?.precio})</span>
              )}
            </td>
            <td className="p-4">{m.usuario}</td>
            <td className="p-4 text-xs opacity-60">{m.fecha}</td>
            <td className="p-4 text-center">
              {(m.accion === 'Editado' || m.accion === 'Eliminado') && (
                <button className="text-xs text-[#D4AF37] font-medium tracking-wide hover:underline inline-flex items-center gap-1">
                  <RotateCcw size={12}/> Revertir cambio
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}