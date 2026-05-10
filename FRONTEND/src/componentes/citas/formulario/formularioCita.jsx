import React, { useMemo, useState } from 'react';
import {
  X,
  Calendar,
  Sparkles,
  User,
  Clock,
  DollarSign
} from 'lucide-react';

const CLIENTES_SIMULADOS = [
  { id: 1, nombre: 'Carlos Pérez', telefono: '987654321' },
  { id: 2, nombre: 'María López', telefono: '912345678' },
  { id: 3, nombre: 'Luis García', telefono: '998877665' }
];

const SERVICIOS_SIMULADOS = [
  { id: 1, nombre: 'Corte Premium', precio: 25, duracionMinutos: 45, categoria: 'Cabello', color: '#F59E0B', descripcion: 'Lavado + corte + peinado' },
  { id: 2, nombre: 'Tinte Completo', precio: 80, duracionMinutos: 150, categoria: 'Coloración', color: '#EC4899', descripcion: 'Color completo profesional' },
  { id: 3, nombre: 'Barba Express', precio: 15, duracionMinutos: 20, categoria: 'Barba', color: '#10B981', descripcion: 'Perfilado rápido de barba' },
];

const HORAS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];
const HORAS_OCUPADAS = ['11:00', '12:30', '15:30'];

const estadoStyles = {
  Pendiente: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30',
  Confirmada: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
  Realizada: 'bg-green-500/20 text-green-600 border-green-500/30',
  Cancelada: 'bg-red-500/20 text-red-600 border-red-500/30'
};

const FormularioCita = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    clienteId: null,
    servicioId: null,
    fecha: '',
    horaInicio: '',
    duracionMinutos: 0,
    precio: 0,
    descripcion: '',
    estado: 'Pendiente'
  });

  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [busquedaServicio, setBusquedaServicio] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);

  const clientesFiltrados = useMemo(() => 
    busquedaCliente ? CLIENTES_SIMULADOS.filter(c => c.nombre.toLowerCase().includes(busquedaCliente.toLowerCase())) : []
  , [busquedaCliente]);

  const serviciosFiltrados = useMemo(() => 
    busquedaServicio ? SERVICIOS_SIMULADOS.filter(s => s.nombre.toLowerCase().includes(busquedaServicio.toLowerCase())) : []
  , [busquedaServicio]);

  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setFormData(prev => ({ ...prev, clienteId: cliente.id }));
    setBusquedaCliente(cliente.nombre);
  };

  const seleccionarServicio = (servicio) => {
    setServicioSeleccionado(servicio);
    setFormData(prev => ({ 
      ...prev, 
      servicioId: servicio.id, 
      precio: servicio.precio, 
      duracionMinutos: servicio.duracionMinutos,
      descripcion: servicio.descripcion 
    }));
    setBusquedaServicio(servicio.nombre);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/800 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-yellow-500/20 bg-white dark:bg-[#0f0f0f] shadow-2xl overflow-hidden">
        
        {/* HEADER - Fijo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-yellow-500/10 bg-gradient-to-r from-yellow-500/5 to-transparent">
          <div>
            <h2 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
              <Calendar className="text-yellow-500" size={22} />
              Nueva Cita
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-yellow-500/10 transition text-yellow-500">
            <X size={24} />
          </button>
        </div>

        {/* CUERPO - Con Scroll */}
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); onClose(); }} className="p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Cliente */}
            <div className="space-y-2 relative">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <User size={14} className="text-yellow-500" /> Cliente
              </label>
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={busquedaCliente}
                onChange={(e) => setBusquedaCliente(e.target.value)}
                className="w-full rounded-xl border border-yellow-500/10 bg-gray-50 dark:bg-zinc-900/50 p-3 text-sm outline-none focus:border-yellow-500 transition"
              />
              {busquedaCliente && clientesFiltrados.length > 0 && !clienteSeleccionado && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-yellow-500/10 bg-white dark:bg-zinc-900 shadow-xl z-50 max-h-40 overflow-y-auto">
                  {clientesFiltrados.map(c => (
                    <button key={c.id} type="button" onClick={() => seleccionarCliente(c)} className="w-full p-3 text-left hover:bg-yellow-50 dark:hover:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-800 last:border-0 text-sm">
                      <span className="block font-medium dark:text-white">{c.nombre}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Servicio */}
            <div className="space-y-2 relative">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <Sparkles size={14} className="text-yellow-500" /> Servicio
              </label>
              <input
                type="text"
                placeholder="Buscar servicio..."
                value={busquedaServicio}
                onChange={(e) => setBusquedaServicio(e.target.value)}
                className="w-full rounded-xl border border-yellow-500/10 bg-gray-50 dark:bg-zinc-900/50 p-3 text-sm outline-none focus:border-yellow-500 transition"
              />
              {busquedaServicio && serviciosFiltrados.length > 0 && !servicioSeleccionado && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-yellow-500/10 bg-white dark:bg-zinc-900 shadow-xl z-50 max-h-40 overflow-y-auto">
                  {serviciosFiltrados.map(s => (
                    <button key={s.id} type="button" onClick={() => seleccionarServicio(s)} className="w-full p-3 text-left hover:bg-yellow-50 dark:hover:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-800 last:border-0 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-medium dark:text-white">{s.nombre}</span>
                        <span className="text-yellow-600 font-bold">S/ {s.precio}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fecha */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Fecha</label>
              <input
                type="date"
                required
                value={formData.fecha}
                onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
                className="w-full rounded-xl border border-yellow-500/10 bg-gray-50 dark:bg-zinc-900/50 p-3 text-sm outline-none focus:border-yellow-500 dark:text-white"
              />
            </div>

            {/* Resumen Precio/Duración */}
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Precio</label>
                <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 font-bold text-sm">
                  S/ {formData.precio}
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Duración</label>
                <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 text-sm">
                  {formData.duracionMinutos} min
                </div>
              </div>
            </div>

            {/* Horas Disponibles */}
            <div className="md:col-span-2 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <Clock size={14} /> Seleccionar Hora
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {HORAS.map(hora => {
                  const ocupado = HORAS_OCUPADAS.includes(hora);
                  const seleccionado = formData.horaInicio === hora;
                  return (
                    <button
                      key={hora}
                      type="button"
                      disabled={ocupado}
                      onClick={() => setFormData(prev => ({ ...prev, horaInicio: hora }))}
                      className={`py-2 rounded-lg text-xs font-bold transition-all border ${
                        ocupado ? 'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20 text-red-300 cursor-not-allowed' :
                        seleccionado ? 'bg-yellow-500 border-yellow-500 text-black shadow-lg shadow-yellow-500/30 scale-105' :
                        'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-yellow-500 dark:text-gray-300'
                      }`}
                    >
                      {hora}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Estado */}
            <div className="md:col-span-2 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Estado de Cita</label>
              <div className="flex gap-2 flex-wrap">
                {Object.keys(estadoStyles).map(estado => (
                  <button
                    key={estado}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, estado }))}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                      formData.estado === estado ? estadoStyles[estado] : 'border-zinc-200 dark:border-zinc-800 text-gray-400'
                    }`}
                  >
                    {estado}
                  </button>
                ))}
              </div>
            </div>

            {/* Notas */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Notas Adicionales</label>
              <textarea
                rows={3}
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                className="w-full resize-none rounded-xl border border-yellow-500/10 bg-gray-50 dark:bg-zinc-900/50 p-4 text-sm outline-none focus:border-yellow-500 transition dark:text-white"
              />
            </div>
          </div>

          {/* BOTONES ACCIÓN */}
          <div className="flex gap-4 mt-8">
            <button type="button" onClick={onClose} className="flex-1 rounded-2xl border border-zinc-200 dark:border-zinc-800 py-4 font-bold dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
              Cancelar
            </button>
            <button type="submit" className="flex-1 rounded-2xl bg-gradient-to-r from-yellow-600 to-yellow-500 py-4 font-extrabold text-black shadow-xl shadow-yellow-500/20 hover:scale-[1.02] active:scale-[0.98] transition">
              Agendar Cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioCita;