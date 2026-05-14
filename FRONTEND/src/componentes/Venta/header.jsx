import React, { useState } from 'react';
import { PlusCircle, Copy, History, ChevronDown, Check } from 'lucide-react';

const HeaderActions = ({ ventas, ventaActivaId, setVentaActivaId, onNueva, onDuplicar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ventaActual = ventas.find(v => v.id === ventaActivaId);

  return (
    <header className="w-full bg-white dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-zinc-800 p-4 transition-colors duration-200">
      <div className="flex flex-wrap items-center justify-between max-w-7xl mx-auto">
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Venta activa:</span>
          <span className="text-sm font-semibold text-amber-500">{ventaActual?.nombre}</span>
        </div>

        <div className="flex items-center gap-3 relative">
          <button onClick={onNueva} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-500 text-amber-500 hover:bg-amber-500/10 transition-all font-medium text-sm">
            <PlusCircle size={18} />
            <span>Nueva venta</span>
          </button>

          <button onClick={onDuplicar} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-500 text-amber-500 hover:bg-amber-500/10 transition-all font-medium text-sm">
            <Copy size={18} />
            <span>Duplicar venta</span>
          </button>

          {/* 5. Dropdown de Ventas Pendientes */}
          <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-500 text-amber-500 hover:bg-amber-500/10 transition-all font-medium text-sm group"
            >
              <History size={18} />
              <span>Historial ({ventas.length})</span>
              <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden">
                {ventas.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => { setVentaActivaId(v.id); setIsOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-amber-500/10 transition-colors ${v.id === ventaActivaId ? 'text-amber-500 bg-amber-500/5' : ''}`}
                  >
                    <span>{v.nombre}</span>
                    {v.id === ventaActivaId && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderActions;