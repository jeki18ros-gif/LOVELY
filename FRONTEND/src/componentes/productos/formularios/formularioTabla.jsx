import React, { useState } from "react";
import { X } from "lucide-react";

export default function FormularioT({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    estado: "activo",
    duracion: "",
    imagen: null,
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImage = (e) => {
    setForm({ ...form, imagen: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="
        w-full max-w-lg rounded-2xl p-6 relative
        bg-white dark:bg-black
        border border-amber-500/30
        shadow-[0_0_25px_rgba(251,191,36,0.15)]
        transition-colors
      ">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-amber-400 tracking-wide">
            Nuevo Producto
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-amber-500 transition" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            className="
              w-full p-3 rounded-xl border
              bg-white dark:bg-[#0f0f0f]
              border-gray-200 dark:border-amber-500/20
              text-gray-800 dark:text-white
              focus:outline-none focus:ring-2 focus:ring-amber-500/40
            "
            required
          />

          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={handleChange}
            className="
              w-full p-3 rounded-xl border
              bg-white dark:bg-[#0f0f0f]
              border-gray-200 dark:border-amber-500/20
              text-gray-800 dark:text-white
              focus:outline-none focus:ring-2 focus:ring-amber-500/40
            "
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="precio"
              placeholder="Precio"
              value={form.precio}
              onChange={handleChange}
              className="
                p-3 rounded-xl border
                bg-white dark:bg-[#0f0f0f]
                border-gray-200 dark:border-amber-500/20
                text-gray-800 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-amber-500/40
              "
              required
            />

            <input
              type="text"
              name="stock"
              placeholder="stock"
              value={form.stock}
              onChange={handleChange}
              className="
                p-3 rounded-xl border
                bg-white dark:bg-[#0f0f0f]
                border-gray-200 dark:border-amber-500/20
                text-gray-800 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-amber-500/40
              "
            />
          </div>

          <input
            type="text"
            name="categoria"
            placeholder="Categoría"
            value={form.categoria}
            onChange={handleChange}
            className="
              w-full p-3 rounded-xl border
              bg-white dark:bg-[#0f0f0f]
              border-gray-200 dark:border-amber-500/20
              text-gray-800 dark:text-white
              focus:outline-none focus:ring-2 focus:ring-amber-500/40
            "
          />

          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            className="
              w-full p-3 rounded-xl border
              bg-white dark:bg-[#0f0f0f]
              border-gray-200 dark:border-amber-500/20
              text-gray-800 dark:text-white
              focus:outline-none focus:ring-2 focus:ring-amber-500/40
            "
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="text-sm text-gray-500 dark:text-gray-400"
          />

          <button
            type="submit"
            className="
              w-full p-3 rounded-xl font-semibold transition
              bg-amber-500 hover:bg-amber-600
              text-black
              shadow-md hover:shadow-amber-500/30
            "
          >
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}