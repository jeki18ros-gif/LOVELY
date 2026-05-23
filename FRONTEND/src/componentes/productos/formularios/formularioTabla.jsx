import React, { useState, useEffect } from "react";
import { X, Save, Tag, DollarSign, Package, Layers, FileText, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function FormularioT({ isOpen, onClose, onSubmit, categorias = [] }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    stock: "",
    categoria_id: "",
    descripcion: "",
    estado: "activo",
    imagen: null
  });

  // Estado para el sistema de notificaciones flotantes (Toasts)
  const [notificacion, setNotificacion] = useState({ visible: false, mensaje: '', tipo: 'info' });

  // Auto-cerrar la notificación después de 4 segundos
  useEffect(() => {
    if (notificacion.visible) {
      const timer = setTimeout(() => {
        setNotificacion(prev => ({ ...prev, visible: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notificacion.visible]);

  if (!isOpen) return null;

  const mostrarToast = (mensaje, tipo = 'info') => {
    setNotificacion({ visible: true, mensaje, tipo });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación estricta que incluye la imagen obligatoria
    if (
      !form.nombre.trim() ||
      !form.descripcion.trim() ||
      !form.precio ||
      !form.categoria_id ||
      !form.stock ||
      !form.imagen
    ) {
      mostrarToast("Todos los campos son obligatorios, incluida la imagen", "warning");
      return;
    }

    try {
      setLoading(true);
      let imagenUrl = null;

      if (form.imagen) {
        const extension = form.imagen.name.split(".").pop();
        const fileName = `${Date.now()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("productos")
          .upload(`productos/${fileName}`, form.imagen);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("productos")
          .getPublicUrl(`productos/${fileName}`);

        imagenUrl = data.publicUrl;
      }

      onSubmit({
        ...form,
        stock: Math.floor(Number(form.stock)),
        precio: Number(form.precio),
        estado: form.estado === "activo",
        imagen_url: imagenUrl
      });

      mostrarToast("Producto registrado correctamente", "success");

      // Reset completo del estado del formulario
      setForm({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria_id: "",
        estado: "activo",
        stock: "",
        imagen: null
      });

      // Breve retraso para asegurar que se perciba la notificación de éxito antes del cierre
      setTimeout(() => {
        onClose();
      }, 600);

    } catch (error) {
      console.error(error);
      mostrarToast("Ocurrió un error al procesar el producto", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      
      {/* NOTIFICACIÓN FLOTANTE (TOAST) */}
      {notificacion.visible && (
        <div className={`fixed bottom-5 right-5 z-[60] flex items-center gap-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300 ${
          notificacion.tipo === 'success' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' :
          notificacion.tipo === 'warning' ? 'bg-yellow-600/10 border-yellow-600/30 text-yellow-600 dark:text-yellow-400' :
          'bg-red-500/10 border-red-500/30 text-red-500'
        }`}>
          {notificacion.tipo === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <p className="text-sm font-medium">{notificacion.mensaje}</p>
          <button 
            type="button"
            onClick={() => setNotificacion(prev => ({ ...prev, visible: false }))} 
            className="ml-2 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

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
          border-yellow-500/20
          bg-white
          dark:bg-[#0b0b0b]
          shadow-2xl
        "
      >
        {/* Barra decorativa superior de estilo Premium */}
        <div className="h-2 w-full shrink-0 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-yellow-500/10 px-6 py-5 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white">
              Nuevo Producto
            </h2>
            <p className="text-sm text-yellow-700 dark:text-yellow-500 mt-1">
              Registra un nuevo producto en el catálogo e inventario
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-xl hover:bg-yellow-500/10 transition disabled:opacity-50"
          >
            <X className="text-yellow-600 dark:text-yellow-400" />
          </button>
        </div>

        {/* Formulario con Scroll Interno Estilizado */}
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
          {/* Nombre */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Tag size={16} className="text-yellow-500" />
              Nombre del Producto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Ej: Kit de Cuidado Capilar Premium"
              className="w-full rounded-2xl border border-yellow-500/20 bg-white dark:bg-white/[0.03] p-4 text-black dark:text-white outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 disabled:opacity-50"
            />
          </div>

          {/* Imagen (Estrictamente obligatoria) */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <ImageIcon size={16} className="text-yellow-500" />
              Imagen del Producto <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="imagen"
              accept="image/*"
              key={form.imagen ? undefined : "clear-file"}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full rounded-2xl border border-yellow-500/20 bg-white dark:bg-[#121212] p-4 text-black dark:text-white file:mr-4 file:rounded-xl file:border-0 file:bg-yellow-500 file:px-4 file:py-2 file:text-black file:font-semibold hover:file:bg-yellow-400 transition text-sm disabled:opacity-50"
            />
          </div>

          {/* Precio y Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <DollarSign size={16} className="text-yellow-500" />
                Precio (S/) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                disabled={loading}
                placeholder="Ej: 89.90"
                className="w-full rounded-2xl border border-yellow-500/20 bg-white dark:bg-white/[0.03] p-4 text-black dark:text-white outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Package size={16} className="text-yellow-500" />
                Stock Disponible <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                required
                min="0"
                disabled={loading}
                placeholder="Ej: 24"
                className="w-full rounded-2xl border border-yellow-500/20 bg-white dark:bg-white/[0.03] p-4 text-black dark:text-white outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Categoría y Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Layers size={16} className="text-yellow-500" />
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                name="categoria_id"
                value={form.categoria_id}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full rounded-2xl border border-yellow-500/20 bg-white dark:bg-[#121212] p-4 text-black dark:text-white outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 disabled:opacity-50"
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-yellow-500" />
                Estado Inicial <span className="text-red-500">*</span>
              </label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full rounded-2xl border border-yellow-500/20 bg-white dark:bg-[#121212] p-4 text-black dark:text-white outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 disabled:opacity-50"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <FileText size={16} className="text-yellow-500" />
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Describe detalladamente las características del producto..."
              className="w-full resize-none rounded-2xl border border-yellow-500/20 bg-white dark:bg-white/[0.03] p-4 text-black dark:text-white outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 disabled:opacity-50"
            />
          </div>

          {/* Botón de Enviar con estados de Loading */}
          <button
            type="submit"
            disabled={loading}
            className="w-full shrink-0 rounded-2xl bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 p-4 font-bold text-black transition hover:scale-[1.01] hover:shadow-lg hover:shadow-yellow-500/20 flex items-center justify-center gap-2 disabled:from-yellow-800 disabled:to-yellow-900 disabled:text-gray-400 disabled:scale-100"
          >
            <Save size={18} />
            {loading ? "Guardando Producto..." : "Guardar Producto"}
          </button>
        </form>

        {/* Barra inferior decorativa */}
        <div className="h-2 w-full shrink-0 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700" />
      </div>
    </div>
  );
}