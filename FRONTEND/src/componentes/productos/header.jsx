import React from 'react';
import { Package, Plus } from 'lucide-react';

const ProductsHeader = ({ onOpenModal }) => {
  return (
    <div className="w-full bg-white dark:bg-[#121212] p-4 rounded-t-xl border-x border-t border-gray-200 dark:border-zinc-800 transition-colors duration-200">
      
      <div className="flex items-center justify-between">

        {/* Título */}
        <div className="flex items-center gap-2">
          <Package className="text-gray-400 dark:text-amber-500/50" size={20} />

          <h2 className="text-sm font-bold tracking-widest uppercase text-gray-700 dark:text-amber-500">
            Productos
          </h2>
        </div>

        {/* Botón Nuevo Producto */}
        <button
          onClick={onOpenModal}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-500 text-amber-600 dark:text-amber-500 hover:bg-amber-500 hover:text-white dark:hover:text-black transition-all font-medium text-xs shadow-sm hover:shadow-amber-500/20"
        >
          <Plus size={16} />
          <span>Nuevo producto</span>
        </button>

      </div>
    </div>
  );
};

export default ProductsHeader;