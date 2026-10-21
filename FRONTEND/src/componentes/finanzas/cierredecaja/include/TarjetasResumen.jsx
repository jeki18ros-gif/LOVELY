import React from 'react';
import { TrendingUp, TrendingDown, Wallet, Coins } from 'lucide-react';

export default function TarjetasResumen({
  datosSistema,
  gananciaDia,
  baseInicial,
  setBaseInicial,
}) {
  // Calculamos el ingreso total bruto que ingresó al negocio (Ventas + Extras)
  const ingresoTotalBruto = datosSistema.ingresos + (datosSistema.ingresosExtras || 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {/* 1. INGRESOS TOTALES */}
      <div className="bg-white dark:bg-[#141414] p-6 border-b-2 border-gray-300 dark:border-gray-700 shadow-xl rounded-sm">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs uppercase tracking-widest text-gray-500">Ingresos Totales</p>
          <TrendingUp className="text-emerald-500" size={20} />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">
          S/ {ingresoTotalBruto.toFixed(2)}
        </h2>
        <p className="text-[10px] text-gray-400 mt-2">
          Ventas: S/ {datosSistema.ingresos.toFixed(2)} | Extras: S/ {(datosSistema.ingresosExtras || 0).toFixed(2)}
        </p>
      </div>

      {/* 2. EGRESOS TOTALES */}
      <div className="bg-white dark:bg-[#141414] p-6 border-b-2 border-rose-500/50 shadow-xl rounded-sm">
        <div className="flex justify-between items-start mb-4">
          <p className="text-xs uppercase tracking-widest text-gray-500">Egresos Totales</p>
          <TrendingDown className="text-rose-500" size={20} />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">
          - S/ {datosSistema.egresos.toFixed(2)}
        </h2>
      </div>

      {/* 3. GANANCIA NETA DEL DÍA */}
      <div className="bg-white dark:bg-[#141414] p-6 border-b-2 border-[#D4AF37] shadow-xl rounded-sm">
        <div className="flex justify-between items-start mb-4">
          <p className="text-xs uppercase tracking-widest text-gray-500">Ganancia Neta (Día)</p>
          <Wallet className="text-[#D4AF37]" size={20} />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">
          S/ {gananciaDia.toFixed(2)}
        </h2>
      </div>

      {/* 4. BASE APERTURA */}
      <div className="bg-white dark:bg-[#141414] p-6 border-b-2 border-blue-500/50 shadow-xl rounded-sm">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs uppercase tracking-widest text-gray-500">Base Apertura</p>
          <Coins className="text-blue-400" size={20} />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xl font-semibold opacity-70">S/</span>
          <input
            type="number"
            step="0.01"
            value={baseInicial}
            onChange={(e) => setBaseInicial(e.target.value)}
            className="text-2xl font-semibold tracking-tight bg-transparent border-b border-dashed border-gray-400 dark:border-gray-600 focus:outline-none focus:border-blue-400 w-full"
          />
        </div>
      </div>
    </div>
  );
}