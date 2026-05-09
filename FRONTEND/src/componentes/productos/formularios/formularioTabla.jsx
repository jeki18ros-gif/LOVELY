import React, { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function FormularioT({
  isOpen,
  onClose,
  onSubmit,
  categorias = []
}) {

  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    stock: "",
    categoria_id: "",
    descripcion: "",
    estado: "activo",
    imagen: null
  });

  if (!isOpen) return null;

  /* =========================
     HANDLE CHANGE
  ========================= */

  const handleChange = (e) => {

    const {
      name,
      value,
      files
    } = e.target;

    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    /* VALIDACIÓN */
    if (
      !form.nombre ||
      !form.descripcion ||
      !form.precio ||
      !form.categoria_id ||
      !form.estado ||
      !form.stock ||
      !form.imagen
    ) {
      alert("Todos los campos son obligatorios, incluida la imagen");
      return;
    }

    let imagenUrl = null;

    /* SUBIR IMAGEN */
    if (form.imagen) {

      const extension =
        form.imagen.name.split('.').pop();

      const fileName =
        `${Date.now()}.${extension}`;

      const { error: uploadError } =
        await supabase.storage
          .from('productos')
          .upload(
            `productos/${fileName}`,
            form.imagen
          );

      if (uploadError) {
        console.error(uploadError);
        alert("Error subiendo imagen");
        return;
      }

      /* OBTENER URL */
      const { data } = supabase.storage
        .from('productos')
        .getPublicUrl(
          `productos/${fileName}`
        );

      imagenUrl = data.publicUrl;
    }

    /* ENVIAR */
    onSubmit({
      ...form,
      stock: Number(form.stock),
      precio: Number(form.precio),
      estado: form.estado === "activo",
      imagen_url: imagenUrl
    });

    /* RESET */
    setForm({
      nombre: "",
      descripcion: "",
      precio: "",
      categoria_id: "",
      estado: "activo",
      stock: "",
      imagen: null
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">

      <div
        className="
          w-full max-w-lg rounded-2xl p-6 relative
          bg-white dark:bg-black
          border border-cyan-500/30
          shadow-[0_0_25px_rgba(34,211,238,0.15)]
        "
      >

        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">

          <h2 className="text-xl font-semibold text-gray-800 dark:text-cyan-400">
            Nuevo Producto
          </h2>

          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-cyan-500 transition" />
          </button>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* NOMBRE */}
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del producto"
            value={form.nombre}
            onChange={handleChange}
            required
            className="
              w-full p-3 rounded-xl border
              bg-white dark:bg-[#0f0f0f]
              border-gray-200 dark:border-cyan-500/20
              text-gray-800 dark:text-white
            "
          />

          {/* IMAGEN */}
          <div>

            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
              Imagen del Producto *
            </label>

            <input
              type="file"
              name="imagen"
              accept="image/*"
              onChange={handleChange}
              required
              className="
                w-full rounded-2xl
                border border-cyan-500/20
                bg-white dark:bg-[#121212]
                p-3
                text-black dark:text-white
              "
            />

          </div>

          {/* DESCRIPCIÓN */}
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={handleChange}
            required
            rows={3}
            className="
              w-full p-3 rounded-xl border
              bg-white dark:bg-[#0f0f0f]
              border-gray-200 dark:border-cyan-500/20
              text-gray-800 dark:text-white
            "
          />

          {/* PRECIO + STOCK */}
          <div className="grid grid-cols-2 gap-4">

            <input
              type="number"
              name="precio"
              placeholder="Precio"
              value={form.precio}
              onChange={handleChange}
              required
              className="
                p-3 rounded-xl border
                bg-white dark:bg-[#0f0f0f]
                border-gray-200 dark:border-cyan-500/20
                text-gray-800 dark:text-white
              "
            />

            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
              required
              className="
                p-3 rounded-xl border
                bg-white dark:bg-[#0f0f0f]
                border-gray-200 dark:border-cyan-500/20
                text-gray-800 dark:text-white
              "
            />

          </div>

          {/* CATEGORÍAS */}
          <select
            name="categoria_id"
            value={form.categoria_id}
            onChange={handleChange}
            required
            className="
              w-full p-3 rounded-xl border
              bg-white dark:bg-[#0f0f0f]
              border-gray-200 dark:border-cyan-500/20
              text-gray-800 dark:text-white
            "
          >

            <option value="">
              Seleccionar categoría
            </option>

            {categorias.map(cat => (

              <option
                key={cat.id}
                value={cat.id}
              >
                {cat.nombre}
              </option>

            ))}

          </select>

          {/* ESTADO */}
          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            required
            className="
              w-full p-3 rounded-xl border
              bg-white dark:bg-[#0f0f0f]
              border-gray-200 dark:border-cyan-500/20
              text-gray-800 dark:text-white
            "
          >

            <option value="activo">
              Activo
            </option>

            <option value="inactivo">
              Inactivo
            </option>

          </select>

          {/* BOTÓN */}
          <button
            type="submit"
            className="
              w-full p-3 rounded-xl font-semibold transition
              bg-cyan-500 hover:bg-cyan-600
              text-black
            "
          >
            Guardar Producto
          </button>

        </form>
      </div>
    </div>
  );
}