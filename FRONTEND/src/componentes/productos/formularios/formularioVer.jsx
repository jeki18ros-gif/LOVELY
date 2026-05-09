import React from "react";
import {
  X,
  Calendar,
  Tag,
  DollarSign,
  FileText,
  Hash,
  Boxes,
  ImageOff,
} from "lucide-react";

export default function FormularioVer({
  isOpen,
  onClose,
  product
}) {

  if (!isOpen || !product) return null;

  const fechaFormateada = new Date(
    product.fecha_registro
  ).toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">

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
          border-cyan-500/30
          bg-white
          dark:bg-[#0b0b0b]
          shadow-2xl
        "
      >

        {/* DECORACIÓN */}
        <div className="h-2 w-full shrink-0 bg-gradient-to-r from-cyan-700 via-cyan-400 to-cyan-700" />

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-cyan-500/10 shrink-0">

          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white">
              Detalles del Producto
            </h2>

            <p className="text-sm text-cyan-700 dark:text-cyan-500 mt-1">
              Información completa del producto registrado
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-cyan-500/10 transition"
          >
            <X className="text-cyan-600 dark:text-cyan-500" />
          </button>

        </div>

        {/* CONTENIDO */}
        <div
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

          {/* IMAGEN OBLIGATORIA */}
          {product.imagen_url ? (

            <img
              src={product.imagen_url}
              alt={product.nombre}
              className="w-full h-64 object-cover rounded-2xl border border-cyan-500/20"
            />

          ) : (

            <div className="w-full h-64 rounded-2xl border border-dashed border-cyan-500/30 flex flex-col items-center justify-center bg-cyan-500/5">

              <ImageOff
                size={42}
                className="text-cyan-500 mb-3"
              />

              <p className="text-sm text-cyan-600 dark:text-cyan-400 font-medium">
                Este producto no tiene imagen
              </p>

            </div>

          )}

          {/* NOMBRE */}
          <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-500/5 dark:to-white/[0.02] p-5">

            <div className="flex items-start gap-4">

              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                <Tag
                  className="text-cyan-600 dark:text-cyan-400"
                  size={24}
                />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-cyan-700 dark:text-cyan-500 font-bold">
                  Nombre del Producto
                </p>

                <h3 className="text-2xl font-bold text-black dark:text-white mt-1">
                  {product.nombre}
                </h3>
              </div>

            </div>
          </div>

          {/* PRECIO Y STOCK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* PRECIO */}
            <div className="rounded-2xl p-5 border border-cyan-500/20 bg-white dark:bg-white/[0.03] shadow-sm">

              <div className="flex items-center gap-3 mb-3">

                <div className="p-2 rounded-xl bg-cyan-500/10">
                  <DollarSign
                    className="text-cyan-600 dark:text-cyan-400"
                    size={20}
                  />
                </div>

                <p className="text-xs uppercase font-bold tracking-wider text-gray-500">
                  Precio
                </p>

              </div>

              <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                s/ {product.precio}
              </p>

            </div>

            {/* STOCK */}
            <div className="rounded-2xl p-5 border border-cyan-500/20 bg-white dark:bg-white/[0.03] shadow-sm">

              <div className="flex items-center gap-3 mb-3">

                <div className="p-2 rounded-xl bg-cyan-500/10">
                  <Boxes
                    className="text-cyan-600 dark:text-cyan-400"
                    size={20}
                  />
                </div>

                <p className="text-xs uppercase font-bold tracking-wider text-gray-500">
                  Stock
                </p>

              </div>

              <p className="text-2xl font-semibold text-black dark:text-white">
                {product.stock} unidades
              </p>

            </div>

          </div>

          {/* DESCRIPCIÓN */}
          <div className="rounded-2xl border border-cyan-500/20 bg-white dark:bg-white/[0.03] p-5">

            <div className="flex items-center gap-3 mb-4">

              <div className="p-2 rounded-xl bg-cyan-500/10">
                <FileText
                  className="text-cyan-600 dark:text-cyan-400"
                  size={20}
                />
              </div>

              <p className="text-xs uppercase font-bold tracking-wider text-gray-500">
                Descripción
              </p>

            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {product.descripcion ||
                "Este producto no tiene descripción registrada."}
            </p>

          </div>

          {/* INFORMACIÓN EXTRA */}
          <div className="rounded-2xl border border-dashed border-cyan-500/20 p-5 bg-cyan-50/40 dark:bg-cyan-500/[0.03] mb-2">

            <h4 className="text-sm font-bold text-cyan-700 dark:text-cyan-500 mb-4">
              Información Adicional
            </h4>

            <div className="space-y-4">

              {/* FECHA */}
              <div className="flex items-center justify-between text-sm">

                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar size={16} />
                  <span>Fecha de Registro</span>
                </div>

                <span className="font-medium text-black dark:text-gray-300">
                  {fechaFormateada}
                </span>

              </div>

              {/* ID */}
              <div className="flex items-center justify-between text-sm">

                <div className="flex items-center gap-2 text-gray-500">
                  <Hash size={16} />
                  <span>ID del Sistema</span>
                </div>

                <span className="font-medium text-black dark:text-gray-300">
                  #PROD-{product.id.slice(0, 8)}
                </span>

              </div>

            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="h-1 w-full shrink-0 bg-gradient-to-r from-cyan-700 via-cyan-400 to-cyan-700" />

      </div>
    </div>
  );
}