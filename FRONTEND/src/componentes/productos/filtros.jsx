import React from 'react';
import {
  Search,
  Boxes,
  ToggleLeft,
  RotateCcw,
  ChevronDown,
  DollarSign
} from 'lucide-react';

const FilterBar = ({ filters, setFilters }) => {

  const selectClasses = `
    appearance-none bg-white dark:bg-[#0f0f0f]
    pl-10 pr-10 py-2.5 
    border border-gray-200 dark:border-zinc-700 
    rounded-lg text-sm 
    text-gray-700 dark:text-zinc-200 
    hover:bg-gray-50 dark:hover:bg-zinc-800 
    focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500
    outline-none transition-all cursor-pointer w-full
  `;

  const labelClasses = `
    text-[10px] uppercase tracking-widest mb-1 block
    text-gray-400 dark:text-amber-500/60
  `;

  return (
    <div
      className="w-full flex flex-wrap items-end gap-3 p-4 rounded-xl 
      bg-white dark:bg-[#121212] 
      border border-gray-200 dark:border-zinc-800
      transition-colors duration-200"
    >

      {/* BUSCADOR */}
      <div className="relative flex-grow max-w-xs">
        <label className={labelClasses}>Buscar</label>

        <span className="absolute left-3 top-[38px] text-gray-400 dark:text-amber-500/50">
          <Search size={18} />
        </span>

        <input
          type="text"
          value={filters.nombre}
          onChange={(e) =>
            setFilters({
              ...filters,
              nombre: e.target.value
            })
          }
          placeholder="Nombre del producto..."
          className="w-full bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-zinc-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-800 dark:text-zinc-200 placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none transition"
        />
      </div>

      {/* STOCK */}
      <div className="relative">
        <label className={labelClasses}>Stock</label>

        <span className="absolute left-3 top-[38px] text-gray-400 dark:text-amber-500/50 pointer-events-none">
          <Boxes size={18} />
        </span>

        <select
          value={filters.stock}
          onChange={(e) =>
            setFilters({
              ...filters,
              stock: e.target.value
            })
          }
          className={selectClasses}
        >
          <option value="">Todos</option>
          <option value="0">Sin stock</option>
          <option value="1-10">1 - 10 unidades</option>
          <option value="11-50">11 - 50 unidades</option>
          <option value="51-100">51 - 100 unidades</option>
          <option value="100+">Más de 100</option>
        </select>

        <span className="absolute right-3 top-[38px] text-gray-500 pointer-events-none">
          <ChevronDown size={16} />
        </span>
      </div>

      {/* PRECIO */}
      <div className="relative">
        <label className={labelClasses}>Precio</label>

        <span className="absolute left-3 top-[38px] text-gray-400 dark:text-amber-500/50 pointer-events-none">
          <DollarSign size={18} />
        </span>

        <select
          value={filters.precio}
          onChange={(e) =>
            setFilters({
              ...filters,
              precio: e.target.value
            })
          }
          className={selectClasses}
        >
          <option value="">Todos</option>
          <option value="0-20">Hasta S/ 20</option>
          <option value="20-50">S/ 20 - S/ 50</option>
          <option value="50-100">S/ 50 - S/ 100</option>
          <option value="100+">Más de S/ 100</option>
        </select>

        <span className="absolute right-3 top-[38px] text-gray-500 pointer-events-none">
          <ChevronDown size={16} />
        </span>
      </div>

      {/* ESTADO */}
      <div className="relative">
        <label className={labelClasses}>Estado</label>

        <span className="absolute left-3 top-[38px] text-gray-400 dark:text-amber-500/50 pointer-events-none">
          <ToggleLeft size={18} />
        </span>

        <select
          value={filters.estado}
          onChange={(e) =>
            setFilters({
              ...filters,
              estado: e.target.value
            })
          }
          className={selectClasses}
        >
          <option value="">Todos</option>
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>

        <span className="absolute right-3 top-[38px] text-gray-500 pointer-events-none">
          <ChevronDown size={16} />
        </span>
      </div>

      {/* LIMPIAR */}
      <button
        onClick={() =>
          setFilters({
            nombre: '',
            stock: '',
            precio: '',
            estado: ''
          })
        }
        className="flex items-center gap-2 px-4 py-2.5 
        border border-amber-500/30
        rounded-lg text-sm font-medium
        text-amber-600 dark:text-amber-500
        hover:bg-amber-500/10 
        transition-colors ml-auto"
      >
        <RotateCcw size={18} />
        <span>Limpiar</span>
      </button>

    </div>
  );
};

export default FilterBar;