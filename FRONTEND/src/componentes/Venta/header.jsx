import React from 'react';
import { PlusCircle, Copy, History, ChevronDown } from 'lucide-react';

const HeaderActions = () => {
  return (
    <header className="w-full bg-white dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-zinc-800 p-4 transition-colors duration-200">
      <div className="flex flex-wrap items-center justify-end gap-3 max-w-7xl mx-auto">
        
        {/* Botón Nueva Venta */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-500 text-amber-500 hover:bg-amber-500/10 transition-all font-medium text-sm">
          <PlusCircle size={18} />
          <span>Nueva venta</span>
        </button>

        {/* Botón Duplicar Venta */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-500 text-amber-500 hover:bg-amber-500/10 transition-all font-medium text-sm">
          <Copy size={18} />
          <span>Duplicar venta</span>
        </button>

        {/* Botón Historial Venta con Dropdown */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-500 text-amber-500 hover:bg-amber-500/10 transition-all font-medium text-sm group">
          <History size={18} />
          <span>Historial venta</span>
          <ChevronDown size={16} className="ml-1 group-hover:translate-y-0.5 transition-transform" />
        </button>

      </div>
    </header>
  );
};

export default HeaderActions;