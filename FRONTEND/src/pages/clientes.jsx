import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

import ClientesHeader from '../componentes/Clientes/header';
import FilterBar from '../componentes/Clientes/filtros';
import ClientesTable from '../componentes/Clientes/tabla';
import FormularioCliente from '../componentes/Clientes/formularios/formulariocliente';

const Clientes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listaClientes, setListaClientes] = useState([]);

  const [filters, setFilters] = useState({
    search: '',
    frecuencia: '',
    visitas: ''
  });

  // 🔥 cargar clientes al iniciar
  useEffect(() => {
    obtenerClientes();
  }, []);

  const capitalizar = (texto) => {
    if (!texto) return 'Nuevo';
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  };

  const obtenerClientes = async () => {
    const { data, error } = await supabase
      .from('clientes')
     .select(`
  id,
  nombre,
  numero,
  correo,
  frecuencia,
  visitas,
  fecha_registro
`)

    if (error) {
      console.error(error);
      return;
    }

    const formateados = data.map(c => ({
      id: c.id,
      nombre: c.nombre,
      telefono: c.numero || '—',
      correo: c.correo || '—',
      frecuencia: capitalizar(c.frecuencia),
      visitas: c.visitas
    }));

    setListaClientes(formateados);
  };
const actualizarCliente = async (id, form) => {
  const { nombre, numero, correo, seguimiento } = form;

  const { error } = await supabase
    .from('clientes')
    .update({
      nombre,
      numero: numero?.trim() || null,
correo: correo?.trim() || null,
    })
    .eq('id', id);

  if (error) {
    console.error(error);
    alert('Error al actualizar cliente');
    return;
  }
if (seguimiento && seguimiento.trim() !== "") {
    const { error: errorSeguimiento } = await supabase
      .from('seguimiento')
      .insert([
        { 
          id_cliente: id, 
          nota: seguimiento, 
          fecha: new Date().toISOString() 
        }
      ]);

    if (errorSeguimiento) console.error("Error al guardar seguimiento:", errorSeguimiento);
  }
  // actualizar UI
  setListaClientes(prev =>
    prev.map(c =>
      c.id === id
        ? {
            ...c,
            nombre,
            telefono: numero || '—',
            correo: correo || '—'
          }
        : c
    )
  );
};
  // 🔥 INSERT
  const handleSaveCliente = async (form) => {
    const { nombre, numero, correo } = form;

    const { data, error } = await supabase
      .from('clientes')
      .insert([{
        nombre,
        numero: numero || null,
        correo: correo || null,
        visitas: 0,
        frecuencia: 'nuevo'
      }])
      .select();

    if (error) {
      console.error(error);
      alert('Error al crear cliente');
      return;
    }

    const nuevoCliente = {
      id: data[0].id,
      nombre: data[0].nombre,
      telefono: data[0].numero || '—',
      correo: data[0].correo || '—',
      frecuencia: capitalizar(data[0].frecuencia),
      visitas: data[0].visitas
    };

    setListaClientes(prev => [nuevoCliente, ...prev]);
    setIsModalOpen(false);
  };

return (
    <div className="min-h-screen bg-gray-666 dark:bg-[#0a0a0a] transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        
        {/* SECCIÓN 1: HEADER (Título y Acciones principales) */}
        <header className="relative">
          <ClientesHeader onOpenModal={() => setIsModalOpen(true)} />
        </header>

        {/* SECCIÓN 2: CONTROLES (Búsqueda y Filtros) */}
        <section className="bg-white dark:bg-zinc-900/50 p-4 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 px-1">
              Opciones de filtrado
            </h3>
            <FilterBar filters={filters} setFilters={setFilters} />
          </div>
        </section>

        {/* SECCIÓN 3: CONTENIDO PRINCIPAL (Tabla/Listado) */}
        <main className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <ClientesTable 
              filters={filters}
              listaClientes={listaClientes}
              setListaClientes={setListaClientes}
              actualizarCliente={actualizarCliente}
            />
          </div>
        </main>

        {/* COMPONENTE MODAL (Fuera del flujo visual) */}
        <FormularioCliente 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSaveCliente}
        />
      </div>
    </div>
  );
};

export default Clientes;