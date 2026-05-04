import React from 'react';

const CategoriaFormulario = ({ newCat, setNewCat, onSave, onCancel, isEditing }) => {
  return (
    <div className="mb-4 p-3 rounded-xl bg-gray-100 dark:bg-zinc-800 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
      <input
        type="text"
        autoFocus
        value={newCat}
        onChange={(e) => setNewCat(e.target.value)}
        placeholder="Nombre de categoría"
        className="w-full p-2 rounded-lg text-sm bg-white dark:bg-zinc-900 border border-transparent focus:border-amber-500 outline-none transition-all"
        onKeyDown={(e) => e.key === 'Enter' && onSave()}
      />

      <div className="flex gap-2">
        <button
          onClick={onSave}
          className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
        >
          {isEditing ? 'Actualizar' : 'Guardar'}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-300 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 text-xs py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-zinc-600 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default CategoriaFormulario;