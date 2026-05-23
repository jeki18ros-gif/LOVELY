import React, {
  useState,
  useEffect
} from 'react';

import {
  Scissors,
  ChevronDown,
  Sparkles
} from 'lucide-react';

import { supabase }
from '../../lib/supabase';

const ServiceList = ({
  serviciosSeleccionados,
  setServiciosSeleccionados
}) => {

  const [servicios,
    setServicios] =
      useState([]);

  const [categorias,
    setCategorias] =
      useState([]);

  const [busqueda,
    setBusqueda] =
      useState('');

  const [categoriaSeleccionada,
    setCategoriaSeleccionada] =
      useState('');

  // Obtener categorías reales
  useEffect(() => {
    const obtenerCategorias =
      async () => {

      const { data, error } =
        await supabase
          .from('categorias')
          .select('*')
          .eq('tipo', 'servicio')
          .order('nombre');

      if (error) {
        console.error(error);
        return;
      }

      setCategorias(data || []);
    };

    obtenerCategorias();
  }, []);

  // Obtener servicios reales
  useEffect(() => {
    const obtenerServicios =
      async () => {

      let query =
        supabase
          .from('servicio')
          .select(`
            *,
            categorias (
              id,
              nombre
            )
          `)
          .eq('estado', true); // <--- CORRECCIÓN AQUÍ: Solo trae servicios activos

      // Buscar
      if (busqueda.trim()) {
        query =
          query.ilike(
            'nombre',
            `%${busqueda}%`
          );
      }

      // Filtrar categoría
      if (categoriaSeleccionada) {
        query =
          query.eq(
            'categoria_id',
            categoriaSeleccionada
          );
      }

      const { data, error } =
        await query.order(
          'nombre'
        );

      if (error) {
        console.error(error);
        return;
      }

      setServicios(data || []);
    };

    obtenerServicios();
  }, [
    busqueda,
    categoriaSeleccionada
  ]);

  return (
    <div
      className="
        max-w-md
        h-[500px]
        flex
        flex-col
        p-6
        rounded-xl
        bg-white
        dark:bg-[#121212]
        text-gray-800
        dark:text-white
        shadow-xl
        border
        border-gray-200
        dark:border-zinc-800
      "
    >
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-6">
        <Scissors
          className="text-purple-400 dark:text-purple-500"
          size={20}
        />
        <h2 className="text-sm font-bold tracking-widest uppercase">
          Servicios
        </h2>
      </div>

      {/* BUSCADOR + FILTRO */}
      <div className="flex gap-2 mb-6">
        {/* INPUT */}
        <div className="flex-grow">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar servicios..."
            className="
              w-full
              bg-gray-100
              dark:bg-zinc-900
              rounded-lg
              py-2
              pl-4
              pr-4
              text-sm
              outline-none
              focus:ring-1
              focus:ring-amber-500
            "
          />
        </div>

        {/* SELECT */}
        <div className="relative">
          <select
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            className="
              appearance-none
              bg-gray-100
              dark:bg-zinc-900
              rounded-lg
              py-2
              pl-3
              pr-8
              text-sm
              outline-none
              cursor-pointer
            "
          >
            <option value="">Todas</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="
              absolute
              right-2
              top-1/2
              -translate-y-1/2
              pointer-events-none
              text-gray-500
            "
          />
        </div>
      </div>

      {/* LISTA */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-5">
        {servicios.map(serv => (
          <div key={serv.id} className="flex items-center justify-between">
            {/* IZQUIERDA */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white">
                <Sparkles size={18}/>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{serv.nombre}</span>
                <span className="text-xs text-gray-500">{serv.duracion} min</span>
              </div>
            </div>

            {/* DERECHA */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold">S/ {serv.precio}</span>
              {/* CHECK */}
              <input
                type="checkbox"
                checked={serviciosSeleccionados.some(s => s.id === serv.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    const existe = serviciosSeleccionados.some(s => s.id === serv.id);
                    if (!existe) {
                      setServiciosSeleccionados([
                        ...serviciosSeleccionados,
                        { ...serv, tipo: 'Servicio', cantidad: 1 }
                      ]);
                    }
                  } else {
                    setServiciosSeleccionados(
                      serviciosSeleccionados.filter(s => s.id !== serv.id)
                    );
                  }
                }}
                className="
                  w-5
                  h-5
                  rounded
                  text-amber-500
                  focus:ring-amber-500
                  cursor-pointer
                "
              />
            </div>
          </div>
        ))}

        {/* VACÍO */}
        {servicios.length === 0 && (
          <div className="py-10 text-center text-sm text-gray-500">
            No se encontraron servicios activos
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceList;