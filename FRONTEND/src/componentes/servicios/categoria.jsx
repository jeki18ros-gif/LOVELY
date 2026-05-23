import React from 'react';
import { Tag, Plus, MoreVertical } from 'lucide-react';
import CategoriaFormulario from './formularios/categoriaFormulario';
import useServicesCategory from './hook/useServicesCategory';

const CategorySidebar = ({ onCategoriaChange }) => {
  const {
    categorias,
    showForm,
    setShowForm,
    newCat,
    setNewCat,
    editIndex,
    setEditIndex,
    menuOpen,
    setMenuOpen,
    handleSave,
    handleCancel,
    handleEdit,
    handleDelete,
    seleccionarCategoria
  } = useServicesCategory(onCategoriaChange);

  return (
    <div className="w-full h-full max-h-[calc(100vh-3rem)] overflow-y-auto p-5 rounded-3xl bg-white dark:bg-[#121212] border border-amber-500/20 shadow-2xl transition-all duration-300 scrollbar-thin">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-amber-500/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Tag className="text-amber-600 dark:text-amber-400" size={18} />
          </div>
          <h2 className="text-xs font-bold tracking-widest uppercase text-black dark:text-gray-200">
            Categorías
          </h2>
        </div>

        <button
          onClick={() => {
            setShowForm(true);
            setEditIndex(null);
            setNewCat('');
          }}
          className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-black transition-all duration-200"
        >
          <Plus size={16} className="stroke-[2.5]" />
        </button>
      </div>

      {/* FORMULARIO INLINE */}
      {showForm && (
        <CategoriaFormulario
          newCat={newCat}
          setNewCat={setNewCat}
          onSave={handleSave}
          onCancel={handleCancel}
          isEditing={editIndex !== null}
        />
      )}

      {/* LISTA DE CATEGORÍAS */}
      <ul className="space-y-1.5">
        {categorias.map((cat, index) => (
          <li key={cat.id} className="relative">
            <div
              onClick={() => seleccionarCategoria(index)}
              className={`
                w-full flex items-center justify-between px-4 py-3.5 rounded-xl
                transition-all duration-200 group cursor-pointer border
                ${cat.activo
                  ? `bg-amber-500/10 border-l-4 border-l-amber-500 border-amber-500/20 text-amber-700 dark:text-amber-400 font-bold`
                  : `text-gray-600 dark:text-gray-400 border-transparent hover:bg-amber-500/10 hover:border-amber-500/10 hover:text-amber-800 dark:hover:text-amber-400`
                }
              `}
            >
              <span className="text-sm tracking-wide">
                {cat.nombre}
              </span>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${cat.activo ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-gray-100 dark:bg-zinc-800 text-gray-400'}`}>
                  {cat.cantidad}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(menuOpen === index ? null : index);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-amber-500/20 text-gray-500 dark:text-gray-400"
                >
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            {/* ACCIONES DE DROPDOWN */}
            {menuOpen === index && (
              <div className="absolute right-2 mt-1 w-32 bg-white dark:bg-[#161616] border border-amber-500/20 rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                <button
                  onClick={() => handleEdit(index)}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-amber-500/10 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySidebar;