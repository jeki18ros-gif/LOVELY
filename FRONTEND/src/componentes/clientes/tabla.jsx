import React, { useState, useMemo } from 'react';
import { Pencil, Trash2, Eye, AlertTriangle } from 'lucide-react';
import FormularioVer from "./formularios/formularioVer";
import FormularioEditar from "./formularios/formularioEditar";

const getFrecuenciaColor = (frecuencia) => {
  switch (frecuencia) {
    case 'Frecuente': return 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30';
    case 'Regular': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20';
    case 'Nuevo': return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-transparent';
    default: return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
  }
};

const ClienteTable = ({
  filters,
  listaClientes,
  setListaClientes,
  actualizarCliente,
  abrirModal
}) => {

  const eliminarCliente = async (id) => {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error eliminando:', error);
      alert('Error al eliminar cliente');
      return;
    }

    setListaClientes(prev => prev.filter(c => c.id !== id));
    cerrarModal();
  };

  const clientesFiltrados = useMemo(() => {
    return listaClientes.filter(cliente => {
      const matchesSearch = 
        cliente.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
        (cliente.telefono || '').includes(filters.search);

      const matchesFrecuencia = filters.frecuencia === '' || cliente.frecuencia === filters.frecuencia;

      let matchesVisitas = true;
      if (filters.visitas === '0-5') matchesVisitas = cliente.visitas <= 5;
      else if (filters.visitas === '5-15') matchesVisitas = cliente.visitas > 5 && cliente.visitas <= 15;
      else if (filters.visitas === '15-25') matchesVisitas = cliente.visitas > 15 && cliente.visitas <= 25;
      else if (filters.visitas === '25+') matchesVisitas = cliente.visitas > 25;

      return matchesSearch && matchesFrecuencia && matchesVisitas;
    });
  }, [filters, listaClientes]);

  return (
    // Agregamos la clase relative y un z-index base seguro al contenedor inicial de todo el componente
    <div className="w-full text-gray-800 dark:text-gray-300 font-sans relative z-10">
      
      {/* CONTENEDOR PRINCIPAL CON OVERFLOW (SÓLO ENCAPSULA LA TABLA) */}
      <div className="w-full overflow-hidden rounded-b-3xl border-x border-b border-amber-500/20 bg-white dark:bg-[#0b0b0b] shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-amber-700 dark:text-amber-300 text-xs uppercase tracking-[0.18em] border-b border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-yellow-400/5 to-amber-500/10 backdrop-blur-xl">
                <th className="px-6 py-4 font-bold">Nombre</th>
                <th className="px-6 py-4 text-center font-bold">Teléfono</th>
                <th className="px-6 py-4 text-center font-bold">Frecuencia</th>
                <th className="px-6 py-4 text-center font-bold">Visitas</th>
                <th className="px-6 py-4 text-center font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-500/10">
              {clientesFiltrados.map((cliente) => (
                <tr 
                  key={cliente.id} 
                  className="hover:bg-gradient-to-r hover:from-amber-500/10 hover:to-yellow-500/5 transition-all duration-300 group"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-black dark:text-gray-100">{cliente.nombre}</td>
                  <td className="px-6 py-4 text-sm text-center font-medium font-mono">{cliente.telefono || '---'}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-xl text-xs font-bold ${getFrecuenciaColor(cliente.frecuencia)}`}>
                      {cliente.frecuencia}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-center font-bold text-amber-600 dark:text-amber-400">{cliente.visitas}</td>
                  
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => abrirModal('ver', cliente)}
                        className="p-2 border border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-black transition duration-200">
                        <Eye size={16} />
                      </button>

                      <button 
                        onClick={() => abrirModal('editar', cliente)}
                        className="p-2 border border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-black transition duration-200">
                        <Pencil size={16} />
                      </button>

                      <button 
                        onClick={() => abrirModal('borrar', cliente)}
                        className="p-2 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-600 hover:text-white transition duration-200">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {clientesFiltrados.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium italic">
                    No se encontraron clientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClienteTable;