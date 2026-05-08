import React from "react";
import { X, User, Phone, Mail, Calendar, BarChart3, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function FormularioVer({ isOpen, onClose, cliente }) {
  const [detalleCliente, setDetalleCliente] = useState(null);
  const [seguimientos, setSeguimientos] = useState([]);
  const data = detalleCliente || cliente;

  useEffect(() => {
    if (cliente && isOpen) {
      obtenerDetalleCliente();
      obtenerSeguimiento();
    }
  }, [cliente, isOpen]);

  if (!isOpen || !data) return null;
const obtenerDetalleCliente = async () => {

  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', cliente.id)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  setDetalleCliente(data);
};

const obtenerSeguimiento = async () => {

  const { data, error } = await supabase
    .from('seguimiento')
    .select('*')
    .eq('id_cliente', cliente.id)
    .order('fecha', { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setSeguimientos(data || []);
};
  const tipoStyles = {
    Nuevo: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    Regular: "text-green-500 bg-green-500/10 border-green-500/20",
    Frecuente: "text-purple-500 bg-purple-500/10 border-purple-500/20",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border border-yellow-500/20 bg-white dark:bg-[#0b0b0b] shadow-2xl">
        <div className="h-2 w-full shrink-0 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700" />
        
        <div className="flex items-center justify-between border-b border-yellow-500/10 px-6 py-5 shrink-0">
          <h3 className="text-xl font-bold flex items-center gap-2 text-black dark:text-white">
            <User size={20} className="text-yellow-500" /> Perfil del Cliente
          </h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-yellow-500/10 transition text-yellow-600"><X /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-yellow-500/40">
          {/* Info Principal */}
          <div className="text-center space-y-2">
            <p className="text-2xl font-bold text-black dark:text-white">{data.nombre}</p>
            <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold border ${tipoStyles[data.frecuencia] || tipoStyles.Nuevo}`}>
              {data.frecuencia}
            </span>
          </div>

          {/* Grid de Datos */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-yellow-500/10">
              <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Visitas</p>
              <p className="text-xl font-bold text-yellow-600">{data.visitas}</p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-yellow-500/10">
              <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Registro</p>
              <p className="text-sm font-bold dark:text-white">
                {data.fecha_registro ? new Date(data.fecha_registro).toLocaleDateString() : '—'}
              </p>
            </div>
          </div>

          {/* Contacto */}
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-3 rounded-2xl border border-yellow-500/5 bg-gray-50 dark:bg-white/[0.02]">
              <Phone size={18} className="text-yellow-500" />
              <p className="text-sm dark:text-gray-300">{data.numero || data.telefono || '—'}</p>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-2xl border border-yellow-500/5 bg-gray-50 dark:bg-white/[0.02]">
              <Mail size={18} className="text-yellow-500" />
              <p className="text-sm dark:text-gray-300">{data.correo || '—'}</p>
            </div>
          </div>

          {/* Historial de Seguimiento */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-yellow-700 dark:text-yellow-500 flex items-center gap-2">
              <MessageSquare size={16} /> Historial de Seguimiento
            </h4>
            <div className="space-y-2">
              {seguimientos.length > 0 ? (
               seguimientos.map((s) => (
  <div
    key={s.id}
    className="p-3 rounded-xl bg-yellow-500/5 border-l-2 border-yellow-500"
  >

    <p className="text-sm dark:text-gray-300">
      {s.nota}
    </p>

    <p className="text-[11px] text-gray-500 mt-2">
      {new Date(s.fecha).toLocaleString()}
    </p>

  </div>
))
              ) : (
                <p className="text-xs text-gray-500 italic">No hay registros de seguimiento.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}