import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Eye, ChevronLeft, ChevronRight, X, AlertTriangle } from 'lucide-react';
import FormularioVer from './formularios/FormularioVer';
import FormularioEditar from './formularios/FormularioEditar';
import useServicesTable from './hook/useServicesTable';
const ServiceTable = ({
  filters,
  categoriaSeleccionada,
  refresh,
  categorias
}) => {

  const {
    selectedService,
    modalType,
    currentPage,
    setSelectedService,
    setModalType,
    setCurrentPage,
    filteredServices,
    currentItems,
    totalPages,
    closeModal,
    handleToggleStatus,
    handleDelete,
    handleUpdate
} = useServicesTable({
  filters,
  categoriaSeleccionada,
  refresh
});
  return (
    <div className="w-full text-gray-800 dark:text-gray-300 font-sans p-4">
      <div className="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#111111] shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02]">
              <th className="px-6 py-4 font-medium">Servicio</th>
              <th className="px-6 py-4 text-center">Precio</th>
              <th className="px-6 py-4 text-center">Duración</th>
              <th className="px-6 py-4 text-center">Categoría</th>
              <th className="px-6 py-4 text-center">Estado</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {currentItems.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.03] transition">
                <td className="px-6 py-4 text-sm font-medium">{service.nombre}</td>
                <td className="px-6 py-4 text-sm text-center font-semibold text-amber-600 dark:text-amber-500">s/ {service.precio}</td>
                <td className="px-6 py-4 text-sm text-center">{service.duracion} min</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded text-xs font-medium ${service.categoryColor}`}>
                    {service.categoria}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button 
  onClick={() => handleToggleStatus(service.id)}
  className={`w-10 h-5 flex items-center rounded-full p-1 transition cursor-pointer
    ${service.estado ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
>
  <div className={`bg-white w-3 h-3 rounded-full shadow transform transition
    ${service.estado ? 'translate-x-5' : 'translate-x-0'}`} />
</button>
<span className="text-xs text-gray-500 dark:text-gray-400 w-12 text-left">
  {service.estado ? 'Activo' : 'Inactivo'}
</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => { setSelectedService(service); setModalType('view'); }} className="p-2 border border-blue-500/30 rounded-lg text-blue-500 hover:bg-blue-500 hover:text-white transition"><Eye size={16} /></button>
                    <button onClick={() => { setSelectedService(service); setModalType('edit'); }} className="p-2 border border-amber-500/30 rounded-lg text-amber-500 hover:bg-amber-500 hover:text-black transition"><Pencil size={16} /></button>
                    <button onClick={() => { setSelectedService(service); setModalType('delete'); }} className="p-2 border border-red-500/30 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                  No se encontraron servicios con estos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/50">
          <p className="text-xs text-gray-500 italic uppercase tracking-wider font-bold">Total: {filteredServices.length} resultados</p>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded border dark:border-zinc-700 disabled:opacity-20"><ChevronLeft size={18}/></button>
            <span className="flex items-center text-sm font-mono font-bold px-3">{currentPage} / {totalPages || 1}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded border dark:border-zinc-700 disabled:opacity-20"><ChevronRight size={18}/></button>
          </div>
        </div>
      </div>

      {/* --- MODALES EXTERNOS --- */}
      
      <FormularioVer 
        isOpen={modalType === 'view'} 
        onClose={closeModal} 
        service={selectedService} 
      />

      <FormularioEditar 
  isOpen={modalType === 'edit'} 
  onClose={closeModal} 
  service={selectedService} 
  onSubmit={handleUpdate}
  categorias={categorias}
/>

      {/* Modal de Eliminación (Confirmación Simple) */}
      {modalType === 'delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f0f0f] w-full max-w-sm rounded-2xl p-6 border border-red-500/20 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">¿Eliminar servicio?</h3>
              <p className="text-gray-500 text-sm mb-6">Esta acción no se puede deshacer. El servicio <span className="text-gray-800 dark:text-white font-bold italic">"{selectedService.nombre}"</span> será borrado.</p>
              <div className="flex gap-3 w-full">
                <button onClick={closeModal} className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-zinc-800 font-semibold hover:bg-gray-200 dark:hover:bg-zinc-700 transition">Cancelar</button>
                <button onClick={() => handleDelete(selectedService.id)} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-500 transition">Sí, eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceTable;