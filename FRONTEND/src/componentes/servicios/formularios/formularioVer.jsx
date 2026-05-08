import React from "react";
import {
  X,
  Calendar,
  Tag,
  Clock,
  DollarSign,
  FileText,
  Hash,
} from "lucide-react";

export default function FormularioVer({ isOpen, onClose, service }) {
  if (!isOpen || !service) return null;

  const fechaFormateada = new Date(service.fecha_registro).toLocaleString('es-PE', {
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
          /* Cambio clave: altura máxima dinámica y flex-col */
          max-h-[90vh] 
          flex flex-col
          overflow-hidden
          rounded-3xl
          border
          border-yellow-500/30
          bg-white
          dark:bg-[#0b0b0b]
          shadow-2xl
        "
      >
        {/* Decoración superior */}
        <div className="h-2 w-full shrink-0 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700" />

        {/* Header - shrink-0 evita que el header se aplaste */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-yellow-500/10 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white">
              Detalles del Servicio
            </h2>
            <p className="text-sm text-yellow-700 dark:text-yellow-500 mt-1">
              Información completa del servicio registrado
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-yellow-500/10 transition"
          >
            <X className="text-yellow-600 dark:text-yellow-500" />
          </button>
        </div>

        {/* Contenido - flex-1 toma el espacio restante y activa el scroll */}
        <div
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
          {service.imagen_url && (
            <img
              src={service.imagen_url}
              alt={service.nombre}
              className="w-full h-64 object-cover rounded-2xl border border-yellow-500/20"
            />
          )}

          {/* Nombre */}
          <div className="rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-500/5 dark:to-white/[0.02] p-5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                <Tag className="text-yellow-600 dark:text-yellow-400" size={24} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-yellow-700 dark:text-yellow-500 font-bold">
                  Nombre del Servicio
                </p>
                <h3 className="text-2xl font-bold text-black dark:text-white mt-1">
                  {service.nombre}
                </h3>
              </div>
            </div>
          </div>

          {/* Precio y duración */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl p-5 border border-yellow-500/20 bg-white dark:bg-white/[0.03] shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-yellow-500/10">
                  <DollarSign className="text-yellow-600 dark:text-yellow-400" size={20} />
                </div>
                <p className="text-xs uppercase font-bold tracking-wider text-gray-500">Precio</p>
              </div>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                s/ {service.precio}
              </p>
            </div>

            <div className="rounded-2xl p-5 border border-yellow-500/20 bg-white dark:bg-white/[0.03] shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-yellow-500/10">
                  <Clock className="text-yellow-600 dark:text-yellow-400" size={20} />
                </div>
                <p className="text-xs uppercase font-bold tracking-wider text-gray-500">Duración</p>
              </div>
              <p className="text-2xl font-semibold text-black dark:text-white">
                {service.duracion} min
              </p>
            </div>
          </div>

          {/* Descripción */}
          <div className="rounded-2xl border border-yellow-500/20 bg-white dark:bg-white/[0.03] p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-yellow-500/10">
                <FileText className="text-yellow-600 dark:text-yellow-400" size={20} />
              </div>
              <p className="text-xs uppercase font-bold tracking-wider text-gray-500">Descripción</p>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {service.descripcion || "Este servicio no tiene descripción registrada."}
            </p>
          </div>

          {/* Información extra */}
          <div className="rounded-2xl border border-dashed border-yellow-500/20 p-5 bg-yellow-50/40 dark:bg-yellow-500/[0.03] mb-2">
            <h4 className="text-sm font-bold text-yellow-700 dark:text-yellow-500 mb-4">
              Información Adicional
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar size={16} />
                  <span>Fecha de Registro</span>
                </div>
                <span className="font-medium text-black dark:text-gray-300">{fechaFormateada}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Hash size={16} />
                  <span>ID del Sistema</span>
                </div>
                <span className="font-medium text-black dark:text-gray-300">
                  #SERV-{service.id.slice(0, 8)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer decorativo - shrink-0 para mantener su altura fija */}
        <div className="h-1 w-full shrink-0 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700" />
      </div>
    </div>
  );
}