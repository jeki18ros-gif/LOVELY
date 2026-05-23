import { useState, useEffect, useMemo } from 'react';
import { supabase } from "../../../lib/supabase";

// Helper fuera del hook para no recrearlo en cada render
const generarHoras = () => {
  const horas = [];
  for (let h = 8; h <= 20; h++) {
    horas.push(`${String(h).padStart(2, '0')}:00`);
    if (h !== 20) horas.push(`${String(h).padStart(2, '0')}:30`);
  }
  return horas;
};

export const HORAS = generarHoras();

export const useFormularioCita = (isOpen, onClose) => {
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [horasOcupadas, setHorasOcupadas] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [busquedaServicio, setBusquedaServicio] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);

  const [formData, setFormData] = useState({
    clienteId: null,
    servicioId: null,
    fecha: '',
    horaInicio: '',
    duracionMinutos: 0,
    precio: 0,
    descripcion: '',
    estado: 'Pendiente'
  });

  // Carga inicial
  useEffect(() => {
    if (isOpen) {
      obtenerClientes();
      obtenerServicios();
    }
  }, [isOpen]);

  // Actualizar disponibilidad cuando cambia la fecha
  useEffect(() => {
    if (formData.fecha) obtenerHorasOcupadas();
  }, [formData.fecha]);

  const obtenerClientes = async () => {
    const { data } = await supabase.from("clientes").select("*").order("nombre");
    setClientes(data || []);
  };

  const obtenerServicios = async () => {
    const { data } = await supabase.from("servicio").select("*").eq("estado", true).order("nombre");
    setServicios(data || []);
  };

  const obtenerHorasOcupadas = async () => {
const { data, error } = await supabase
  .from("citas")
  .select("hora_inicio, duracion_minutos")
  .eq("fecha", formData.fecha)
  .neq("estado", "Cancelada");

    if (error) return;

    const ocupadas = [];
    data.forEach(cita => {
      const [hora, minuto] = cita.hora_inicio.split(":").map(Number);
      const inicio = new Date();
      inicio.setHours(hora, minuto, 0);
      
      const fin = new Date(inicio);
      fin.setMinutes(fin.getMinutes() + cita.duracion_minutos);

      let actual = new Date(inicio);
      while (actual < fin) {
        ocupadas.push(actual.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
        actual.setMinutes(actual.getMinutes() + 30);
      }
    });
    setHorasOcupadas(ocupadas);
  };

  const clientesFiltrados = useMemo(() => {
    if (!busquedaCliente || clienteSeleccionado) return [];
    return clientes.filter(c => c.nombre?.toLowerCase().includes(busquedaCliente.toLowerCase()));
  }, [busquedaCliente, clientes, clienteSeleccionado]);

  const serviciosFiltrados = useMemo(() => {
    if (!busquedaServicio || servicioSeleccionado) return [];
    return servicios.filter(s => s.nombre?.toLowerCase().includes(busquedaServicio.toLowerCase()));
  }, [busquedaServicio, servicios, servicioSeleccionado]);

  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setFormData(prev => ({ ...prev, clienteId: cliente.id }));
    setBusquedaCliente(cliente.nombre);
  };

  const seleccionarServicio = (servicio) => {
    setServicioSeleccionado(servicio);
    setFormData(prev => ({
      ...prev,
      servicioId: servicio.id,
      precio: servicio.precio || 0,
      duracionMinutos: servicio.duracion || 0,
      descripcion: servicio.descripcion || ''
    }));
    setBusquedaServicio(servicio.nombre);
  };

  const calcularHoraFin = () => {
    if (!formData.horaInicio || !formData.duracionMinutos) return '--:--';
    const [hora, minuto] = formData.horaInicio.split(':').map(Number);
    const fecha = new Date();
    fecha.setHours(hora, minuto);
    fecha.setMinutes(fecha.getMinutes() + Number(formData.duracionMinutos));
    return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const guardarCita = async (e) => {
    e.preventDefault();
    if (!formData.clienteId || !formData.servicioId || !formData.horaInicio) {
      alert("Por favor completa los campos obligatorios");
      return;
    }

    const { error } = await supabase.from("citas").insert([{
      cliente_id: formData.clienteId,
      servicio_id: formData.servicioId,
      fecha: formData.fecha,
      hora_inicio: formData.horaInicio,
      duracion_minutos: Number(formData.duracionMinutos),
      precio: Number(formData.precio),
      notas: formData.descripcion,
      estado: formData.estado
    }]);

    if (error) {
      alert("Error al registrar");
      return;
    }

    setMensaje("Cita registrada correctamente");
    setTimeout(() => {
      onClose();
      setMensaje('');
      setFormData({ /* reset inicial */ });
    }, 1500);
  };

  return {
    formData, setFormData,
    busquedaCliente, setBusquedaCliente,
    busquedaServicio, setBusquedaServicio,
    clientesFiltrados, serviciosFiltrados,
    clienteSeleccionado, servicioSeleccionado,
    horasOcupadas, mensaje,
    seleccionarCliente, seleccionarServicio,
    calcularHoraFin, guardarCita
  };
};