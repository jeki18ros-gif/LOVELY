import React, { useState } from 'react'; // Importar useState
import ClientesHeader from '../componentes/Clientes/header';
import FilterBar from '../componentes/Clientes/filtros';
import ClientesTable from '../componentes/Clientes/tabla';
import FormularioCliente from '../componentes/Clientes/formularios/formulariocliente';

const Clientes = () => {
  // 1. Estado para controlar el modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveCliente = (nuevoCliente) => {
    console.log("Cliente guardado:", nuevoCliente);
    setIsModalOpen(false); // Cerrar después de guardar
  };
const [filters, setFilters] = useState({
    search: '',
    frecuencia: '',
    visitas: ''
  });
  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-[#0a0a0a] text-gray-800 dark:text-white transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto flex gap-6 items-stretch">
        <main className="flex-1 flex">
          <div className="w-full flex flex-col gap-6 p-6 rounded-xl shadow-xl bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800">
            
            {/* 2. Pasamos la función para abrir el modal */}
            <ClientesHeader onOpenModal={() => setIsModalOpen(true)} />
            
          <FilterBar filters={filters} setFilters={setFilters} />

            <div className="flex-1 flex flex-col">
              {/* 3. Pasamos los filtros a la tabla */}
              <ClientesTable filters={filters} />
            </div>
          </div>
        </main>
      </div>

      {/* 3. Renderizamos el Formulario Modal */}
      <FormularioCliente 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSaveCliente}
      />
    </div>
  );
};

export default Clientes;