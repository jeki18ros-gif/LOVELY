import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function Notificacion({ notificacion }) {
  if (!notificacion.visible) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300 ${
        notificacion.tipo === 'success'
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
          : 'bg-amber-500/10 border-amber-500/30 text-amber-500'
      }`}
    >
      <CheckCircle2 size={20} />
      <span className="text-sm font-medium">{notificacion.mensaje}</span>
    </div>
  );
}