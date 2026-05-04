import React, { useState, useMemo } from 'react';
import { Pencil, Trash2, Eye, AlertTriangle } from 'lucide-react';
import FormularioVer from "./formularios/formularioVer";
import FormularioEditar from "./formularios/formularioEditar";

// Datos iniciales
const initialClientes = [
  { id: 1, nombre: 'Carlos Pérez', telefono: '987654321', correo: 'carlos@mail.com', frecuencia: 'Frecuente', visitas: 12, ultimaVisita: '2026-04-20', seguimiento: 'Cliente VIP' },
  { id: 2, nombre: 'María López', telefono: '912345678', correo: 'maria@mail.com', frecuencia: 'Regular', visitas: 6, ultimaVisita: '2026-04-15', seguimiento: 'Prefiere tardes' },
  { id: 3, nombre: 'Luis García', telefono: '998877665', correo: 'luis@mail.com', frecuencia: 'Nuevo', visitas: 1, ultimaVisita: '2026-04-10', seguimiento: 'Primera visita' },
];

const getFrecuenciaColor = (frecuencia) => {
  switch (frecuencia) {
    case 'Frecuente': return 'bg-green-500/20 text-green-600 dark:bg-green-900/30 dark:text-green-400';
    case 'Regular': return 'bg-yellow-500/20 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'Nuevo': return 'bg-blue-500/20 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
    default: return 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
  }
};

const ClienteTable = ({ filters }) => {
  // ESTADOS
  const [listaClientes, setListaClientes] = useState(initialClientes);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [modalType, setModalType] = useState(null); // 'ver', 'editar', 'borrar'

  // FUNCIONES DE ACCIÓN
  const cerrarModal = () => {
    setModalType(null);
    setClienteSeleccionado(null);
  };

  const abrirModal = (tipo, cliente) => {
    setClienteSeleccionado(cliente);
    setModalType(tipo);
  };

  const eliminarCliente = (id) => {
    const nuevaLista = listaClientes.filter(c => c.id !== id);
    setListaClientes(nuevaLista);
    cerrarModal();
  };

  const actualizarCliente = (datosEditados) => {
    const nuevaLista = listaClientes.map(c => 
      c.id === clienteSeleccionado.id ? { ...c, ...datosEditados } : c
    );
    setListaClientes(nuevaLista);
    cerrarModal();
  };
// --- LÓGICA DE FILTRADO ---
  const clientesFiltrados = useMemo(() => {
    return listaClientes.filter(cliente => {
      // 1. Filtro de Búsqueda (Nombre o Teléfono)
      const matchesSearch = 
        cliente.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
        cliente.telefono.includes(filters.search);

      // 2. Filtro de Frecuencia
      const matchesFrecuencia = filters.frecuencia === '' || cliente.frecuencia === filters.frecuencia;

      // 3. Filtro de Visitas
      let matchesVisitas = true;
      if (filters.visitas === '0-5') matchesVisitas = cliente.visitas <= 5;
      else if (filters.visitas === '5-15') matchesVisitas = cliente.visitas > 5 && cliente.visitas <= 15;
      else if (filters.visitas === '15-25') matchesVisitas = cliente.visitas > 15 && cliente.visitas <= 25;
      else if (filters.visitas === '25+') matchesVisitas = cliente.visitas > 25;

      return matchesSearch && matchesFrecuencia && matchesVisitas;
    });
  }, [filters, listaClientes]);
  return (
    <div className="w-full text-gray-800 dark:text-gray-300 font-sans">
      <div className="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#111111] shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-gray-800">
              <th className="px-6 py-4">Nombre</th>
              <th className="px-6 py-4 text-center">Teléfono</th>
              <th className="px-6 py-4 text-center">Frecuencia</th>
              <th className="px-6 py-4 text-center">Visitas</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {clientesFiltrados.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.03] transition">
                <td className="px-6 py-4 text-sm font-medium">{cliente.nombre}</td>
                <td className="px-6 py-4 text-sm text-center">{cliente.telefono}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded text-xs font-medium ${getFrecuenciaColor(cliente.frecuencia)}`}>
                    {cliente.frecuencia}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-center">{cliente.visitas}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    {/* BOTÓN VER */}
                    <button 
                      onClick={() => abrirModal('ver', cliente)}
                      className="p-2 border border-blue-500/30 rounded text-blue-500 hover:bg-blue-500 hover:text-white transition">
                      <Eye size={16} />
                    </button>

                    {/* BOTÓN EDITAR */}
                    <button 
                      onClick={() => abrirModal('editar', cliente)}
                      className="p-2 border border-yellow-500/30 rounded text-yellow-500 hover:bg-yellow-500 hover:text-white transition">
                      <Pencil size={16} />
                    </button>

                    {/* BOTÓN BORRAR */}
                    <button 
                      onClick={() => abrirModal('borrar', cliente)}
                      className="p-2 border border-red-500/30 rounded text-red-500 hover:bg-red-500 hover:text-white transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {/* Mensaje si no hay resultados */}
            {clientesFiltrados.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-500 italic">
                  No se encontraron clientes con esos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* RENDERIZADO DE MODALES */}
      
      <FormularioVer 
        isOpen={modalType === 'ver'} 
        onClose={cerrarModal} 
        cliente={clienteSeleccionado} 
      />

      <FormularioEditar 
        isOpen={modalType === 'editar'} 
        onClose={cerrarModal} 
        cliente={clienteSeleccionado}
        onSubmit={actualizarCliente}
      />

      {/* MODAL DE CONFIRMACIÓN DE BORRADO */}
      {modalType === 'borrar' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f0f0f] w-full max-w-sm rounded-2xl p-6 border border-red-500/20 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">¿Eliminar cliente?</h3>
              <p className="text-gray-500 text-sm mb-6">
                ¿Estás seguro de eliminar a <b>{clienteSeleccionado?.nombre}</b>? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3 w-full">
                <button onClick={cerrarModal} className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-zinc-800 font-semibold transition">
                  Cancelar
                </button>
                <button 
                  onClick={() => eliminarCliente(clienteSeleccionado.id)} 
                  className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-500 transition"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClienteTable;