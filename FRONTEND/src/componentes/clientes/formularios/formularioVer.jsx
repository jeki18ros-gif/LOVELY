import React from "react";
import { X, User, Phone, Mail, Calendar, BarChart3, Star, Clock } from "lucide-react";

export default function FormularioVer({ isOpen, onClose, cliente }) {
  // Datos simulados por defecto en caso de que no se pase un cliente
  const data = cliente || {
    nombre: "Alexander Pierce",
    numero: "+51 987 654 321",
    correo: "alex.pierce@email.com",
    tipo: "frecuente", // nuevo, frecuente, regular
    fechaRegistro: "12 de Marzo, 2024",
    seguimiento: "Interesado en tratamientos capilares",
    visitas: 14
  };

  if (!isOpen) return null;

  // Estilos para el badge de tipo
  const tipoStyles = {
    nuevo: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    frecuente: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    regular: "bg-green-500/10 text-green-500 border-green-500/20",
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header con Banner Sutil */}
        <div className="h-24 bg-gradient-to-r from-blue-600/20 to-purple-600/20 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition"
          >
            <X size={20} />
          </button>
          <div className="absolute -bottom-8 left-6">
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-zinc-900 border-4 border-white dark:border-[#0f0f0f] flex items-center justify-center shadow-lg">
              <User size={40} className="text-gray-400" />
            </div>
          </div>
        </div>

        <div className="pt-12 p-6 space-y-6">
          {/* Nombre y Tipo */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold dark:text-white">{data.nombre}</h2>
              <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm font-medium">
                <Calendar size={14} />
                Registrado el {data.fechaRegistro}
              </div>
            </div>
            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase border ${tipoStyles[data.tipo]}`}>
              Cliente {data.tipo}
            </span>
          </div>

          {/* Grid de Información de Contacto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800">
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Teléfono</p>
              <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <Phone size={16} className="text-blue-500" />
                <span className="text-sm">{data.numero || "No registrado"}</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800">
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Correo</p>
              <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <Mail size={16} className="text-blue-500" />
                <span className="text-sm truncate">{data.correo || "No registrado"}</span>
              </div>
            </div>
          </div>

          {/* Estadísticas Rápidas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <BarChart3 className="text-blue-500" size={24} />
              <div>
                <p className="text-xl font-bold dark:text-white">{data.visitas}</p>
                <p className="text-xs text-gray-500">Visitas Totales</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
              <Star className="text-amber-500" size={24} />
              <div>
                <p className="text-xl font-bold dark:text-white">Puntos</p>
                <p className="text-xs text-gray-500">Programa Lealtad</p>
              </div>
            </div>
          </div>

          {/* Seguimiento / Notas */}
          <div className="p-4 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 mb-2 text-gray-600 dark:text-gray-400">
              <Clock size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Último Seguimiento</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed italic">
              "{data.seguimiento}"
            </p>
          </div>

          {/* Footer del Modal */}
          <button 
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gray-100 dark:bg-zinc-800 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition mt-4"
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
  );
}