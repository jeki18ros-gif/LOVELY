// SaleDetail.jsx

import React from 'react';

import {
  ScrollText,
  Trash2,
  Sparkles,
  X
} from 'lucide-react';

const SaleDetail = ({
  cliente,
  clienteAnonimo,

  productos,
  servicios,

  setProductos,
  setServicios,

  descuentoTipo,
  setDescuentoTipo,

  descuentoValor,
  setDescuentoValor,

  subtotal,
  descuento,
  total
}) => {

  const items = [
    ...productos,
    ...servicios
  ];

  const cambiarCantidad = (
    id,
    tipo,
    cantidad
  ) => {

    if (cantidad < 1)
      return;

    if (
      tipo === 'Producto'
    ) {

      setProductos(prev =>
        prev.map(p =>
          p.id === id
            ? {
                ...p,
                cantidad
              }
            : p
        )
      );

    } else {

      setServicios(prev =>
        prev.map(s =>
          s.id === id
            ? {
                ...s,
                cantidad
              }
            : s
        )
      );

    }

  };

  const eliminarItem = (
    id,
    tipo
  ) => {

    if (
      tipo === 'Producto'
    ) {

      setProductos(prev =>
        prev.filter(
          p => p.id !== id
        )
      );

    } else {

      setServicios(prev =>
        prev.filter(
          s => s.id !== id
        )
      );

    }

  };

  return (

<div
  className="
    w-full
    max-w-4xl
    p-6
    rounded-xl
    bg-white
    dark:bg-[#121212]
    shadow-2xl
    border
    border-gray-200
    dark:border-zinc-800
  "
>

      {/* HEADER */}
      <div
        className="
          flex
          justify-between
          items-center
          mb-4
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          <ScrollText size={22}/>

          <h2
            className="
              text-sm
              font-bold
              uppercase
            "
          >
            Detalle de venta
          </h2>

        </div>

        <button
          onClick={() => {

            setProductos([]);

            setServicios([]);

          }}
          className="
            flex
            items-center
            gap-1
            text-red-500
          "
        >

          <Trash2 size={16}/>
          Vaciar

        </button>

      </div>

      {/* CLIENTE */}
      <div
        className="
          mb-6
          p-3
          rounded-lg
          bg-zinc-100
          dark:bg-zinc-900
        "
      >

        {
          clienteAnonimo
            ? 'Cliente manual'
            : cliente
              ? cliente.nombre
              : 'Sin cliente seleccionado'
        }

      </div>

      {/* TABLA */}
      <table
        className="
          w-full
          text-sm
          mb-6
        "
      >

        <thead>

          <tr>
            <th>Item</th>
            <th>Precio</th>
            <th>Cant.</th>
            <th>Total</th>
            <th></th>
          </tr>

        </thead>

        <tbody>

          {
            items.map(item => {

              const totalItem =
                Number(
                  item.precio
                )
                *
                item.cantidad;

              return (

                <tr
                  key={`${item.tipo}-${item.id}`}
                >

                  <td className="py-4">

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >

                      <div
                        className="
                          w-8
                          h-8
                          rounded-full
                          bg-amber-500
                          flex
                          items-center
                          justify-center
                        "
                      >

                        <Sparkles size={14}/>

                      </div>

                      <div>

                        <p>
                          {item.nombre}
                        </p>

                        <p
                          className="
                            text-xs
                            text-gray-500
                          "
                        >
                          {item.tipo}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td>
                    S/ {item.precio}
                  </td>

                  <td>

                    <input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) =>
                        cambiarCantidad(
                          item.id,
                          item.tipo,
                          Number(
                            e.target.value
                          )
                        )
                      }
                      className="
                        w-16
                        px-2
                        py-1
                        rounded-lg
                        bg-zinc-100
                        dark:bg-zinc-900
                      "
                    />

                  </td>

                  <td>
                    S/ {totalItem.toFixed(2)}
                  </td>

                  <td>

                    <button
                      onClick={() =>
                        eliminarItem(
                          item.id,
                          item.tipo
                        )
                      }
                    >

                      <X size={18}/>

                    </button>

                  </td>

                </tr>

              );

            })
          }

        </tbody>

      </table>

      {/* DESCUENTO */}
      <div
        className="
          flex
          flex-col
          gap-4
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <select
            value={descuentoTipo}
            onChange={(e) =>
              setDescuentoTipo(
                e.target.value
              )
            }
            className="
              px-3
              py-2
              rounded-lg
              bg-zinc-100
              dark:bg-zinc-900
            "
          >

            <option value="monto">
              S/
            </option>

            <option value="porcentaje">
              %
            </option>

          </select>

          <input
            type="number"
            value={descuentoValor}
            onChange={(e) =>
              setDescuentoValor(
                Number(
                  e.target.value
                )
              )
            }
            className="
              px-3
              py-2
              rounded-lg
              bg-zinc-100
              dark:bg-zinc-900
            "
          />

        </div>

        {/* TOTALES */}
        <div
          className="
            self-end
            w-72
            rounded-xl
            p-5
            bg-zinc-100
            dark:bg-zinc-900
          "
        >

          <div
            className="
              flex
              justify-between
              mb-2
            "
          >

            <span>
              Subtotal
            </span>

            <span>
              S/ {subtotal.toFixed(2)}
            </span>

          </div>

          <div
            className="
              flex
              justify-between
              mb-2
            "
          >

            <span>
              Descuento
            </span>

            <span>
              - S/ {descuento.toFixed(2)}
            </span>

          </div>

          <div
            className="
              flex
              justify-between
              text-xl
              font-bold
              pt-3
              border-t
              border-zinc-700
            "
          >

            <span>
              TOTAL
            </span>

            <span>
              S/ {total.toFixed(2)}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
};

export default SaleDetail;