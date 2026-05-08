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
    <div className="w-full h-full max-h-[calc(100vh-3rem)] overflow-y-auto p-4 rounded-xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-zinc-800 shadow-xl transition-colors duration-300">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-zinc-800/50">

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800">
            <Tag
              className="text-gray-600 dark:text-gray-400"
              size={18}
            />
          </div>

          <h2 className="text-xs font-bold tracking-widest uppercase text-gray-700 dark:text-gray-200">
            Categorías
          </h2>
        </div>

        <button
          onClick={() => {
            setShowForm(true);
            setEditIndex(null);
            setNewCat('');
          }}
          className="p-1.5 rounded-full bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white transition-all"
        >
          <Plus size={16} />
        </button>

      </div>

      {/* FORMULARIO */}
      {showForm && (
        <CategoriaFormulario
          newCat={newCat}
          setNewCat={setNewCat}
          onSave={handleSave}
          onCancel={handleCancel}
          isEditing={editIndex !== null}
        />
      )}

      {/* LISTA */}
      <ul className="space-y-1">

        {categorias.map((cat, index) => (
  <li key={cat.id} className="relative">

            <div
              onClick={() => seleccionarCategoria(index)}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-lg
                transition-all duration-200 group cursor-pointer
                ${cat.activo
                  ? `bg-amber-100 dark:bg-amber-500/10 border-l-4 border-amber-500 text-amber-600 dark:text-amber-400`
                  : `text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white`
                }
              `}
            >

              <span className={`text-sm ${cat.activo ? 'font-semibold' : 'font-medium'}`}>
                {cat.nombre}
              </span>

              <div className="flex items-center gap-2">

                <span className={`text-xs ${cat.activo ? 'text-amber-500' : 'text-gray-400'}`}>
                  ({cat.cantidad})
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    setMenuOpen(
                      menuOpen === index
                        ? null
                        : index
                    );
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                >
                  <MoreVertical size={16} />
                </button>

              </div>

            </div>

            {/* DROPDOWN */}
            {menuOpen === index && (

              <div className="absolute right-2 mt-1 w-32 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg z-10 overflow-hidden">

                <button
                  onClick={() => handleEdit(index)}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Editar
                </button>

                <button
                  onClick={() => handleDelete(index)}
                  className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-500/10 transition-colors"
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