import React, { useState } from "react";
import { X, User, Phone, Mail, UserPlus } from "lucide-react";

export default function FormularioCliente({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({
    nombre: "",
    numero: "",
    correo: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    // Limpiar formulario después de enviar
    setForm({ nombre: "", numero: "", correo: "" });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl p-6 bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-zinc-800 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Cabecera */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <UserPlus className="text-blue-500" size={20} />
            </div>
            <h2 className="text-xl font-bold dark:text-white">Nuevo Cliente</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition"
          >
            <X className="text-gray-500" size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Campo Nombre */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
              Nombre Completo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                required
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ej. Juan Pérez"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500/40 outline-none transition"
              />
            </div>
          </div>

          {/* Campo Número */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
              Número de Teléfono <span className="text-gray-400 font-normal">(Opcional)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="tel"
                name="numero"
                value={form.numero}
                onChange={handleChange}
                placeholder="+51 900 000 000"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500/40 outline-none transition"
              />
            </div>
          </div>

          {/* Campo Correo */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
              Correo Electrónico <span className="text-gray-400 font-normal">(Opcional)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                placeholder="cliente@ejemplo.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500/40 outline-none transition"
              />
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-zinc-800 font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition"
            >
              Guardar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}