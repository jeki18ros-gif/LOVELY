import { useState, useEffect } from 'react';
import { supabase } from "../../../lib/supabase";

export const useDetalleCita = (cita, onUpdate) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [mensaje, setMensaje] = useState('');

  // Sincronizar datos cuando cambia la cita seleccionada
  useEffect(() => {
    if (cita) {
      setEditData(cita);
      setIsEditing(false);
    }
  }, [cita]);

const handleChange = (e) => {

  const { name, value } = e.target;

  if (name === "start") {

    const fechaOriginal =
      new Date(editData.start)
        .toISOString()
        .split('T')[0];

    setEditData(prev => ({

      ...prev,

      start:
        `${fechaOriginal}T${value}:00`
    }));

    return;
  }

  setEditData(prev => ({
    ...prev,
    [name]: value
  }));
};

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(''), 3000);
  };

const handleSave = async () => {

  const horaInicio =
    new Date(editData.start)
      .toLocaleTimeString(
        'es-PE',
        {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }
      );

  const { error } = await supabase
    .from("citas")
    .update({

      estado:
        editData.status,

      notas:
        editData.notes,

      precio:
        Number(editData.price),

      duracion_minutos:
        Number(editData.duration),

      hora_inicio:
        horaInicio,

    })
    .eq("id", cita.id);

  if (error) {

    console.error(error);

    mostrarMensaje(
      "Error al actualizar cita"
    );

    return;
  }

  onUpdate({
    ...editData
  });

  mostrarMensaje(
    "Cita actualizada correctamente"
  );

  setIsEditing(false);
};

  const cancelarEdicion = () => {
    setEditData(cita);
    setIsEditing(false);
  };

  return {
    isEditing,
    setIsEditing,
    editData,
    mensaje,
    handleChange,
    handleSave,
    cancelarEdicion,
  };
};

// Helper de formato fuera del hook
export const formatTime = (isoString) => {
  if (!isoString) return "";
  if (!isoString) return isoString;
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};