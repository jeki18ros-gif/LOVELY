import React from 'react';
import { ArrowUpRight, ArrowDownLeft, PlusCircle } from 'lucide-react';

export default function SeccionExtras({ ingresosExtras = 0, egresos = 0 }) {
  const balanceExtras = ingresosExtras - egresos;

  return (
    <div className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 rounded-sm p-5 shadow-sm mb-8">
      <div className="flex items-center gap-2 pb-3 mb-4 border-b border-gray-100 dark:border-gray-800">
        <PlusCircle size={16} className="text-[#D4AF37]" />
        <h4 className="text-xs uppercase tracking-widest font-semibold text-gray-700 dark:text-gray-200">
          Movimientos Extras y Salidas del Día (Ajustes)
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        {/* Ingresos Extras */}
        <div className="flex items-center justify-between p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-sm">
          <div className="flex items-center gap-2">
            <ArrowUpRight size={16} className="text-emerald-500" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Ingresos Extras (+S/)
            </span>
          </div>
          <span className="font-bold text-emerald-500">
            + S/ {ingresosExtras.toFixed(2)}
          </span>
        </div>

        {/* Egresos / Gastos */}
        <div className="flex items-center justify-between p-3 bg-rose-500/5 border border-rose-500/20 rounded-sm">
          <div className="flex items-center gap-2">
            <ArrowDownLeft size={16} className="text-rose-500" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Egresos / Salidas (-S/)
            </span>
          </div>
          <span className="font-bold text-rose-500">
            - S/ {egresos.toFixed(2)}
          </span>
        </div>

        {/* Balance Neto de Extras */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-sm">
          <span className="text-xs font-medium text-gray-500">
            Balance Ajustes Extras
          </span>
          <span className={`font-bold ${balanceExtras >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {balanceExtras >= 0 ? '+' : ''} S/ {balanceExtras.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}