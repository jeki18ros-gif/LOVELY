import React from 'react';
import { X, Calendar, Sparkles, User, Clock } from 'lucide-react';
import { useFormularioCita, HORAS } from '../hook/useFromularioCita';

const estadoStyles = {
  Pendiente: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30',
  Confirmada: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
  Realizada: 'bg-green-500/20 text-green-600 border-green-500/30',
  Cancelada: 'bg-red-500/20 text-red-600 border-red-500/30'
};

const FormularioCita = ({ isOpen, onClose }) => {
  const {
    formData, setFormData,
    busquedaCliente, setBusquedaCliente,
    busquedaServicio, setBusquedaServicio,
    clientesFiltrados, serviciosFiltrados,
    clienteSeleccionado, servicioSeleccionado,
    horasOcupadas, mensaje,
    seleccionarCliente, seleccionarServicio,
    calcularHoraFin, guardarCita
  } = useFormularioCita(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {mensaje && (
        <div className="fixed top-5 right-5 z-[200] px-5 py-3 rounded-2xl bg-green-500 text-white font-bold shadow-2xl animate-pulse">
          {mensaje}
        </div>
      )}

      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-yellow-500/20 bg-white dark:bg-[#0f0f0f] shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-yellow-500/10 bg-gradient-to-r from-yellow-500/5 to-transparent">
          <h2 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
            <Calendar className="text-yellow-500" size={22} /> Nueva Cita
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-yellow-500/10 transition text-yellow-500">
            <X size={24} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={guardarCita} className="p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* BUSCADOR CLIENTE */}
            <div className="space-y-2 relative">
              <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                <User size={14} className="text-yellow-500" /> Cliente
              </label>
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={busquedaCliente}
                onChange={(e) => setBusquedaCliente(e.target.value)}
                className="w-full rounded-xl border border-yellow-500/10 bg-gray-50 dark:bg-zinc-900/50 p-3 text-sm outline-none focus:border-yellow-500 dark:text-white"
              />
              {clientesFiltrados.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border bg-white dark:bg-zinc-900 shadow-xl z-50 max-h-40 overflow-y-auto">
                  {clientesFiltrados.map(cliente => (
                    <button key={cliente.id} type="button" onClick={() => seleccionarCliente(cliente)} className="w-full p-3 text-left hover:bg-yellow-50 dark:hover:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-800 text-sm dark:text-white">
                      {cliente.nombre}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* BUSCADOR SERVICIO */}
            <div className="space-y-2 relative">
              <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                <Sparkles size={14} className="text-yellow-500" /> Servicio
              </label>
              <input
                type="text"
                placeholder="Buscar servicio..."
                value={busquedaServicio}
                onChange={(e) => setBusquedaServicio(e.target.value)}
                className="w-full rounded-xl border border-yellow-500/10 bg-gray-50 dark:bg-zinc-900/50 p-3 text-sm outline-none focus:border-yellow-500 dark:text-white"
              />
              {serviciosFiltrados.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border bg-white dark:bg-zinc-900 shadow-xl z-50 max-h-40 overflow-y-auto">
                  {serviciosFiltrados.map(servicio => (
                    <button key={servicio.id} type="button" onClick={() => seleccionarServicio(servicio)} className="w-full p-3 text-left hover:bg-yellow-50 dark:hover:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-800 text-sm dark:text-white flex justify-between">
                      <span>{servicio.nombre}</span>
                      <span className="text-yellow-600 font-bold">S/ {servicio.precio}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* FECHA, PRECIO, DURACIÓN */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500">Fecha</label>
              <input type="date" required value={formData.fecha} onChange={(e) => setFormData({...formData, fecha: e.target.value})} className="w-full rounded-xl border border-yellow-500/10 bg-gray-50 dark:bg-zinc-900/50 p-3 text-sm dark:text-white" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500">Precio</label>
              <input type="number" value={formData.precio} onChange={(e) => setFormData({...formData, precio: e.target.value})} className="w-full rounded-xl border border-yellow-500/10 bg-gray-50 dark:bg-zinc-900/50 p-3 text-sm dark:text-white" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500">Duración (min)</label>
              <input type="number" value={formData.duracionMinutos} onChange={(e) => setFormData({...formData, duracionMinutos: e.target.value})} className="w-full rounded-xl border border-yellow-500/10 bg-gray-50 dark:bg-zinc-900/50 p-3 text-sm dark:text-white" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500">Hora Fin</label>
              <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-sm dark:text-white">{calcularHoraFin()}</div>
            </div>

            {/* SELECTOR DE HORAS */}
            <div className="md:col-span-2 space-y-3">
              <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2"><Clock size={14} /> Seleccionar Hora</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {HORAS.map(hora => {
                  const ocupado = horasOcupadas.includes(hora);
                  const seleccionado = formData.horaInicio === hora;
                  return (
                    <button
                      key={hora}
                      type="button"
                      disabled={ocupado}
                      onClick={() => setFormData({...formData, horaInicio: hora})}
                      className={`py-3 rounded-2xl text-xs font-bold border transition-all ${
                        ocupado ? 'bg-red-50 dark:bg-red-950/20 border-red-200 text-red-300 cursor-not-allowed opacity-60' :
                        seleccionado ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 border-yellow-400 text-black scale-105 shadow-lg' :
                        'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 dark:text-zinc-300 hover:border-yellow-500'
                      }`}
                    >
                      {hora}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ESTADOS */}
            <div className="md:col-span-2 space-y-3">
              <label className="text-xs font-bold uppercase text-gray-500">Estado</label>
              <div className="flex gap-2 flex-wrap">
                {Object.keys(estadoStyles).map(est => (
                  <button
                    key={est}
                    type="button"
                    onClick={() => setFormData({...formData, estado: est})}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                      formData.estado === est ? estadoStyles[est] : 'border-zinc-200 dark:border-zinc-800 text-gray-400'
                    }`}
                  >
                    {est}
                  </button>
                ))}
              </div>
            </div>

            {/* NOTAS */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500">Notas</label>
              <textarea
                rows={3}
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                className="w-full resize-none rounded-xl border border-yellow-500/10 bg-gray-50 dark:bg-zinc-900/50 p-4 text-sm outline-none focus:border-yellow-500 dark:text-white"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button type="button" onClick={onClose} className="flex-1 rounded-2xl border border-zinc-200 dark:border-zinc-800 py-4 font-bold dark:text-white hover:bg-gray-50 transition">Cancelar</button>
            <button type="submit" className="flex-1 rounded-2xl bg-gradient-to-r from-yellow-600 to-yellow-500 py-4 font-extrabold text-black shadow-xl hover:scale-[1.02] transition">Agendar Cita</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioCita;