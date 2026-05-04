import React, { useState, useEffect } from 'react';
import { X, Search, Calendar, Clock, DollarSign, AlignLeft, CheckCircle2 } from 'lucide-react';

// DATOS SIMULADOS
const CLIENTES_SIMULADOS = [
  { id: 1, nombre: 'Carlos Pérez', telefono: '987654321' },
  { id: 2, nombre: 'María López', telefono: '912345678' },
  { id: 3, nombre: 'Luis García', telefono: '998877665' },
];

const SERVICIOS_SIMULADOS = [
  { id: 1, nombre: 'Corte de Cabello', precio: 25.00, duracion: '45 min' },
  { id: 2, nombre: 'Tinte Completo', precio: 80.00, duracion: '2h 30m' },
  { id: 3, nombre: 'Barba Express', precio: 15.00, duracion: '20 min' },
  { id: 4, nombre: 'Manicura', precio: 30.00, duracion: '1h' },
];

const FormularioCita = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    clienteId: '',
    servicioId: '',
    descripcion: '',
    fecha: '',
    hora: '',
    duracion: '',
    precio: '',
    estado: 'Realizado' // Valor por defecto
  });

  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [busquedaServicio, setBusquedaServicio] = useState('');

  // Filtrar listas en base a la búsqueda
  const clientesFiltrados = CLIENTES_SIMULADOS.filter(c => 
    c.nombre.toLowerCase().includes(busquedaCliente.toLowerCase())
  );

  const serviciosFiltrados = SERVICIOS_SIMULADOS.filter(s => 
    s.nombre.toLowerCase().includes(busquedaServicio.toLowerCase())
  );

  // Al seleccionar un servicio, auto-completar precio y duración
  const manejarSeleccionServicio = (id) => {
    const servicio = SERVICIOS_SIMULADOS.find(s => s.id === parseInt(id));
    if (servicio) {
      setFormData({ 
        ...formData, 
        servicioId: id, 
        precio: servicio.precio, 
        duracion: servicio.duracion 
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#111111] w-full max-w-2xl rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Calendar className="text-amber-500" size={24} />
            Nueva Cita
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Buscador de Cliente */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Search size={14} /> Cliente
              </label>
              <div className="space-y-1">
                <input 
                  type="text"
                  placeholder="Buscar cliente..."
                  className="w-full text-xs p-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-md outline-none focus:border-amber-500"
                  value={busquedaCliente}
                  onChange={(e) => setBusquedaCliente(e.target.value)}
                />
                <select 
                  required
                  className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500/20 transition"
                  value={formData.clienteId}
                  onChange={(e) => setFormData({...formData, clienteId: e.target.value})}
                >
                  <option value="">Seleccionar cliente</option>
                  {clientesFiltrados.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Buscador de Servicio */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Search size={14} /> Servicio
              </label>
              <div className="space-y-1">
                <input 
                  type="text"
                  placeholder="Buscar servicio..."
                  className="w-full text-xs p-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-md outline-none focus:border-amber-500"
                  value={busquedaServicio}
                  onChange={(e) => setBusquedaServicio(e.target.value)}
                />
                <select 
                  required
                  className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500/20 transition"
                  value={formData.servicioId}
                  onChange={(e) => manejarSeleccionServicio(e.target.value)}
                >
                  <option value="">Seleccionar servicio</option>
                  {serviciosFiltrados.map(s => (
                    <option key={s.id} value={s.id}>{s.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fecha y Hora */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Calendar size={14} /> Fecha
              </label>
              <input 
                type="date"
                required
                className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:border-amber-500"
                onChange={(e) => setFormData({...formData, fecha: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Clock size={14} /> Hora
              </label>
              <input 
                type="time"
                required
                className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:border-amber-500"
                onChange={(e) => setFormData({...formData, hora: e.target.value})}
              />
            </div>

            {/* Duración y Precio */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Duración</label>
              <input 
                type="text"
                placeholder="Ej: 1h 30m"
                className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:border-amber-500"
                value={formData.duracion}
                onChange={(e) => setFormData({...formData, duracion: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <DollarSign size={14} /> Precio
              </label>
              <input 
                type="number"
                placeholder="0.00"
                className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:border-amber-500"
                value={formData.precio}
                onChange={(e) => setFormData({...formData, precio: e.target.value})}
              />
            </div>

            {/* Estado */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <CheckCircle2 size={14} /> Estado de la Cita
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['Pendiente', 'Confirmada', 'Realizado'].map((estado) => (
                  <button
                    key={estado}
                    type="button"
                    onClick={() => setFormData({...formData, estado})}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                      formData.estado === estado 
                        ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20' 
                        : 'bg-transparent border-gray-200 dark:border-zinc-800 text-gray-500 hover:border-amber-500/50'
                    }`}
                  >
                    {estado}
                  </button>
                ))}
              </div>
            </div>

            {/* Descripción */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <AlignLeft size={14} /> Notas / Descripción
              </label>
              <textarea 
                rows="3"
                className="w-full p-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:border-amber-500 resize-none"
                placeholder="Detalles adicionales..."
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              ></textarea>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-900 transition"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 shadow-lg shadow-amber-500/30 transition transform active:scale-[0.98]"
            >
              Guardar Cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioCita;