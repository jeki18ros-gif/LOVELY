import React, { useMemo, useState } from 'react';

import HeaderActions from '../componentes/Venta/header';
import ClientCard from '../componentes/Venta/clientes';
import ProductList from '../componentes/Venta/productos';
import ServiceList from '../componentes/Venta/servicios';
import SaleDetail from '../componentes/Venta/detalleventa';
import PaymentModule from '../componentes/Venta/pago';

const Venta = () => {

  const [cliente, setCliente] = useState(null);

  const [clienteAnonimo, setClienteAnonimo] = useState(false);

  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);

  const [descuentoTipo, setDescuentoTipo] = useState('monto');

  const [descuentoValor, setDescuentoValor] = useState(0);

  const items = [
    ...productosSeleccionados,
    ...serviciosSeleccionados
  ];

  const subtotal = useMemo(() => {

    return items.reduce(
      (acc, item) =>
        acc + (
          Number(item.precio || 0)
          * item.cantidad
        ),
      0
    );

  }, [items]);

  const descuento = useMemo(() => {

    return descuentoTipo === 'porcentaje'
      ? subtotal * (descuentoValor / 100)
      : Number(descuentoValor);

  }, [subtotal, descuentoTipo, descuentoValor]);

  const total = subtotal - descuento;

  return (
    <div className="
      min-h-screen
      bg-gray-100 text-gray-900
      dark:bg-[#0a0a0a] dark:text-white
      p-4 font-sans
    ">

      <div className="mb-6">
        <HeaderActions />
      </div>

      <div className="grid grid-cols-12 gap-4">

        <div className="col-span-12 lg:col-span-3">
          <ClientCard
            cliente={cliente}
            setCliente={setCliente}
            clienteAnonimo={clienteAnonimo}
            setClienteAnonimo={setClienteAnonimo}
          />
        </div>

        <div className="col-span-12 lg:col-span-4">
          <ProductList
            productosSeleccionados={productosSeleccionados}
            setProductosSeleccionados={setProductosSeleccionados}
          />
        </div>

        <div className="col-span-12 lg:col-span-5">
          <ServiceList
            serviciosSeleccionados={serviciosSeleccionados}
            setServiciosSeleccionados={setServiciosSeleccionados}
          />
        </div>

        <div className="col-span-12 lg:col-span-7">
          <SaleDetail
            cliente={cliente}
            clienteAnonimo={clienteAnonimo}
            productos={productosSeleccionados}
            servicios={serviciosSeleccionados}
            setProductos={setProductosSeleccionados}
            setServicios={setServiciosSeleccionados}

            descuentoTipo={descuentoTipo}
            setDescuentoTipo={setDescuentoTipo}

            descuentoValor={descuentoValor}
            setDescuentoValor={setDescuentoValor}

            subtotal={subtotal}
            descuento={descuento}
            total={total}
          />
        </div>

        <div className="col-span-12 lg:col-span-5">
          <PaymentModule
            total={total}
          />
        </div>

      </div>
    </div>
  );
};

export default Venta;