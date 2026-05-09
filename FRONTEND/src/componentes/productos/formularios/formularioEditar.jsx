import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Tag,
  DollarSign,
  Boxes,
  Layers,
  FileText,
  ImageIcon,
} from "lucide-react";

export default function FormularioEditar({
  isOpen,
  onClose,
  onSubmit,
  product,
  categorias = []
}) {

  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    stock: "",
    categoria_id: "",
    descripcion: "",
    imagen: null
  });

  const [imagenFile, setImagenFile] = useState(null);

  /* =========================
     CARGAR PRODUCTO
  ========================= */

  useEffect(() => {

    if (product) {

      setForm({
        nombre: product.nombre || "",
        precio: product.precio || "",
        stock: product.stock || "",
        categoria_id: product.categoria_id || "",
        descripcion: product.descripcion || "",
      });
    }

  }, [product]);


  if (!isOpen) return null;
  const handleChange = (e) => {
    const {
      name,
      value
    } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  /* =========================
     HANDLE IMAGEN
  ========================= */

  const handleImagenChange = (e) => {

    const file = e.target.files[0];

    if (file) {
      setImagenFile(file);
    }
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = (e) => {

    e.preventDefault();

    if (
      !form.nombre ||
      !form.precio ||
      !form.stock ||
      !form.categoria_id ||
      !form.descripcion
    ) {
      alert("Todos los campos son obligatorios");
      return;
    }

    /* IMAGEN OBLIGATORIA */
    if (!imagenFile && !product?.imagen_url) {
      alert("La imagen del producto es obligatoria");
      return;
    }

    onSubmit({
      ...form,
      imagen: imagenFile
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">

      <div
        className="
          relative
          w-full
          max-w-2xl
          max-h-[90vh]
          flex flex-col
          overflow-hidden
          rounded-3xl
          border
          border-cyan-500/20
          bg-white
          dark:bg-[#0b0b0b]
          shadow-2xl
        "
      >

        {/* BARRA SUPERIOR */}
        <div className="h-2 w-full shrink-0 bg-gradient-to-r from-cyan-700 via-cyan-400 to-cyan-700" />

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-cyan-500/10 px-6 py-5 shrink-0">

          <div>

            <h2 className="text-2xl font-bold text-black dark:text-white">
              Editar Producto
            </h2>

            <p className="text-sm text-cyan-700 dark:text-cyan-500 mt-1">
              Modifica la información del producto
            </p>

          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-cyan-500/10 transition"
          >
            <X className="text-cyan-600 dark:text-cyan-400" />
          </button>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="
            flex-1
            overflow-y-auto
            p-6
            space-y-5
            scrollbar-thin
            scrollbar-thumb-cyan-500/40
            scrollbar-track-transparent
          "
        >

          {/* NOMBRE */}
          <div>

            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">

              <Tag
                size={16}
                className="text-cyan-500"
              />

              Nombre del Producto

            </label>

            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Shampoo Premium"
              className="
                w-full rounded-2xl border
                border-cyan-500/20
                bg-white dark:bg-white/[0.03]
                p-4
                text-black dark:text-white
                outline-none
                transition
                focus:border-cyan-500
                focus:ring-4
                focus:ring-cyan-500/10
              "
            />

          </div>

          {/* PRECIO + STOCK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* PRECIO */}
            <div>

              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">

                <DollarSign
                  size={16}
                  className="text-cyan-500"
                />

                Precio

              </label>

              <input
                type="number"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                placeholder="Ej: 35"
                className="
                  w-full rounded-2xl border
                  border-cyan-500/20
                  bg-white dark:bg-white/[0.03]
                  p-4
                  text-black dark:text-white
                  outline-none
                  transition
                  focus:border-cyan-500
                  focus:ring-4
                  focus:ring-cyan-500/10
                "
              />

            </div>

            {/* STOCK */}
            <div>

              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">

                <Boxes
                  size={16}
                  className="text-cyan-500"
                />

                Stock

              </label>

              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Ej: 50"
                className="
                  w-full rounded-2xl border
                  border-cyan-500/20
                  bg-white dark:bg-white/[0.03]
                  p-4
                  text-black dark:text-white
                  outline-none
                  transition
                  focus:border-cyan-500
                  focus:ring-4
                  focus:ring-cyan-500/10
                "
              />

            </div>

          </div>

          {/* IMAGEN */}
          <div>

            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">

              <ImageIcon
                size={16}
                className="text-cyan-500"
              />

              Imagen del Producto *

            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImagenChange}
              className="
                w-full rounded-2xl
                border border-cyan-500/20
                bg-white dark:bg-[#121212]
                p-4
                text-black dark:text-white
                file:mr-4
                file:rounded-xl
                file:border-0
                file:bg-cyan-500
                file:px-4
                file:py-2
                file:text-black
                file:font-semibold
                hover:file:bg-cyan-400
              "
            />

            {product?.imagen_url && (

              <img
                src={product.imagen_url}
                alt="Producto"
                className="
                  mt-4
                  h-40
                  w-full
                  object-cover
                  rounded-2xl
                  border border-cyan-500/20
                "
              />

            )}

          </div>

          {/* CATEGORÍA */}
          <div>

            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">

              <Layers
                size={16}
                className="text-cyan-500"
              />

              Categoría

            </label>

            <select
              name="categoria_id"
              value={form.categoria_id}
              onChange={handleChange}
              className="
                w-full rounded-2xl border
                border-cyan-500/20
                bg-white dark:bg-[#121212]
                p-4
                text-black dark:text-white
                outline-none
                transition
                focus:border-cyan-500
                focus:ring-4
                focus:ring-cyan-500/10
              "
            >

              <option value="">
                Seleccionar categoría
              </option>

              {categorias.map((cat) => (

                <option
                  key={cat.id}
                  value={cat.id}
                >
                  {cat.nombre}
                </option>

              ))}

            </select>

          </div>

          {/* DESCRIPCIÓN */}
          <div>

            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">

              <FileText
                size={16}
                className="text-cyan-500"
              />

              Descripción

            </label>

            <textarea
              rows={4}
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Describe el producto..."
              className="
                w-full resize-none rounded-2xl border
                border-cyan-500/20
                bg-white dark:bg-white/[0.03]
                p-4
                text-black dark:text-white
                outline-none
                transition
                focus:border-cyan-500
                focus:ring-4
                focus:ring-cyan-500/10
              "
            />

          </div>

          {/* BOTÓN */}
          <button
            type="submit"
            className="
              w-full shrink-0 rounded-2xl
              bg-gradient-to-r
              from-cyan-700
              via-cyan-500
              to-cyan-700
              p-4
              font-bold
              text-black
              transition
              hover:scale-[1.01]
              hover:shadow-lg
              hover:shadow-cyan-500/20
              flex items-center justify-center gap-2
            "
          >

            <Save size={18} />

            Actualizar Producto

          </button>

        </form>

        {/* BARRA INFERIOR */}
        <div className="h-2 w-full shrink-0 bg-gradient-to-r from-cyan-700 via-cyan-400 to-cyan-700" />

      </div>
    </div>
  );
}