import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Tag,
  DollarSign,
  Boxes,
  Layers,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function FormularioEditar({
  isOpen,
  onClose,
  onSubmit,
  product,
  categorias = []
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    costo: "",
    stock: "",
    categoria_id: "",
    descripcion: "",
  });
  const [imagenFile, setImagenFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Estado para el sistema de notificaciones flotantes (Toasts)
  const [notificacion, setNotificacion] = useState({ visible: false, mensaje: '', tipo: 'info' });

  useEffect(() => {
    if (product) {
      setForm({
        nombre: product.nombre || "",
        precio: product.precio || "",
        costo: product.costo || "",
        stock: product.stock || "",
        categoria_id: product.categoria_id || "",
        descripcion: product.descripcion || "",
      });
      setPreviewUrl(product.imagen_url || "");
      setImagenFile(null);
    }
  }, [product, isOpen]);

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
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de seguridad por código
    if (
      !form.nombre.trim() ||
      !form.precio ||
      !form.costo ||
      !form.stock ||
      !form.categoria_id ||
      !form.descripcion.trim()
    ) {
      mostrarToast("Todos los campos básicos son obligatorios", "warning");
      return;
    }

    // Si no hay imagen previa en el producto ni tampoco un archivo nuevo cargado
    if (!product?.imagen_url && !imagenFile) {
      mostrarToast("El producto debe contar con una imagen descriptiva", "warning");
      return;
    }

    try {
      setLoading(true);
      let finalImagenUrl = product?.imagen_url;

      if (imagenFile) {
        const extension = imagenFile.name.split(".").pop();
        const fileName = `${Date.now()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("productos")
          .upload(`productos/${fileName}`, imagenFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("productos")
          .getPublicUrl(`productos/${fileName}`);

        finalImagenUrl = data.publicUrl;
      }

      await onSubmit({
        ...form,
        precio: Number(form.precio),
        costo: Number(form.costo),
        stock: Math.floor(Number(form.stock)),
        imagen_url: finalImagenUrl
      });

      mostrarToast("Producto actualizado correctamente", "success");

      // Delay para notar el éxito del proceso antes de cerrar el modal
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (error) {
      console.error(error);
      mostrarToast("Error actualizando el producto", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
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

      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border border-amber-500/20 bg-white dark:bg-[#0b0b0b] shadow-2xl">
        
        <div className="h-2 w-full shrink-0 bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700" />

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-amber-500/10 px-6 py-5 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white">
              Editar Producto
            </h2>
            <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
              Modifica la información del producto
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-xl hover:bg-amber-500/10 transition disabled:opacity-50"
          >
            <X className="text-amber-600 dark:text-amber-400" />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-amber-500/40 scrollbar-track-transparent"
        >
          {/* NOMBRE */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Tag size={16} className="text-amber-500" />
              Nombre del Producto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              disabled={loading}
              required
              placeholder="Ej: Shampoo Premium"
              className="w-full rounded-2xl border border-amber-500/20 bg-white dark:bg-white/[0.03] p-4 text-black dark:text-white outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition disabled:opacity-50"
            />
          </div>

          {/* COSTO + PRECIO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <DollarSign size={16} className="text-amber-500" />
                Costo <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="costo"
                step="0.01"
                min="0"
                value={form.costo}
                onChange={handleChange}
                disabled={loading}
                required
                className="w-full rounded-2xl border border-amber-500/20 bg-white dark:bg-white/[0.03] p-4 text-black dark:text-white outline-none focus:border-amber-500 transition disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <DollarSign size={16} className="text-amber-500" />
                Precio <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="precio"
                step="0.01"
                min="0"
                value={form.precio}
                onChange={handleChange}
                disabled={loading}
                required
                className="w-full rounded-2xl border border-amber-500/20 bg-white dark:bg-white/[0.03] p-4 text-black dark:text-white outline-none focus:border-amber-500 transition disabled:opacity-50"
              />
            </div>
          </div>

          {/* GANANCIA CALCULADA */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <DollarSign size={16} className="text-green-500" />
              Ganancia
            </label>
            <input
              type="text"
              value={
                form.precio && form.costo
                  ? `S/ ${(Number(form.precio) - Number(form.costo)).toFixed(2)}`
                  : "S/ 0.00"
              }
              disabled
              className="w-full rounded-2xl border border-green-500/20 bg-green-50 dark:bg-green-500/5 p-4 text-green-700 dark:text-green-400 font-bold outline-none"
            />
          </div>

          {/* STOCK */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Boxes size={16} className="text-amber-500" />
              Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="stock"
              min="0"
              value={form.stock}
              onChange={handleChange}
              disabled={loading}
              required
              className="w-full rounded-2xl border border-amber-500/20 bg-white dark:bg-white/[0.03] p-4 text-black dark:text-white outline-none focus:border-amber-500 transition disabled:opacity-50"
            />
          </div>

          {/* IMAGEN */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <ImageIcon size={16} className="text-amber-500" />
              Imagen del Producto {!product?.imagen_url && <span className="text-red-500">*</span>}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImagenChange}
              disabled={loading}
              required={!product?.imagen_url} // Solo requerido de forma nativa si no existía previa imagen
              className="w-full rounded-2xl border border-amber-500/20 bg-white dark:bg-[#121212] p-4 text-black dark:text-white file:mr-4 file:rounded-xl file:border-0 file:bg-amber-500 file:px-4 file:py-2 file:text-black file:font-semibold hover:file:bg-amber-400 text-sm disabled:opacity-50"
            />
            {previewUrl && (
              <div className="mt-4">
                <p className="text-xs text-gray-400 mb-2">Vista previa de la imagen:</p>
                <img
                  src={previewUrl}
                  alt="Vista previa del producto"
                  className="h-40 w-full object-cover rounded-2xl border border-amber-500/20"
                />
              </div>
            )}
          </div>

          {/* CATEGORÍA */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Layers size={16} className="text-amber-500" />
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              name="categoria_id"
              value={form.categoria_id}
              onChange={handleChange}
              disabled={loading}
              required
              className="w-full rounded-2xl border border-amber-500/20 bg-white dark:bg-[#121212] p-4 text-black dark:text-white outline-none focus:border-amber-500 transition disabled:opacity-50"
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <FileText size={16} className="text-amber-500" />
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              disabled={loading}
              required
              className="w-full resize-none rounded-2xl border border-amber-500/20 bg-white dark:bg-white/[0.03] p-4 text-black dark:text-white outline-none focus:border-amber-500 transition disabled:opacity-50"
            />
          </div>

          {/* BOTÓN GUARDAR */}
          <button
            type="submit"
            disabled={loading}
            className="w-full shrink-0 rounded-2xl bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 p-4 font-bold text-black transition disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.01]"
          >
            <Save size={18} />
            {loading ? "Actualizando..." : "Actualizar Producto"}
          </button>
        </form>

        <div className="h-2 w-full shrink-0 bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700" />
      </div>
    </div>
  );
}