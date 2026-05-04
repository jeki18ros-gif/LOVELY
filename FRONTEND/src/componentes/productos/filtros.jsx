import React from 'react';
import { Search, Box, ToggleLeft, RotateCcw, ChevronDown, DollarSign } from 'lucide-react';

const FilterBar = ({ filters, setFilters }) => {
  // Clase base para mantener la consistencia visual
  const selectClasses = `
    appearance-none bg-transparent 
    pl-10 pr-10 py-2.5 
    border border-gray-200 dark:border-zinc-700 
    rounded-lg text-sm 
    text-gray-600 dark:text-gray-300 
    hover:bg-gray-100 dark:hover:bg-zinc-800 
    focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500
    outline-none transition-colors cursor-pointer w-full
  `;

  return (
    <div className="w-full flex flex-wrap items-center gap-3 p-4 rounded-xl 
                    bg-white dark:bg-[#121212] 
                    border border-gray-200 dark:border-zinc-800
                    transition-colors duration-200">

      {/* 1. Búsqueda por Nombre de Producto */}
      <div className="relative flex-grow max-w-xs">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
          <Search size={18} />
        </span>
          <input 
  type="text"
  value={filters.search}
  onChange={(e) => setFilters({...filters, search: e.target.value})}
          placeholder="Buscar producto..." 
          className="w-full bg-transparent border border-gray-200 dark:border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none transition"
        />
      </div>

      {/* 2. Filtro de Stock */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
          <Box size={18} />
        </span>
        <select 
  value={filters.stock}
  onChange={(e) => setFilters({...filters, stock: e.target.value})} 
        className={selectClasses}>
          <option value="">Stock</option>
          <option value="out">Sin stock (0)</option>
          <option value="low">Stock bajo (1-10)</option>
          <option value="medium">Stock medio (11-50)</option>
          <option value="high">Stock alto (+50)</option>
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          <ChevronDown size={16} />
        </span>
      </div>

      {/* 3. Filtro de Precio */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
          <DollarSign size={18} />
        </span>
        <select
         value={filters.price}
  onChange={(e) => setFilters({...filters, price: e.target.value})} className={selectClasses}>
          <option value="">Precio</option>
          <option value="0-50">Hasta S/ 50</option>
          <option value="50-150">S/ 50 - S/ 150</option>
          <option value="150-300">S/ 150 - S/ 300</option>
          <option value="300+">Más de S/ 300</option>
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          <ChevronDown size={16} />
        </span>
      </div>

      {/* 4. Filtro de Estado */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
          <ToggleLeft size={18} />
        </span>
        <select 
         value={filters.status}
  onChange={(e) => setFilters({...filters, status: e.target.value})}className={selectClasses}>
          <option value="">Estado</option>
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          <ChevronDown size={16} />
        </span>
      </div>

      {/* Botón Limpiar */}
      <button 
      onClick={() => setFilters({
  search: '',
  stock: '',
  price: '',
  status: ''
})}
      className="flex items-center gap-2 px-4 py-2.5 
                         border border-gray-200 dark:border-zinc-700
                         rounded-lg text-sm font-medium
                         text-amber-500
                         hover:bg-amber-500/10 
                         transition-colors ml-auto">
        <RotateCcw size={18} />
        <span>Limpiar</span>
      </button>

    </div>
  );
};

export default FilterBar;