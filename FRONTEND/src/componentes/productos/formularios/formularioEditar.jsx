import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

export default function FormularioEditar({ isOpen, onClose, onSubmit, producto }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
  });

  useEffect(() => {
    if (producto && isOpen) {
      setForm({
        name: producto.name || "",
        price: producto.price || "",
        stock: producto.stock || "",
        category: producto.category || "",
      });
    }
  }, [producto, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl p-6 bg-white dark:bg-black border border-amber-500/30">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-amber-400">Editar Producto</h2>
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
              className="p-3 rounded-xl bg-transparent border border-zinc-800 text-white outline-none focus:ring-2 focus:ring-amber-500/40"
            />
            <input
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="Stock"
              className="p-3 rounded-xl bg-transparent border border-zinc-800 text-white outline-none focus:ring-2 focus:ring-amber-500/40"
            />
          </div>
          
          <button type="submit" className="w-full p-3 bg-amber-500 text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-amber-600 transition">
            <Save size={18} /> Actualizar Producto
          </button>
        </form>
      </div>
    </div>
  );
}