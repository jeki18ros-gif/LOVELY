import React, { useState, useEffect } from 'react';
import { 
  Pencil, Trash2, Clock, User, Scissors, 
  X, CheckCircle2, AlignLeft, Calendar, DollarSign, Save, RotateCcw
} from 'lucide-react';

const DetalleCita = ({ isOpen, onClose, cita, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  // Sincronizar los datos cuando cambia la cita seleccionada
  useEffect(() => {
    if (cita) {
      setEditData(cita);
      setIsEditing(false); // Resetear a modo lectura al cambiar de cita
    }
  }, [cita]);

  if (!cita) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const statusColors = {
    Realizado: 'bg-green-500/20 text-green-600 dark:text-green-400',
    Cancelada: 'bg-red-500/20 text-red-600 dark:text-red-400',
    Pendiente: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
    Confirmada: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
  };

  return (
    <>
      {/* Overlay */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300
        ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      />

      {/* PANEL */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-[420px] z-50
        bg-white border-l border-gray-200 shadow-2xl dark:bg-[#111111] dark:border-zinc-800
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>

        {/* HEADER */}
        <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/50">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              {isEditing ? 'Editando Cita' : 'Detalle de Cita'}
            </h3>
            <p className="text-xs text-gray-500">ID de cita: #{cita.id || 'N/A'}</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full transition"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="p-6 space-y-6 h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar text-sm">
          
          {/* CLIENTE */}
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><User size={20}/></div>
            <div className="flex-1">
              <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">Cliente</p>
              {isEditing ? (
                <input 
                  name="title" // Usamos title para coincidir con tu objeto de agenda
                  value={editData.title}
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-2 rounded-md"
                />
              ) : (
                <p className="font-semibold text-gray-900 dark:text-white text-base">{cita.title}</p>
              )}
            </div>
          </div>

          {/* SERVICIO Y DURACIÓN */}
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><Scissors size={20}/></div>
            <div className="flex-1 grid grid-cols-2 gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">Servicio</p>
                {isEditing ? (
                  <input name="service" value={editData.service} onChange={handleChange} className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-2 rounded-md" />
                ) : (
                  <p className="text-gray-800 dark:text-gray-200 font-medium">{cita.service}</p>
                )}
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">Duración</p>
                {isEditing ? (
                  <input name="duration" value={editData.duration} onChange={handleChange} className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-2 rounded-md" />
                ) : (
                  <p className="text-gray-800 dark:text-gray-200 font-medium">{cita.duration}</p>
                )}
              </div>
            </div>
          </div>

          {/* FECHA Y HORA */}
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><Calendar size={20}/></div>
            <div className="flex-1 grid grid-cols-2 gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">Hora inicio</p>
                {isEditing ? (
                  <input type="time" name="start" value={editData.start} onChange={handleChange} className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-2 rounded-md" />
                ) : (
                  <p className="text-gray-800 dark:text-gray-200 font-medium">{cita.start}</p>
                )}
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">Hora fin</p>
                {isEditing ? (
                  <input type="time" name="end" value={editData.end} onChange={handleChange} className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-2 rounded-md" />
                ) : (
                  <p className="text-gray-800 dark:text-gray-200 font-medium">{cita.end}</p>
                )}
              </div>
            </div>
          </div>

          {/* PRECIO Y ESTADO */}
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><DollarSign size={20}/></div>
            <div className="flex-1 grid grid-cols-2 gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">Precio</p>
                {isEditing ? (
                  <input type="number" name="price" value={editData.price} onChange={handleChange} className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-2 rounded-md" />
                ) : (
                  <p className="text-gray-900 dark:text-white font-bold text-lg">S/ {cita.price || '0.00'}</p>
                )}
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">Estado</p>
                {isEditing ? (
                  <select name="status" value={editData.status} onChange={handleChange} className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-2 rounded-md text-xs">
                    {['Pendiente', 'Confirmada', 'Realizado', 'Cancelada'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : (
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusColors[cita.status] || statusColors.Pendiente}`}>
                    {cita.status || 'Pendiente'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* NOTAS */}
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><AlignLeft size={20}/></div>
            <div className="flex-1">
              <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">Notas / Descripción</p>
              {isEditing ? (
                <textarea name="notes" value={editData.notes} onChange={handleChange} rows="3" className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-2 rounded-md resize-none" />
              ) : (
                <p className="italic text-gray-500 dark:text-gray-400">
                  {cita.notes || 'Sin notas adicionales para esta cita.'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER - ACCIONES */}
        <div className="absolute bottom-0 left-0 w-full p-6 bg-white dark:bg-[#111111] border-t border-gray-100 dark:border-zinc-800">
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-50 transition"
                >
                  <RotateCcw size={16}/> Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 shadow-lg shadow-amber-500/20 transition"
                >
                  <Save size={16}/> Guardar
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-amber-500 text-amber-500 font-semibold hover:bg-amber-500/5 transition"
                >
                  <Pencil size={16}/> Editar Datos
                </button>
                <button 
                  onClick={() => onDelete(cita.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 shadow-lg shadow-red-500/20 transition"
                >
                  <Trash2 size={16}/> Eliminar Cita
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DetalleCita;