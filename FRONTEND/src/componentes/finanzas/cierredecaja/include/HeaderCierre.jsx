import React from 'react';
import { Calendar, Lock, CheckCircle2 } from 'lucide-react';

export default function HeaderCierre({
  fechaSeleccionada,
  setFechaSeleccionada,
  cajaCerrada,
  setCajaCerrada,
  setLoading,
  setValoresContados,
  setBaseInicial,
  onCerrarCaja,
}) {
  return (
    <header className="flex flex-col md:flex-row justify-between gap-6 mb-12 items-start md:items-center">
      <div>
        <h1 className="text-3xl font-light tracking-[0.25em] uppercase text-black dark:text-white">
          Cierre de Caja <span className="text-[#D4AF37]">.</span>
        </h1>

        <div className="flex items-center gap-2 mt-3 bg-white dark:bg-[#141414] border border-gray-200 dark:border-gray-800 px-3 py-1.5 rounded-sm shadow-xs">
          <Calendar size={14} className="text-[#D4AF37]" />
          <input
            type="date"
            value={fechaSeleccionada}
            onChange={(e) => {
              setLoading(true);
              setCajaCerrada(false);
              setValoresContados({ efectivo: '', yape: '', plin: '', tarjeta: '' });
              setBaseInicial(0);
              setFechaSeleccionada(e.target.value);
            }}
          />
        </div>
      </div>

      <button
        onClick={onCerrarCaja}
        disabled={cajaCerrada}
        className={`px-8 py-3 rounded-sm flex items-center gap-3 transition-all font-bold uppercase text-xs tracking-widest shadow-lg ${
          cajaCerrada
            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 cursor-not-allowed'
            : 'bg-[#D4AF37] text-black hover:scale-[1.02] shadow-[#D4AF37]/10'
        }`}
      >
        {cajaCerrada ? (
          <>
            <CheckCircle2 size={16} /> Caja Cerrada
          </>
        ) : (
          <>
            <Lock size={16} /> Finalizar y Cerrar Caja
          </>
        )}
      </button>
    </header>
  );
}