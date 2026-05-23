import React from 'react';

const CategoriaFormulario = ({ newCat, setNewCat, onSave, onCancel, isEditing }) => {
  return (
    <div className="mb-4 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-amber-500/10 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
      <div>
        <input
          type="text"
          autoFocus
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="Nombre de la nueva categoría"
          className="w-full p-3 rounded-xl text-sm bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-black dark:text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 outline-none transition-all"
          onKeyDown={(e) => e.key === 'Enter' && onSave()}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={onSave}
          className="flex-1 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold py-2.5 rounded-xl transition-colors shadow-sm shadow-amber-500/10"
        >
          {isEditing ? 'Actualizar' : 'Guardar'}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-medium py-2.5 rounded-xl hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default CategoriaFormulario;