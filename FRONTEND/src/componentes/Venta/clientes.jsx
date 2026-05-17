// ClientCard.jsx
import React, { useState, useEffect } from 'react';
import { User, Plus, UserMinus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const ClientCard = ({ cliente, setCliente, clienteAnonimo, setClienteAnonimo }) => {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [clientes, setClientes] = useState([]);

  // Sincronizar búsqueda con el cliente seleccionado
  useEffect(() => {
    if (cliente) { setBusqueda(cliente.nombre); } 
    else { setBusqueda(''); }
    setClientes([]); 
  }, [cliente]);

  // Buscar clientes reales
  useEffect(() => {
    const buscarClientes = async () => {
      if (!busqueda.trim() || clienteAnonimo) {
        setClientes([]);
        return;
      }
      const { data, error } = await supabase.from('clientes').select('*').ilike('nombre', `%${busqueda}%`).limit(5);
      if (error) { console.error(error); return; }
      setClientes(data || []);
    };
    buscarClientes();
  }, [busqueda, clienteAnonimo]);

  return (
    <div className="max-w-md h-[500px] flex flex-col p-6 rounded-xl bg-white dark:bg-[#121212] text-gray-800 dark:text-white shadow-xl border border-gray-200 dark:border-zinc-800">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <User className="text-amber-500" size={20} />
          <h2 className="text-sm font-bold tracking-widest uppercase">Cliente</h2>
        </div>

        {/* NUEVO CLIENTE */}
        <button onClick={() => navigate('/clientes')} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 transition-colors text-xs font-medium">
          <Plus size={14}/> Nuevo cliente
        </button>
      </div>

      {/* INPUT */}
      <div className="relative mb-4">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            if (clienteAnonimo) { setCliente({ id: 'manual', nombre: e.target.value }); }
          }}
          placeholder={clienteAnonimo ? 'Nombre manual del cliente...' : 'Buscar por nombre...'}
          className="w-full bg-gray-100 dark:bg-zinc-900 rounded-lg py-2.5 pl-4 pr-10 text-sm outline-none focus:ring-1 focus:ring-purple-500"
        />

        {/* BOTÓN CLIENTE MANUAL */}
        <button onClick={() => { setClienteAnonimo(!clienteAnonimo); setCliente(null); setBusqueda(''); setClientes([]); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition">
          <UserMinus size={18}/>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* RESULTADOS */}
        {clientes.length > 0 && !clienteAnonimo && (
          <div className="mb-4 rounded-xl overflow-y-auto max-h-48 border border-gray-200 dark:border-zinc-800">
            {clientes.map(clienteDB => (
              <button
                key={clienteDB.id}
                onClick={() => { setCliente(clienteDB); setClienteAnonimo(false); setBusqueda(clienteDB.nombre); setClientes([]); }}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-zinc-800 border-b border-gray-100 dark:border-zinc-800 transition"
              >
                <p className="font-medium">{clienteDB.nombre}</p>
              </button>
            ))}
          </div>
        )}

        {/* CLIENTE SELECCIONADO */}
        {cliente && (
          <>
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-semibold">{cliente.nombre}</h3>
                  {cliente.id === 'manual' && (
                    <span className="text-[10px] px-2 py-1 rounded-full bg-amber-500/10 text-amber-500">No registrado</span>
                  )}
                </div>
              </div>
              <button onClick={() => { setCliente(null); setBusqueda(''); setClienteAnonimo(false); }} className="text-gray-500 hover:text-white transition-colors">
                <X size={20}/>
              </button>
            </div>
            <div className="border-t border-gray-100 dark:border-zinc-800/50" />
          </>
        )}
      </div>
    </div>
  );
};

export default ClientCard;