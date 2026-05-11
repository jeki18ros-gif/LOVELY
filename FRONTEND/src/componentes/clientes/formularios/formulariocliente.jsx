import React, { useState } from "react";
import { X, User, Phone, Mail, UserPlus, Save } from "lucide-react";

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
    setForm({ nombre: "", numero: "", correo: "" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/888 backdrop-blur-sm p-4">
      <div
        className="
          relative
          w-full
          max-w-md
          max-h-[90vh]
          flex flex-col
          overflow-hidden
          rounded-3xl
          border
          border-yellow-500/20
          bg-white
          dark:bg-[#0b0b0b]
          shadow-2xl
        "
      >
        {/* Barra decorativa superior */}
        <div className="h-2 w-full shrink-0 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-yellow-500/10 px-6 py-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
              <UserPlus className="text-yellow-600 dark:text-yellow-500" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black dark:text-white">
                Nuevo Cliente
              </h2>
              <p className="text-xs text-yellow-700 dark:text-yellow-500">
                Registra un nuevo perfil en el sistema
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-yellow-500/10 transition"
          >
            <X className="text-yellow-600 dark:text-yellow-400" />
          </button>
        </div>

        {/* Cuerpo del Formulario con Scroll */}
        <form
          onSubmit={handleSubmit}
          className="
            flex-1
            overflow-y-auto
            p-6
            space-y-5
            scrollbar-thin
            scrollbar-thumb-yellow-500/40
            scrollbar-track-transparent
          "
        >
          {/* Campo Nombre */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <User size={16} className="text-yellow-500" />
              Nombre Completo <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej. Juan Pérez"
              className="w-full rounded-2xl border border-yellow-500/20 bg-white dark:bg-white/[0.03] p-4 text-black dark:text-white outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10"
            />
          </div>

          {/* Campo Número */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Phone size={16} className="text-yellow-500" />
              Número de Teléfono
            </label>
            <input
              type="tel"
              name="numero"
              value={form.numero}
              onChange={handleChange}
              placeholder="+51 900 000 000"
              className="w-full rounded-2xl border border-yellow-500/20 bg-white dark:bg-white/[0.03] p-4 text-black dark:text-white outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10"
            />
          </div>

          {/* Campo Correo */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Mail size={16} className="text-yellow-500" />
              Correo Electrónico
            </label>
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              placeholder="cliente@ejemplo.com"
              className="w-full rounded-2xl border border-yellow-500/20 bg-white dark:bg-white/[0.03] p-4 text-black dark:text-white outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10"
            />
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 order-2 sm:order-1 py-4 rounded-2xl bg-gray-100 dark:bg-white/5 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 order-1 sm:order-2 py-4 rounded-2xl bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 font-bold text-black transition hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-500/20 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Guardar Cliente
            </button>
          </div>
        </form>

        {/* Barra inferior decorativa */}
        <div className="h-1 w-full shrink-0 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700" />
      </div>
    </div>
  );
}