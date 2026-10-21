import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function DictamenCuadre({ saldoCajaEsperado, diferenciaTotalGlobal, estadoCuadre, deficitGlobal = 0 }) {
  const estilosEstado = {
    'Cuadrado': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
    'Sobrante': 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    'Faltante': 'bg-rose-500/10 text-rose-500 border-rose-500/30',
    'Déficit / Pérdida': 'bg-red-950/15 text-red-800 border-red-800/40 dark:text-red-400'
  };

  return (
    <div className="bg-white dark:bg-[#141414] p-6 border border-gray-200 dark:border-gray-800 rounded-sm shadow-sm flex flex-col justify-between h-full">
      <div>
        <h4 className="text-xs uppercase tracking-widest mb-4 flex gap-2 font-semibold">
          <CheckCircle2 size={16} className="text-[#D4AF37]" /> Dictamen de Cuadre
        </h4>

        <div className="space-y-3 text-sm border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="flex justify-between opacity-70">
            <span>Esperado total en caja:</span>
            <span className="notranslate" translate="no">S/ {saldoCajaEsperado.toFixed(2)}</span>
          </div>
          <p className="text-[10px] text-gray-400 italic">
            *(Suma ingresos + base inicial - egresos)
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Estado del arqueo</p>
        <div className={`rounded-sm border p-3 text-center ${estilosEstado[estadoCuadre] || estilosEstado.Cuadrado}`}>
          <p className="text-sm font-bold uppercase">{estadoCuadre}</p>
          <p className="mt-1 text-xs notranslate" translate="no">
            Diferencia: S/ {diferenciaTotalGlobal.toFixed(2)}
          </p>
          {estadoCuadre === 'Déficit / Pérdida' && (
            <p className="mt-1 text-xs font-semibold notranslate" translate="no">
              Déficit no cubierto: S/ {Number(deficitGlobal).toFixed(2)}
            </p>
          )}
        </div>

        {estadoCuadre !== 'Cuadrado' && (
          <div className={`text-xs mt-3 flex gap-2 items-center justify-center border p-2 ${estadoCuadre === 'Déficit / Pérdida'
            ? 'text-red-800 border-red-800/30 bg-red-950/10 dark:text-red-400'
            : 'text-amber-500 border-amber-500/20 bg-amber-500/5'}`}>
            <AlertCircle size={14} className="shrink-0" />
            <span>{estadoCuadre === 'Déficit / Pérdida' ? 'Los egresos superaron los fondos disponibles del día.' : 'Se registrará un descuadre en el historial.'}</span>
          </div>
        )}
      </div>
    </div>
  );
}