import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function DictamenCuadre({ saldoCajaEsperado, diferenciaTotalGlobal }) {
  return (
    <div className="bg-white dark:bg-[#141414] p-6 border border-gray-200 dark:border-gray-800 rounded-sm shadow-sm flex flex-col justify-between h-full">
      <div>
        <h4 className="text-xs uppercase tracking-widest mb-4 flex gap-2 font-semibold">
          <CheckCircle2 size={16} className="text-[#D4AF37]" /> Dictamen de Cuadre
        </h4>

        <div className="space-y-3 text-sm border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="flex justify-between opacity-70">
            <span>Esperado total en caja:</span>
            <span>S/ {saldoCajaEsperado.toFixed(2)}</span>
          </div>
          <p className="text-[10px] text-gray-400 italic">
            *(Suma ingresos + base inicial - egresos)
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">
          Diferencia Neta Global
        </p>
        <div
          className={`p-4 rounded-sm text-center text-xl font-bold ${
            diferenciaTotalGlobal === 0
              ? 'bg-gray-500/10 text-gray-400'
              : diferenciaTotalGlobal > 0
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-rose-500/10 text-rose-400'
          }`}
        >
          S/ {diferenciaTotalGlobal.toFixed(2)}
        </div>

        {diferenciaTotalGlobal !== 0 && (
          <div className="text-amber-500 text-xs mt-3 flex gap-2 items-center justify-center border border-amber-500/20 p-2 bg-amber-500/5">
            <AlertCircle size={14} className="shrink-0" />
            <span>Se registrará un descuadre en el historial.</span>
          </div>
        )}
      </div>
    </div>
  );
}