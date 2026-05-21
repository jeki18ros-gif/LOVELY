import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../../lib/supabase';

const useServicesTable = ({ filters, categoriaSeleccionada, refresh }) => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [categorias, setCategorias] = useState([]);

  const obtenerServicios = async () => {
    const { data, error } = await supabase
      .from('servicio')
      .select(`
        *,
        categorias (
          id,
          nombre
        )`);

    if (error) {
      console.log(error.message);
      return;
    }
    const serviciosFormateados = (data || []).map(service => ({
      ...service,
      categoria: service.categorias?.nombre || 'Sin categoría',
      categoryColor: 'bg-yellow-500/20 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
    }));
    setServices(serviciosFormateados);
  };

  useEffect(() => {
    obtenerServicios();
    obtenerCategorias();
  }, [refresh]);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      if (
        categoriaSeleccionada &&
        categoriaSeleccionada.nombre !== 'Todos'
      ) {
        if (service.categoria_id !== categoriaSeleccionada.id) {
          return false;
        }
      }
      if (
        filters.nombre &&
        !service.nombre.toLowerCase().includes(filters.nombre.toLowerCase())
      ) {
        return false;
      }
      if (filters.duracion) {
        const mins = Number(service.duracion);
        switch (filters.duracion) {
          case '0-30':
            if (!(mins >= 0 && mins <= 30)) return false;
            break;
          case '31-60':
            if (!(mins >= 31 && mins <= 60)) return false;
            break;
          case '61-120':
            if (!(mins >= 61 && mins <= 120)) return false;
            break;
          case '120+':
            if (!(mins > 120)) return false;
            break;
        }
      }
      if (filters.precio) {
        const precio = Number(service.precio);
        switch (filters.precio) {
          case '0-20':
            if (!(precio >= 0 && precio <= 20)) return false;
            break;
          case '20-50':
            if (!(precio > 20 && precio <= 50)) return false;
            break;
          case '50-100':
            if (!(precio > 50 && precio <= 100)) return false;
            break;
          case '100+':
            if (!(precio > 100)) return false;
            break;
        }
      }
      if (
        filters.estado !== '' &&
        service.estado.toString() !== filters.estado
      ) {
        return false;
      }
      return true;
    });
  }, [services, filters, categoriaSeleccionada]);

  const obtenerCategorias = async () => {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('tipo', 'servicio');

    if (error) {
      console.error(error);
      return;
    }
    setCategorias(data);
  };

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const currentItems = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const closeModal = () => {
    setSelectedService(null);
    setModalType(null);
  };

const handleCreate = async (nuevoServicio) => {
    // El trigger se encarga de crear el historial automáticamente al insertar
    const { error } = await supabase
      .from('servicio')
      .insert([nuevoServicio]);

    if (error) {
      console.error("Error al crear el servicio:", error.message);
      alert("Error al crear el servicio: " + error.message);
      return;
    }

    await obtenerServicios();
    closeModal();
  };
  const handleToggleStatus = async (id) => {
    const service = services.find(s => s.id === id);
    if (!service) return;

    // El Trigger detectará este cambio y generará el registro de auditoría de forma automática
    const { error } = await supabase
      .from('servicio')
      .update({ estado: !service.estado })
      .eq('id', id);

    if (error) {
      console.error(error);
      return;
    }

    setServices(prev =>
      prev.map(s => s.id === id ? { ...s, estado: !s.estado } : s)
    );
  };

 const handleDelete = async (id) => {
    const service = services.find(s => s.id === id);
    if (!service) return;

    // Ejecutamos directamente el borrado físico. El Trigger guardará el log 'Eliminado' antes de procesarlo.
    const { error } = await supabase
      .from('servicio')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(error);
      alert("No se pudo eliminar: " + error.message);
      return;
    }

    setServices(prev => prev.filter(s => s.id !== id));
    closeModal();
    
    if (currentItems.length === 1 && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };
const handleUpdate = async (updatedData) => {
    let imagen_url = selectedService.imagen_url;

    if (updatedData.imagen) {
      const file = updatedData.imagen;
      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('servicios')
        .upload(`servicios/${fileName}`, file);

      if (uploadError) {
        console.error(uploadError);
        return;
      }

      const { data } = supabase.storage
        .from('servicios')
        .getPublicUrl(`servicios/${fileName}`);

      imagen_url = data.publicUrl;
    }
    
    const datosActualizados = {
      nombre: updatedData.nombre,
      descripcion: updatedData.descripcion,
      precio: Number(updatedData.precio),
      duracion: Number(updatedData.duracion),
      categoria_id: updatedData.categoria_id,
      imagen_url
    };

    // El Trigger detectará la actualización y guardará el estado anterior y nuevo en formato JSONB
    const { error } = await supabase
      .from('servicio')
      .update(datosActualizados)
      .eq('id', selectedService.id);

    if (error) {
      console.error(error);
      alert("Error al actualizar: " + error.message);
      return;
    }

    await obtenerServicios();
    closeModal();
  };
  return {
    services, categorias, selectedService, modalType, currentPage,
    setSelectedService, setModalType, setCurrentPage,
    filteredServices, currentItems, totalPages,
    closeModal, handleCreate, handleToggleStatus, handleDelete, handleUpdate, obtenerServicios
  };
};

export default useServicesTable;