import React, { useState, useEffect } from "react";
import { X, User, Phone, Mail, Save, RefreshCw, MessageSquare } from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function FormularioEditar({ isOpen, onClose, onSubmit, cliente }) {
  const [form, setForm] = useState({
    nombre: "",
    numero: "",
    correo: "",
    seguimiento: "" // Nuevo campo
  });

  useEffect(() => {

  const cargarSeguimiento = async () => {

    if (!cliente || !isOpen) return;

    const { data: seguimientoData } = await supabase
      .from('seguimiento')
      .select('*')
      .eq('id_cliente', cliente.id)
      .eq('tipo', 'cliente')
      .order('fecha', { ascending: false })
      .limit(1)
      .maybeSingle();

    setForm({
      nombre: cliente.nombre || "",
      numero: cliente.telefono === '—'
        ? ""
        : cliente.telefono,

      correo: cliente.correo === '—'
        ? ""
        : cliente.correo,

      seguimiento:
        seguimientoData?.nota || ""
    });

  };

  cargarSeguimiento();

}, [cliente, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border border-yellow-500/20 bg-white dark:bg-[#0b0b0b] shadow-2xl">
        
        <div className="h-2 w-full shrink-0 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700" />

        <div className="flex items-center justify-between border-b border-yellow-500/10 px-6 py-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
              <RefreshCw className="text-yellow-600 dark:text-yellow-500" size={20} />
            </div>
            <h2 className="text-xl font-bold text-black dark:text-white">Editar Cliente</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-yellow-500/10 transition">
            <X className="text-yellow-600 dark:text-yellow-400" />
          </button>
        </div>

        <form 
          onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} 
          className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-yellow-500/40"
        >
          {/* Nombre */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <User size={16} className="text-yellow-500" /> Nombre Completo
            </label>
            <input
              required name="nombre" value={form.nombre} onChange={handleChange}
              className="w-full rounded-2xl border border-yellow-500/20 bg-white dark:bg-white/[0.03] p-4 text-black dark:text-white outline-none focus:border-yellow-500"
            />
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Phone size={16} className="text-yellow-500" /> Teléfono
            </label>
            <input
              name="numero" value={form.numero} onChange={handleChange}
              className="w-full rounded-2xl border border-yellow-500/20 bg-white dark:bg-white/[0.03] p-4 text-black dark:text-white outline-none focus:border-yellow-500"
            />
          </div>

          {/* Seguimiento / Notas */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <MessageSquare size={16} className="text-yellow-500" /> Notas de Seguimiento
            </label>
            <textarea
              name="seguimiento" value={form.seguimiento} onChange={handleChange} rows={3}
              placeholder="Escribe aquí el estado actual o notas del cliente..."
              className="w-full rounded-2xl border border-yellow-500/20 bg-white dark:bg-white/[0.03] p-4 text-black dark:text-white outline-none focus:border-yellow-500 resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 shrink-0">
            <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl bg-gray-100 dark:bg-white/5 font-bold text-gray-600 dark:text-gray-300 transition">
              Descartar
            </button>
            <button type="submit" className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 font-bold text-black flex items-center justify-center gap-2 transition hover:scale-[1.02]">
              <Save size={18} /> Guardar Cambios
            </button>
          </div>
        </form>
        <div className="h-1 w-full shrink-0 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700" />
      </div>
    </div>
  );
}