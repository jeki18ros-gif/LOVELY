import React, { useState } from 'react';
import ProductosHeader from '../componentes/productos/header';
import CategorySidebar from '../componentes/productos/categoria';
import FilterBar from '../componentes/productos/filtros';
import ProductosTable from '../componentes/productos/tabla';
import FormularioT from '../componentes/productos/formularios/formularioTabla';

const Productos = () => {
  const [openModal, setOpenModal] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    stock: '',
    price: '',
    status: ''
  });

  const handleSubmitNuevo = (data) => {
    console.log("Nuevo producto creado:", data);
    setOpenModal(false);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-[#0a0a0a] text-gray-800 dark:text-white">
      <div className="max-w-[1400px] mx-auto flex gap-6 items-stretch">
        <aside className="w-64 shrink-0">
          <CategorySidebar onCategoriaChange={setCategoriaSeleccionada} />
        </aside>

        <main className="flex-1 flex">
          <div className="w-full flex flex-col gap-6 p-6 rounded-xl shadow-xl bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800">
            <ProductosHeader onOpenModal={() => setOpenModal(true)}/>
            <FilterBar filters={filters} setFilters={setFilters} />
            <div className="flex-1 flex flex-col">
              <ProductosTable
  filters={filters} 
  categoriaSeleccionada={categoriaSeleccionada}
/>
            </div>
          </div>
        </main>
      </div>

      {/* Modal para CREAR NUEVO */}
      <FormularioT
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmitNuevo}
      />
    </div>
  );
};

export default Productos;