import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

import ClientesHeader from '../componentes/clientes/header';
import FilterBar from '../componentes/clientes/filtros';
import ClientesTable from '../componentes/clientes/tabla';

import FormularioCliente from '../componentes/clientes/formularios/formulariocliente';
import FormularioVer from '../componentes/clientes/formularios/formularioVer';
import FormularioEditar from '../componentes/clientes/formularios/formularioEditar';

const Clientes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [listaClientes, setListaClientes] = useState([]);

  const [clienteSeleccionado, setClienteSeleccionado] =
    useState(null);

  const [modalType, setModalType] =
    useState(null);

  const [filters, setFilters] = useState({
    search: '',
    frecuencia: '',
    visitas: ''
  });

  useEffect(() => {
    obtenerClientes();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('clientes-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clientes'
        },
        () => obtenerClientes()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const capitalizar = (texto) => {
    if (!texto) return 'Nuevo';

    return (
      texto.charAt(0).toUpperCase() +
      texto.slice(1)
    );
  };

  const obtenerClientes = async () => {
    const { data, error } =
      await supabase
        .from('clientes')
        .select(`
          id,
          nombre,
          numero,
          correo,
          frecuencia,
          visitas,
          fecha_registro
        `);

    if (error) {
      console.error(error);
      return;
    }

    setListaClientes(
      data.map(c => ({
        id: c.id,
        nombre: c.nombre,
        telefono: c.numero || '—',
        correo: c.correo || '—',
        frecuencia: capitalizar(
          c.frecuencia
        ),
        visitas: c.visitas,
        fecha_registro:
          c.fecha_registro
      }))
    );
  };

  const actualizarCliente =
    async (id, form) => {

      const {
        nombre,
        numero,
        correo,
        seguimiento
      } = form;

      const { error } =
        await supabase
          .from('clientes')
          .update({
            nombre,
            numero:
              numero?.trim() ||
              null,
            correo:
              correo?.trim() ||
              null
          })
          .eq('id', id);

      if (error) {
        console.error(error);
        return;
      }

      if (
        seguimiento &&
        seguimiento.trim()
      ) {

        const {
          data:
            seguimientoExistente
        } =
          await supabase
            .from(
              'seguimiento'
            )
            .select('id')
            .eq(
              'id_cliente',
              id
            )
            .eq(
              'tipo',
              'cliente'
            )
            .maybeSingle();

        if (
          seguimientoExistente
        ) {
          await supabase
            .from(
              'seguimiento'
            )
            .update({
              nota:
                seguimiento,
              fecha:
                new Date().toISOString()
            })
            .eq(
              'id',
              seguimientoExistente.id
            );
        } else {
          await supabase
            .from(
              'seguimiento'
            )
            .insert([
              {
                id_cliente:
                  id,
                nota:
                  seguimiento,
                tipo:
                  'cliente',
                fecha:
                  new Date().toISOString()
              }
            ]);
        }
      }

      await obtenerClientes();

      setModalType(null);
      setClienteSeleccionado(
        null
      );
    };

  const handleSaveCliente =
    async (form) => {

      const {
        nombre,
        numero,
        correo
      } = form;

      const { error } =
        await supabase
          .from('clientes')
          .insert([
            {
              nombre,
              numero:
                numero ||
                null,
              correo:
                correo ||
                null,
              visitas: 0,
              frecuencia:
                'nuevo'
            }
          ]);

      if (error) {
        console.error(error);
        return;
      }

      await obtenerClientes();

      setIsModalOpen(
        false
      );
    };

  const cerrarModal =
    () => {
      setModalType(null);
      setClienteSeleccionado(
        null
      );
    };

  return (
    <div className="
min-h-screen
bg-gradient-to-br
from-[#fffdf7]
via-[#f8f5ed]
to-[#f2ede3]
dark:from-[#050505]
dark:via-[#0b0b0b]
dark:to-[#111111]
">

      <div className="
max-w-7xl
mx-auto
p-4
md:p-8
space-y-6
">

        <ClientesHeader
          onOpenModal={() =>
            setIsModalOpen(
              true
            )
          }
        />

        <section className="
bg-white/80
dark:bg-[#101010]/90
backdrop-blur-xl
p-5
rounded-3xl
border
border-amber-500/20
">

          <FilterBar
            filters={
              filters
            }
            setFilters={
              setFilters
            }
          />

        </section>

        <main className="
bg-white/90
dark:bg-[#0d0d0d]
backdrop-blur-xl
rounded-[30px]
border
border-amber-500/20
shadow-[0_10px_40px_rgba(251,191,36,0.08)]
overflow-hidden
">

          <ClientesTable
            filters={
              filters
            }

            listaClientes={
              listaClientes
            }

            setListaClientes={
              setListaClientes
            }

            actualizarCliente={
              actualizarCliente
            }

            abrirModal={(
              tipo,
              cliente
            ) => {
              setClienteSeleccionado(
                cliente
              );

              setModalType(
                tipo
              );
            }}
          />

        </main>

      </div>

      <FormularioCliente
        isOpen={
          isModalOpen
        }
        onClose={() =>
          setIsModalOpen(
            false
          )
        }
        onSubmit={
          handleSaveCliente
        }
      />

      <FormularioVer
        isOpen={
          modalType ===
          'ver'
        }

        cliente={
          clienteSeleccionado
        }

        onClose={
          cerrarModal
        }
      />

      <FormularioEditar
        isOpen={
          modalType ===
          'editar'
        }

        cliente={
          clienteSeleccionado
        }

        onClose={
          cerrarModal
        }

        onSubmit={
          (form) =>
            actualizarCliente(
              clienteSeleccionado.id,
              form
            )
        }
      />

    </div>
  );
};

export default Clientes;