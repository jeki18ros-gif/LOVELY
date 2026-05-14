import React, { useMemo, useState } from 'react';

import {
  Wallet,
  Banknote,
  Smartphone,
 CreditCard,
  Layers,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const METODOS = [
  'efectivo',
  'yape',
  'plin',
  'tarjeta'
];

const PaymentModule = ({
  total,
  ventaActiva,
  onConfirmar,
  onCancelar
}) => {

  const [metodo, setMetodo] =
    useState('efectivo');

  const [montoPago, setMontoPago] =
    useState('');

  const [pagosMixtos, setPagosMixtos] =
    useState([
      {
        tipo: 'efectivo',
        monto: ''
      }
    ]);

  // =========================
  // MÉTODO SIMPLE
  // =========================

  const totalConComisionGeneral =
    useMemo(() => {

      return metodo === 'tarjeta'
        ? total * 1.05
        : total;

    }, [metodo, total]);

  const cambio =
    useMemo(() => {

      return Number(
        montoPago || 0
      ) - totalConComisionGeneral;

    }, [
      montoPago,
      totalConComisionGeneral
    ]);

  // =========================
  // MÉTODO MIXTO
  // =========================

  const resumenMixto =
    useMemo(() => {

      let abonoReal = 0;

      let totalCobrado = 0;

      let totalComisiones = 0;

      const detalle =
        pagosMixtos.map(pago => {

          const monto =
            Number(
              pago.monto || 0
            );

          let real = monto;

          let comision = 0;

          if (
            pago.tipo === 'tarjeta'
          ) {

            real =
              monto / 1.05;

            comision =
              monto - real;

          }

          abonoReal += real;

          totalCobrado += monto;

          totalComisiones += comision;

          return {
            ...pago,
            abonoReal: real,
            comision
          };

        });

      const faltanteReal =
        total - abonoReal;

      const excedente =
        abonoReal > total
          ? abonoReal - total
          : 0;

      return {
        detalle,
        abonoReal,
        totalCobrado,
        totalComisiones,
        faltanteReal,
        excedente
      };

    }, [
      pagosMixtos,
      total
    ]);

  // =========================
  // MÉTODOS USADOS
  // =========================

  const metodosUsados =
    pagosMixtos.map(
      p => p.tipo
    );

  // =========================
  // ACTUALIZAR PAGO
  // =========================

  const actualizarPago = (
    index,
    campo,
    valor
  ) => {

    const copia = [
      ...pagosMixtos
    ];

    copia[index][campo] =
      valor;

    setPagosMixtos(copia);

  };

  // =========================
  // AGREGAR MÉTODO
  // =========================

  const agregarMetodoMixto =
    () => {

      const disponibles =
        METODOS.filter(
          m =>
            !metodosUsados.includes(m)
        );

      if (
        disponibles.length === 0
      ) return;

      setPagosMixtos(prev => [
        ...prev,
        {
          tipo: disponibles[0],
          monto: ''
        }
      ]);

    };

  // =========================
  // ELIMINAR MÉTODO
  // =========================

  const eliminarMetodo =
    (index) => {

      setPagosMixtos(prev =>
        prev.filter(
          (_, i) => i !== index
        )
      );

    };

  // =========================
  // LIMPIAR
  // =========================

  const limpiarFormulario =
    () => {

      setMetodo('efectivo');

      setMontoPago('');

      setPagosMixtos([
        {
          tipo: 'efectivo',
          monto: ''
        }
      ]);

    };

  // =========================
  // PAGAR
  // =========================

  const handlePagar =
    () => {

      // MIXTO
      if (
        metodo === 'mixto'
      ) {

        if (
          resumenMixto
            .faltanteReal > 0.01
        ) {

          alert(
            `Falta cubrir S/ ${resumenMixto.faltanteReal.toFixed(2)}`
          );

          return;

        }

      } else {

        // SIMPLE

        const monto =
          Number(
            montoPago || 0
          );

        if (
          monto <
          totalConComisionGeneral
        ) {

          alert(
            'Monto insuficiente'
          );

          return;

        }

      }

      if (
        window.confirm(
          '¿Confirmar pago?'
        )
      ) {

        limpiarFormulario();

        onConfirmar();

      }

    };

  return (

<div
  className="
    max-w-2xl
    p-6
    rounded-xl
    bg-white
    text-gray-800
    border
    border-gray-200
    dark:bg-[#121212]
    dark:text-white
    dark:border-zinc-800
    shadow-2xl
  "
>

      {/* HEADER */}
      <div
        className="
          flex
          flex-col
          items-center
          mb-8
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
            self-start
            mb-4
          "
        >

          <Wallet
            className="
              text-amber-500
            "
            size={20}
          />

          <h2
            className="
              text-sm
              font-bold
              tracking-widest
              uppercase
            "
          >
            Módulo de Pago
          </h2>

        </div>

        <p
          className="
            text-gray-500
            text-sm
            mb-1
          "
        >
          Total Neto
        </p>

        <h1
          className="
            text-4xl
            font-bold
            text-amber-500
          "
        >

          S/ {
            metodo === 'mixto'
              ? (
                  total
                  +
                  resumenMixto
                    .totalComisiones
                ).toFixed(2)
              : totalConComisionGeneral.toFixed(2)
          }

        </h1>

      </div>

      {/* MÉTODOS */}
      <div
        className="
          grid
          grid-cols-4
          gap-2
          mb-4
        "
      >

        {
          METODOS.map(m => (

            <button
              key={m}
              onClick={() =>
                setMetodo(m)
              }
              className={`
                py-3
                rounded-xl
                transition-all
                ${
                  metodo === m
                    ? 'bg-amber-500 text-white scale-105'
                    : 'bg-zinc-100 dark:bg-zinc-800'
                }
              `}
            >

              <div
                className="
                  flex
                  flex-col
                  items-center
                  gap-1
                  text-xs
                  font-bold
                  capitalize
                "
              >

                {
                  m === 'efectivo'
                  &&
                  <Banknote size={18}/>
                }

                {
                  (
                    m === 'yape'
                    ||
                    m === 'plin'
                  )
                  &&
                  <Smartphone size={18}/>
                }

                {
                  m === 'tarjeta'
                  &&
                  <CreditCard size={18}/>
                }

                {m}

              </div>

            </button>

          ))
        }

      </div>

      {/* MIXTO */}
      <button
        onClick={() =>
          setMetodo('mixto')
        }
        className={`
          w-full
          py-3
          rounded-xl
          mb-6
          border-2
          transition-all
          ${
            metodo === 'mixto'
              ? 'border-amber-500 bg-amber-500/10 text-amber-500'
              : 'border-transparent bg-zinc-100 dark:bg-zinc-800'
          }
        `}
      >

        <div
          className="
            flex
            items-center
            justify-center
            gap-2
            font-bold
          "
        >

          <Layers size={18}/>
          Pago Mixto

        </div>

      </button>

      {/* SIMPLE */}
      {
        metodo !== 'mixto'
        && (

          <div
            className="
              space-y-4
              mb-6
            "
          >

            <input
              type="number"
              placeholder="
                Ingresar monto
              "
              value={montoPago}
              onChange={(e) =>
                setMontoPago(
                  e.target.value
                )
              }
              className="
                w-full
                p-4
                rounded-xl
                bg-zinc-100
                dark:bg-zinc-900
                text-2xl
                font-mono
              "
            />

            <div
              className="
                flex
                justify-between
              "
            >

              <div>

                <p
                  className="
                    text-xs
                    text-gray-400
                  "
                >
                  Abono real
                </p>

                <p
                  className="
                    text-xl
                    font-bold
                  "
                >

                  S/ {
                    metodo === 'tarjeta'
                      ? (
                          Number(
                            montoPago
                          ) / 1.05
                        ).toFixed(2)
                      : Number(
                          montoPago || 0
                        ).toFixed(2)
                  }

                </p>

              </div>

              <div
                className="
                  text-right
                "
              >

                <p
                  className="
                    text-xs
                    text-gray-400
                  "
                >
                  {
                    cambio >= 0
                      ? 'Vuelto'
                      : 'Faltante'
                  }
                </p>

                <h2
                  className={`
                    text-3xl
                    font-bold
                    ${
                      cambio >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }
                  `}
                >

                  S/ {
                    Math.abs(
                      cambio
                    ).toFixed(2)
                  }

                </h2>

              </div>

            </div>

          </div>

        )
      }

      {/* MIXTO */}
      {
        metodo === 'mixto'
        && (

          <div
            className="
              space-y-4
              mb-6
            "
          >

            {
              resumenMixto.detalle.map(
                (
                  pago,
                  index
                ) => (

                  <div
                    key={index}
                    className="
                      rounded-xl
                      p-4
                      bg-zinc-100
                      dark:bg-zinc-900
                    "
                  >

                    <div
                      className="
                        flex
                        gap-2
                        items-center
                        mb-3
                      "
                    >

                      <select
                        value={pago.tipo}
                        onChange={(e) =>
                          actualizarPago(
                            index,
                            'tipo',
                            e.target.value
                          )
                        }
                        className="
                          p-3
                          rounded-xl
                          bg-white
                          dark:bg-zinc-800
                        "
                      >

                        {
                          METODOS
                          .filter(m => {

                            return (
                              !metodosUsados.includes(m)
                              ||
                              m === pago.tipo
                            );

                          })
                          .map(m => (

                            <option
                              key={m}
                              value={m}
                            >

                              {
                                m === 'tarjeta'
                                  ? 'Tarjeta (+5%)'
                                  : m
                              }

                            </option>

                          ))
                        }

                      </select>

                      <input
                        type="number"
                        placeholder="Monto"
                        value={pago.monto}
                        onChange={(e) =>
                          actualizarPago(
                            index,
                            'monto',
                            e.target.value
                          )
                        }
                        className="
                          flex-1
                          p-3
                          rounded-xl
                          bg-white
                          dark:bg-zinc-800
                        "
                      />

                      {
                        pagosMixtos.length > 1
                        && (

                          <button
                            onClick={() =>
                              eliminarMetodo(
                                index
                              )
                            }
                            className="
                              text-red-400
                            "
                          >

                            <X size={20}/>

                          </button>

                        )
                      }

                    </div>

                    {/* DETALLE */}
                    <div
                      className="
                        text-sm
                        space-y-1
                      "
                    >

                      <div
                        className="
                          flex
                          justify-between
                        "
                      >

                        <span>
                          Abono real
                        </span>

                        <span
                          className="
                            font-bold
                            text-green-500
                          "
                        >

                          S/ {
                            pago.abonoReal
                              .toFixed(2)
                          }

                        </span>

                      </div>

                      {
                        pago.tipo ===
                        'tarjeta'
                        && (

                          <div
                            className="
                              flex
                              justify-between
                            "
                          >

                            <span>
                              Comisión
                            </span>

                            <span
                              className="
                                text-red-400
                                font-bold
                              "
                            >

                              S/ {
                                pago.comision
                                  .toFixed(2)
                              }

                            </span>

                          </div>

                        )
                      }

                    </div>

                  </div>

                )
              )
            }

            {/* AGREGAR */}
            {
              pagosMixtos.length
              <
              METODOS.length
              && (

                <button
                  onClick={
                    agregarMetodoMixto
                  }
                  className="
                    w-full
                    py-2
                    rounded-xl
                    border
                    border-dashed
                    border-gray-500
                    text-gray-500
                  "
                >

                  + Agregar método

                </button>

              )
            }

            {/* RESUMEN */}
            <div
              className="
                p-4
                rounded-xl
                bg-amber-500/5
                border
                border-amber-500/20
                space-y-2
              "
            >

              <div
                className="
                  flex
                  justify-between
                "
              >

                <span>
                  Deuda cubierta
                </span>

                <span
                  className="
                    font-bold
                  "
                >

                  S/ {
                    resumenMixto
                      .abonoReal
                      .toFixed(2)
                  }

                  {' / '}

                  S/ {
                    total.toFixed(2)
                  }

                </span>

              </div>

              <div
                className="
                  flex
                  justify-between
                "
              >

                <span>
                  Total cobrado
                </span>

                <span
                  className="
                    font-bold
                  "
                >

                  S/ {
                    resumenMixto
                      .totalCobrado
                      .toFixed(2)
                  }

                </span>

              </div>

              <div
                className="
                  flex
                  justify-between
                "
              >

                <span>
                  Comisiones
                </span>

                <span
                  className="
                    text-red-400
                    font-bold
                  "
                >

                  S/ {
                    resumenMixto
                      .totalComisiones
                      .toFixed(2)
                  }

                </span>

              </div>

              {
                resumenMixto
                  .faltanteReal > 0
                ? (

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-amber-500
                    "
                  >

                    <AlertCircle size={16}/>

                    <p
                      className="
                        text-sm
                      "
                    >

                      Faltan:

                      {' '}

                      <b>
                        S/ {
                          resumenMixto
                            .faltanteReal
                            .toFixed(2)
                        }
                      </b>

                    </p>

                  </div>

                )
                : (

                  <div
                    className="
                      text-green-500
                      font-bold
                      text-center
                    "
                  >

                    ¡Pago completo!

                  </div>

                )
              }

            </div>

          </div>

        )
      }

      {/* BOTONES */}
      <div
        className="
          grid
          grid-cols-2
          gap-4
          pt-6
          border-t
          border-zinc-800
        "
      >

        <button
          onClick={() => {

            if (
              window.confirm(
                '¿Cancelar pago?'
              )
            ) {

              limpiarFormulario();

              onCancelar();

            }

          }}
          className="
            py-4
            rounded-xl
            font-bold
            text-gray-500
            hover:bg-zinc-100
            dark:hover:bg-zinc-800
          "
        >

          Cancelar

        </button>

        <button
          onClick={handlePagar}
          className="
            py-4
            rounded-xl
            font-bold
            bg-amber-500
            text-black
            hover:bg-amber-400
          "
        >

          <div
            className="
              flex
              items-center
              justify-center
              gap-2
            "
          >

            <CheckCircle size={18}/>

            Confirmar

          </div>

        </button>

      </div>

    </div>

  );

};

export default PaymentModule;