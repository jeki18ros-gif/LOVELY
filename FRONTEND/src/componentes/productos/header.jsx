import React from 'react';
import { Package, Plus } from 'lucide-react';

const ProductsHeader = ({ onOpenModal }) => {
  return (
    <div className="w-full bg-white dark:bg-[#121212] p-4 rounded-t-xl border-x border-t border-gray-200 dark:border-zinc-800 transition-colors duration-200">
      
      <div className="flex items-center justify-between">

        {/* Título */}
        <div className="flex items-center gap-2">
          <Package className="text-gray-400" size={20} />

          <h2 className="text-sm font-bold tracking-widest uppercase dark:text-gray-200">
            Productos
          </h2>
        </div>

        {/* Botón Nuevo Producto */}
        <button
          onClick={onOpenModal}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-500 text-cyan-500 hover:bg-cyan-500/10 transition-all font-medium text-xs"
        >
          <Plus size={16} className="text-cyan-500" />

          <span>Nuevo producto</span>
        </button>

      </div>
    </div>
  );
};

export default ProductsHeader;