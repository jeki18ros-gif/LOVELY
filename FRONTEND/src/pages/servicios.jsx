import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

import ServicesHeader from '../componentes/servicios/header';
import CategorySidebar from '../componentes/servicios/categoria';
import FilterBar from '../componentes/servicios/filtros';
import ServiceTable from '../componentes/servicios/tabla';
import FormularioT from '../componentes/servicios/formularios/formularioTabla';

const Servicios = () => {
  const [openModal, setOpenModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [filters, setFilters] = useState({
    nombre: '',
    duracion: '',
    precio: '',
    estado: ''
  });

  // OBTENER CATEGORÍAS
  const obtenerCategorias = async () => {

    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('tipo', 'servicio');

    if (error) {
      console.error(error);
      return;
    }

    setCategorias(data || []);
  };

  useEffect(() => {
    obtenerCategorias();
  }, []);

  // CREAR SERVICIO
 const handleSubmit = async (data) => {

  const { error } = await supabase
    .from('servicio')
    .insert([
      {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: Number(data.precio),
        duracion: Number(data.duracion),
        categoria_id: data.categoria_id,
        estado: data.estado === 'activo',
imagen_url: data.imagen_url
      }
    ]);

  if (error) {
    console.error(error);
    return;
  }

  setRefresh(prev => !prev);

  setOpenModal(false);
};
  return (
    <div
      className="
        min-h-screen p-6
        bg-gray-50 dark:bg-[#0a0a0a]
        text-gray-800 dark:text-white
        transition-colors duration-300
      "
    >

      <div className="max-w-[1400px] mx-auto flex gap-6 items-stretch">

        {/* SIDEBAR */}
        <aside className="w-64 shrink-0">

          <div className="h-full">
            <CategorySidebar
              onCategoriaChange={setCategoriaSeleccionada}
            />
          </div>

        </aside>

        {/* MAIN */}
        <main className="flex-1 flex">

          <div
            className="
              w-full flex flex-col gap-6 p-6 rounded-xl shadow-xl
              bg-white dark:bg-[#111111]
              border border-gray-200 dark:border-gray-800
            "
          >

            <ServicesHeader
              onOpenModal={() => setOpenModal(true)}
            />

            <FilterBar
              filters={filters}
              setFilters={setFilters}
            />

            <div className="flex-1 flex flex-col">

           <ServiceTable
  filters={filters}
  categoriaSeleccionada={categoriaSeleccionada}
  refresh={refresh}
  categorias={categorias}
/>
            </div>
          </div>
        </main>
      </div>
      {/* MODAL */}
      <FormularioT
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        categorias={categorias}
      />

    </div>
  );
};

export default Servicios;