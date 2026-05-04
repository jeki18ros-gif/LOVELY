import React, { useState } from 'react';
import ServicesHeader from '../componentes/servicios/header';
import CategorySidebar from '../componentes/servicios/categoria';
import FilterBar from '../componentes/servicios/filtros';
import ServiceTable from '../componentes/servicios/tabla';
import FormularioT from '../componentes/servicios/formularios/formularioTabla';

const Servicios = () => {
  const [openModal, setOpenModal] = useState(false);
  const [filters, setFilters] = useState({
  search: '',
  duration: '',
  price: '',
  status: ''
});
  const handleSubmit = (data) => {
    console.log("Nuevo servicio:", data);
  };

  return (
    <div className="
      min-h-screen p-6
      bg-gray-50 dark:bg-[#0a0a0a]
      text-gray-800 dark:text-white
      transition-colors duration-300
    ">
      
      <div className="max-w-[1400px] mx-auto flex gap-6 items-stretch">
        
        <aside className="w-64 shrink-0">
          <div className="h-full">
            <CategorySidebar />
          </div>
        </aside>

        <main className="flex-1 flex">
          <div className="
            w-full flex flex-col gap-6 p-6 rounded-xl shadow-xl
            bg-white dark:bg-[#111111]
            border border-gray-200 dark:border-gray-800
          ">
            
            <ServicesHeader onOpenModal={() => setOpenModal(true)} />

            <FilterBar filters={filters} setFilters={setFilters} />

            <div className="flex-1 flex flex-col">
              <ServiceTable filters={filters} />
            </div>

          </div>
        </main>

      </div>
      <FormularioT
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Servicios;