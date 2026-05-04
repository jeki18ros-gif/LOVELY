import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

export default function FormularioEditar({ isOpen, onClose, onSubmit, service }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: "",
    category: "",
  });

  // Efecto para cargar los datos cuando se abre el modal
  useEffect(() => {
    if (service) {
      setForm({
        name: service.name,
        price: service.price,
        duration: service.duration,
        category: service.category,
      });
    }
  }, [service]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl p-6 bg-white dark:bg-black border border-amber-500/30">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-amber-400">Editar Servicio</h2>
          <button onClick={onClose}><X className="text-gray-500 hover:text-amber-500" /></button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre"
            className="w-full p-3 rounded-xl bg-transparent border border-zinc-800 text-white focus:ring-2 focus:ring-amber-500/40 outline-none"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Precio"
              className="p-3 rounded-xl bg-transparent border border-zinc-800 text-white"
            />
            <input
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="Duración"
              className="p-3 rounded-xl bg-transparent border border-zinc-800 text-white"
            />
          </div>
          
          <button type="submit" className="w-full p-3 bg-amber-500 text-black font-bold rounded-xl flex items-center justify-center gap-2">
            <Save size={18} /> Actualizar Servicio
          </button>
        </form>
      </div>
    </div>
  );
}