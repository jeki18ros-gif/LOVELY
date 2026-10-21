import React from 'react';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function EstadoCajaCerrada({ 
  fechaSeleccionada, 
  hayNuevosMovimientos, 
  onReabrirCaja 
}) {
  return (
    <div className="flex justify-center py-12">
      <div className="w-full max-w-xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 rounded-sm shadow-xl p-8 text-center">
        
        {/* ÍCONO Y TÍTULO */}
        <div className="flex justify-center mb-5">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center border ${
            hayNuevosMovimientos 
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' 
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
          }`}>
            {hayNuevosMovimientos ? (
              <AlertCircle size={36} />
            ) : (
              <CheckCircle2 size={36} strokeWidth={1.5} />
            )}
          </div>
        </div>

        <h2 className="text-xl font-semibold uppercase tracking-[0.2em] text-black dark:text-white">
          {hayNuevosMovimientos ? 'Nuevos Movimientos Detectados' : 'Caja Cerrada'}
        </h2>

        {/* DETALLE DEL MENSAJE */}
        {hayNuevosMovimientos ? (
          <div className="mt-4 p-4 rounded-sm bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs leading-relaxed max-w-md mx-auto">
            Se registraron ventas, ingresos o egresos de último minuto después del último cierre. Es necesario reabrir la caja para actualizar el cuadre.
          </div>
        ) : (
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            El cierre de caja de esta fecha fue registrado correctamente.
          </p>
        )}

        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-[10px] uppercase tracking-widest text-gray-400">Fecha de cierre</p>
          <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">{fechaSeleccionada}</p>
        </div>

        {/* BOTÓN DE ACCIÓN / REAPERTURA */}
        <div className="mt-6 flex justify-center gap-3">
          {hayNuevosMovimientos ? (
            <button
              onClick={onReabrirCaja}
              className="px-6 py-2.5 bg-[#D4AF37] hover:brightness-110 text-black font-bold uppercase text-xs tracking-widest rounded-sm transition-all flex items-center gap-2 shadow-lg shadow-[#D4AF37]/10"
            >
              <RefreshCw size={14} />
              Reabrir y Actualizar Cierre
            </button>
          ) : (
            <button
              onClick={onReabrirCaja}
              className="px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 text-[11px] uppercase tracking-widest rounded-sm transition-all flex items-center gap-2"
            >
              <RefreshCw size={13} />
              Reabrir Caja Manualmente
            </button>
          )}
        </div>

      </div>
    </div>
  );
}