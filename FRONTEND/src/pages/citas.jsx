import React, { useState } from 'react';
import CitasHeader from '../componentes/citas/header';
import Agenda from '../componentes/citas/agenda';
import DetalleCita from '../componentes/citas/detallecita';
import FormularioCita from '../componentes/citas/formulario/formularioCita';

const Citas = () => {
  const [openDetalle, setOpenDetalle] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false); // Estado para el formulario
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);

  const handleOpen = (cita) => {
    setCitaSeleccionada(cita);
    setOpenDetalle(true);
  };

  const handleClose = () => {
    setOpenDetalle(false);
  };

  const handleSaveCita = (nuevaCita) => {
    console.log("Cita registrada:", nuevaCita);
    // Aquí podrías actualizar tu lista de citas en la agenda
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-[#0a0a0a] text-gray-800 dark:text-white transition-colors duration-300">
      
      <div className="max-w-[1400px] mx-auto flex gap-6 items-stretch">
        <main className="flex-1 flex">
          <div className="w-full flex flex-col gap-6 p-6 rounded-xl shadow-xl
                          bg-white dark:bg-[#111111]
                          border border-gray-200 dark:border-gray-800">

            {/* Pasamos la función para abrir el formulario */}
            <CitasHeader onOpenForm={() => setIsFormOpen(true)} />

            <div className="flex-1 flex flex-col">
              <Agenda onSelectCita={handleOpen} />
            </div>

          </div>
        </main>
      </div>

      {/* PANEL DESLIZANTE DE DETALLE */}
      <DetalleCita 
        isOpen={openDetalle} 
        onClose={handleClose} 
        cita={citaSeleccionada}
      />

      {/* MODAL DEL FORMULARIO */}
      <FormularioCita 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleSaveCita}
      />
    </div>
  );
};

export default Citas;