import React, { useState } from 'react';
import { Tag, Plus, MoreVertical } from 'lucide-react';
import CategoriaFormulario from './formularios/categoriaFormulario';

const CategorySidebar = () => {
  const [categorias, setCategorias] = useState([
    { nombre: 'Todos', cantidad: 12, activo: false },
    { nombre: 'Corte', cantidad: 3, activo: true },
    { nombre: 'Color', cantidad: 4, activo: false },
    { nombre: 'Tratamientos', cantidad: 2, activo: false },
    { nombre: 'Barba', cantidad: 2, activo: false },
    { nombre: 'Otros', cantidad: 1, activo: false },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newCat, setNewCat] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);

  const handleSave = () => {
    if (!newCat.trim()) return;

    if (editIndex !== null) {
      const updated = [...categorias];
      updated[editIndex].nombre = newCat;
      setCategorias(updated);
      setEditIndex(null);
    } else {
      setCategorias([
        ...categorias,
        { nombre: newCat, cantidad: 0, activo: false },
      ]);
    }

    setNewCat('');
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditIndex(null);
    setNewCat('');
  };

  const handleEdit = (index) => {
    setNewCat(categorias[index].nombre);
    setEditIndex(index);
    setShowForm(true);
    setMenuOpen(null);
  };

  const handleDelete = (index) => {
    const updated = categorias.filter((_, i) => i !== index);
    setCategorias(updated);
    setMenuOpen(null);
  };

  return (
    <div className="w-full h-full max-h-[calc(100vh-3rem)] overflow-y-auto p-4 rounded-xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-zinc-800 shadow-xl transition-colors duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-zinc-800/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800">
            <Tag className="text-gray-600 dark:text-gray-400" size={18} />
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

      {/* Formulario Separado */}
      {showForm && (
        <CategoriaFormulario 
          newCat={newCat}
          setNewCat={setNewCat}
          onSave={handleSave}
          onCancel={handleCancel}
          isEditing={editIndex !== null}
        />
      )}

      {/* Lista */}
      <ul className="space-y-1">
        {categorias.map((cat, index) => (
          <li key={index} className="relative">
            <div
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-lg
                transition-all duration-200 group
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
                  onClick={() => setMenuOpen(menuOpen === index ? null : index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            {/* Dropdown */}
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