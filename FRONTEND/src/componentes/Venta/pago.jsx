import React, { useMemo, useState } from 'react';

import {
  Wallet,
  Banknote,
  Smartphone,
  CreditCard,
  Layers
} from 'lucide-react';

const PaymentModule = ({ total }) => {
  const [metodo, setMetodo] = useState('efectivo');
const [montoPago, setMontoPago] = useState('');
  const [pagosMixtos, setPagosMixtos] = useState([
    {
      tipo: 'efectivo',
      monto: ''
    }
  ]);
  const totalConTarjeta = useMemo(() => {
    if (metodo === 'tarjeta') {
      return total * 1.05;
    }
    return total;
  }, [metodo, total]);
  const cambio = useMemo(() => {
    if (metodo !== 'efectivo') return 0;
    return Number(montoPago || 0)
  - totalConTarjeta;
  }, [montoPago, totalConTarjeta, metodo]);
  const agregarMetodoMixto = () => {
    setPagosMixtos(prev => [
      ...prev,
      {
        tipo: 'yape',
        monto: ''
      }]);};
  const actualizarPago = (
    index,
    campo,
    valor
  ) => {
    const copia = [...pagosMixtos];
    copia[index][campo] = valor;
    setPagosMixtos(copia);};
  const totalMixto = pagosMixtos.reduce(
    (acc, pago) =>
      acc + Number(pago.monto || 0),
    0
  );
  return (
    <div className="
      max-w-2xl p-6 rounded-xl
      bg-white text-gray-800 border border-gray-200
      dark:bg-[#121212] dark:text-white dark:border-zinc-800
      shadow-2xl
    ">

      <div className="flex flex-col items-center mb-8">

        <div className="flex items-center gap-2 self-start mb-4">
          <Wallet className="text-amber-500" size={20} />
          <h2 className="text-sm font-bold tracking-widest uppercase">
            Pago
          </h2>
        </div>

        <p className="text-gray-500 text-sm mb-1">
          Total a pagar
        </p>

        <h1 className="text-4xl font-bold text-amber-500">
          S/ {totalConTarjeta.toFixed(2)}
        </h1>

        {
          metodo === 'tarjeta' && (
            <p className="text-xs text-red-400 mt-2">
              Incluye comisión del 5%
            </p>)}
      </div>
      {/* Métodos */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => setMetodo('efectivo')}
          className={`
            py-3 rounded-xl
            ${metodo === 'efectivo'
              ? 'bg-green-600 text-white'
              : 'bg-zinc-200 dark:bg-zinc-800' }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Banknote size={18} />
            Efectivo
          </div>
        </button>
        <button
          onClick={() => setMetodo('yape')}
          className={`
            py-3 rounded-xl
            ${metodo === 'yape'
              ? 'bg-purple-600 text-white'
              : 'bg-zinc-200 dark:bg-zinc-800' } `} >
          Yape
        </button>
        <button
          onClick={() => setMetodo('plin')}
          className={`
            py-3 rounded-xl
            ${metodo === 'plin'
              ? 'bg-pink-600 text-white'
              : 'bg-zinc-200 dark:bg-zinc-800'
            } `}
        >
          Plin
        </button>
        <button
          onClick={() => setMetodo('tarjeta')}
          className={`
            py-3 rounded-xl
            ${metodo === 'tarjeta'
              ? 'bg-sky-600 text-white'
              : 'bg-zinc-200 dark:bg-zinc-800'
            }
          `}
        >
          <div className="flex items-center justify-center gap-2">
            <CreditCard size={18} />
            Tarjeta
          </div>
        </button>

      </div>

      <button
        onClick={() => setMetodo('mixto')}
        className={`
          w-full py-3 rounded-xl mb-6
          ${metodo === 'mixto'
            ? 'bg-amber-600 text-white'
            : 'bg-zinc-200 dark:bg-zinc-800'
          }
        `}
      >
        <div className="flex items-center justify-center gap-2">
          <Layers size={18} />
          Pago Mixto
        </div>
      </button>

      {
  ['efectivo', 'yape', 'plin', 'tarjeta'].includes(metodo) && (

    <div className="space-y-4">

      <input
        type="number"
        placeholder={
          metodo === 'efectivo'
            ? 'Monto recibido'
            : 'Monto pagado'
        }
        value={montoPago}
        onChange={(e) =>
          setMontoPago(e.target.value)
        }
        className="
          w-full p-3 rounded-xl
          bg-zinc-100 dark:bg-zinc-900
        "
      />

      {/* SOLO EFECTIVO MUESTRA CAMBIO */}

      {
        metodo === 'efectivo' && (
          <div className="text-right">

            <p className="text-sm text-gray-400">
              Cambio
            </p>

            <h2 className="text-3xl font-bold text-green-500">
              S/ {cambio.toFixed(2)}
            </h2>

          </div>
        )
      }

      {/* VALIDACIÓN DE MONTO */}

      {
        metodo !== 'efectivo' && (
          <div className="text-right">

            <p className="text-sm text-gray-400">
              Estado del pago
            </p>

            <h2 className={`text-2xl font-bold ${
              Number(montoPago || 0) >= totalConTarjeta
                ? 'text-green-500'
                : 'text-red-500'
            }`}>
              {
                Number(montoPago || 0) >= totalConTarjeta
                  ? 'Pago completo'
                  : 'Monto insuficiente'
              }
            </h2>

          </div>
        )
      }

    </div>

  )
}
      {/* MIXTO */}

      {
        metodo === 'mixto' && (
          <div className="space-y-4">

            {
              pagosMixtos.map((pago, index) => (

                <div
                  key={index}
                  className="grid grid-cols-2 gap-3"
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
                      p-3 rounded-xl
                      bg-zinc-100 dark:bg-zinc-900
                    "
                  >
                    <option value="efectivo">
                      Efectivo
                    </option>

                    <option value="yape">
                      Yape
                    </option>

                    <option value="plin">
                      Plin
                    </option>

                    <option value="tarjeta">
                      Tarjeta
                    </option>

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
                      p-3 rounded-xl
                      bg-zinc-100 dark:bg-zinc-900
                    "
                  />

                </div>

              ))
            }

            <button
              onClick={agregarMetodoMixto}
              className="
                w-full py-2 rounded-xl
                border border-dashed
              "
            >
              + Agregar método
            </button>

            <div className="text-right">

              <p className="text-sm text-gray-400">
                Total ingresado
              </p>

              <h2 className={`
                text-2xl font-bold
                ${
                  totalMixto >= total
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              `}>
                S/ {totalMixto.toFixed(2)}
              </h2>

            </div>

          </div>
        )
      }

    </div>
  );
};

export default PaymentModule;