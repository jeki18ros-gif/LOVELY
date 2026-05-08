import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Tag,
  DollarSign,
  Clock,
  Layers,
  FileText,
} from "lucide-react";

export default function FormularioEditar({
  isOpen,
  onClose,
  onSubmit,
  service,
  categorias = []
}) {
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    duracion: "",
    categoria_id: "",
    descripcion: "",
    imagen: null
  });

  const [imagenFile, setImagenFile] = useState(null);

  // Cargar datos del servicio
  useEffect(() => {
    if (service) {
      setForm({
        nombre: service.nombre || "",
        precio: service.precio || "",
        duracion: service.duracion || "",
        categoria_id: service.categoria_id || "",
        descripcion: service.descripcion || "",
      });
    }
  }, [service]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenFile(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div
        className="
          relative
          w-full
          max-w-2xl
          /* CLAVE: Altura máxima y flexbox vertical */
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
        {/* Barra decorativa superior - shrink-0 fija su altura */}
        <div className="h-2 w-full shrink-0 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700" />

        {/* Header - shrink-0 fija su altura */}
        <div className="flex items-center justify-between border-b border-yellow-500/10 px-6 py-5 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white">
              Editar Servicio
            </h2>
            <p className="text-sm text-yellow-700 dark:text-yellow-500 mt-1">
              Modifica la información del servicio
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-yellow-500/10 transition"
          >
            <X className="text-yellow-600 dark:text-yellow-400" />
          </button>
        </div>

        {/* Formulario con scroll interno - flex-1 ocupa el resto del espacio */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              ...form,
              imagen: imagenFile
            });
          }}
          className="
            flex-1
            overflow-y-auto
            p-6
            space-y-5

            /* Estilos de scrollbar */
            scrollbar-thin
            scrollbar-thumb-yellow-500/40
            scrollbar-track-transparent
          "
        >
          {/* Nombre */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Tag size={16} className="text-yellow-500" />
              Nombre del Servicio
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Cambio de aceite premium"
              className="w-full rounded-2xl border border-yellow-500/20 bg-white dark:bg-white/[0.03] p-4 text-black dark:text-white outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10"
            />
          </div>

          {/* Precio y duración */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <DollarSign size={16} className="text-yellow-500" />
                Precio
              </label>
              <input
                type="text"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                placeholder="Ej: 150"
                className="w-full rounded-2xl border border-yellow-500/20 bg-white dark:bg-white/[0.03] p-4 text-black dark:text-white outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Clock size={16} className="text-yellow-500" />
                Duración
              </label>
              <select
                name="duracion"
                value={form.duracion}
                onChange={handleChange}
                className="w-full rounded-2xl border border-yellow-500/20 bg-white dark:bg-[#121212] p-4 text-black dark:text-white outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10"
              >
                <option value="">Seleccionar duración</option>
                <option value="30">30 minutos</option>
                <option value="60">1 hora</option>
                <option value="90">1 hora 30 min</option>
                <option value="120">2 horas</option>
                <option value="150">2 horas 30 min</option>
              </select>
            </div>
          </div>

          {/* Imagen */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Imagen del Servicio
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImagenChange}
              className="w-full rounded-2xl border border-yellow-500/20 bg-white dark:bg-[#121212] p-4 text-black dark:text-white file:mr-4 file:rounded-xl file:border-0 file:bg-yellow-500 file:px-4 file:py-2 file:text-black file:font-semibold hover:file:bg-yellow-400"
            />
            {service?.imagen_url && (
              <img
                src={service.imagen_url}
                alt="Servicio"
                className="mt-4 h-40 w-full object-cover rounded-2xl border border-yellow-500/20"
              />
            )}
          </div>

          {/* Categoría */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Layers size={16} className="text-yellow-500" />
              Categoría
            </label>
            <select
              name="categoria_id"
              value={form.categoria_id}
              onChange={handleChange}
              className="w-full rounded-2xl border border-yellow-500/20 bg-white dark:bg-[#121212] p-4 text-black dark:text-white outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10"
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <FileText size={16} className="text-yellow-500" />
              Descripción
            </label>
            <textarea
              rows={4}
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Describe el servicio..."
              className="w-full resize-none rounded-2xl border border-yellow-500/20 bg-white dark:bg-white/[0.03] p-4 text-black dark:text-white outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10"
            />
          </div>

          {/* Botón de envío - shrink-0 evita que se aplaste */}
          <button
            type="submit"
            className="w-full shrink-0 rounded-2xl bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 p-4 font-bold text-black transition hover:scale-[1.01] hover:shadow-lg hover:shadow-yellow-500/20 flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Actualizar Servicio
          </button>
        </form>

        {/* Barra inferior decorativa - shrink-0 fija su altura */}
        <div className="h-2 w-full shrink-0 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700" />
      </div>
    </div>
  );
}