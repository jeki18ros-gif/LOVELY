import React, { useState, useEffect } from 'react';
import { Tag, Plus, MoreVertical } from 'lucide-react';
import CategoriaFormulario from './formularios/categoriaFormulario';
import { supabase } from '../../lib/supabase'; 

const CategorySidebar = ({ onCategoriaChange }) => {
  const [categorias, setCategorias] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [newCat, setNewCat] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);

  // OBTENER CATEGORÍAS
  const obtenerCategorias = async () => {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('tipo', 'producto');

    if (error) {
      console.error(error);
      return;
    }

    const categoriasFormateadas = [
      {
        id: 0,
        nombre: 'Todos',
        cantidad: 0,
        activo: true
      },
      ...data.map(cat => ({
        ...cat,
        cantidad: 0,
        activo: false
      }))
    ];

    setCategorias(categoriasFormateadas);
  };

  // CONTAR PRODUCTOS
  const obtenerCantidadPorCategoria = async () => {
    const { data, error } = await supabase
      .from('productos')
      .select('categoria_id');

    if (error) {
      console.error(error);
      return;
    }

    const conteo = {};

    data.forEach(p => {
      conteo[p.categoria_id] =
        (conteo[p.categoria_id] || 0) + 1;
    });

    setCategorias(prev =>
      prev.map(cat => ({
        ...cat,
        cantidad:
          cat.id === 0
            ? data.length
            : conteo[cat.id] || 0
      }))
    );
  };

  // CARGA INICIAL
  useEffect(() => {
    const cargarDatos = async () => {
      await obtenerCategorias();

      setTimeout(() => {
        obtenerCantidadPorCategoria();
      }, 100);
    };

    cargarDatos();
  }, []);

  // GUARDAR
  const handleSave = async () => {
    if (!newCat.trim()) return;

    if (editIndex !== null) {

      // EDITAR
      const categoria = categorias[editIndex];

      const { error } = await supabase
        .from('categorias')
        .update({
          nombre: newCat
        })
        .eq('id', categoria.id);

      if (error) {
        console.error(error);
        return;
      }

      setCategorias(prev =>
        prev.map((cat, i) =>
          i === editIndex
            ? { ...cat, nombre: newCat }
            : cat
        )
      );

    } else {

      // CREAR
      const { data, error } = await supabase
        .from('categorias')
        .insert([
          {
            nombre: newCat,
            tipo: 'producto'
          }
        ])
        .select();

      if (error) {
        console.error(error);
        return;
      }

      setCategorias(prev => [
        ...prev,
        {
          ...data[0],
          cantidad: 0,
          activo: false
        }
      ]);
    }

    setNewCat('');
    setShowForm(false);
    setEditIndex(null);
  };

  // CANCELAR
  const handleCancel = () => {
    setShowForm(false);
    setEditIndex(null);
    setNewCat('');
  };

  // EDITAR
  const handleEdit = (index) => {
    setNewCat(categorias[index].nombre);
    setEditIndex(index);
    setShowForm(true);
    setMenuOpen(null);
  };

  // ELIMINAR
  const handleDelete = async (index) => {
    const categoria = categorias[index];

    const { error } = await supabase
      .from('categorias')
      .delete()
      .eq('id', categoria.id);

    if (error) {
      console.error(error);
      return;
    }

    setCategorias(prev =>
      prev.filter((_, i) => i !== index)
    );
  };

  // SELECCIONAR
  const seleccionarCategoria = (index) => {
    const updated = categorias.map((c, i) => ({
      ...c,
      activo: i === index
    }));

    setCategorias(updated);

    const categoriaSeleccionada = updated[index];

    onCategoriaChange(categoriaSeleccionada);
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
                    e.stopPropagation(); // IMPORTANTE: Evita que al abrir el menú se dispare el click de la categoría
                    setMenuOpen(menuOpen === index ? null : index);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
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