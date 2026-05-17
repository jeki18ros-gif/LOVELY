import React, { useMemo, useState, useEffect } from 'react';
import HeaderActions from '../componentes/Venta/header';
import ClientCard from '../componentes/Venta/clientes';
import ProductList from '../componentes/Venta/productos';
import ServiceList from '../componentes/Venta/servicios';
import SaleDetail from '../componentes/Venta/detalleventa';
import PaymentModule from '../componentes/Venta/pago';

const Venta = () => {
  // 1. Estructura de estado principal inicializada desde localStorage
  const [ventas, setVentas] = useState(() => {
    const ventasGuardadas = localStorage.getItem('lista_ventas');
    return ventasGuardadas ? JSON.parse(ventasGuardadas) : [
      {
        id: Date.now(),
        nombre: 'Venta 1',
        cliente: null,
        clienteAnonimo: false,
        productos: [],
        servicios: [],
        descuentoTipo: 'monto',
        descuentoValor: 0
      }
    ];
  });

  // Inicializar el ID activo desde localStorage o usar el ID de la primera venta disponible
  const [ventaActivaId, setVentaActivaId] = useState(() => {
    const idGuardado = localStorage.getItem('venta_activa_id');
    return idGuardado ? Number(idGuardado) : ventas[0].id;
  });

  // ==========================================
  // EFFECT: Guardar en localStorage de forma automática
  // ==========================================
  useEffect(() => {
    localStorage.setItem('lista_ventas', JSON.stringify(ventas));
  }, [ventas]);

  useEffect(() => {
    localStorage.setItem('venta_activa_id', String(ventaActivaId));
  }, [ventaActivaId]);

  // 2. Lógica de venta activa
  const ventaActiva = useMemo(() => 
    ventas.find(v => v.id === ventaActivaId) || ventas[0], 
    [ventas, ventaActivaId]
  );

  // Helper para actualizar la venta activa de forma inmutable
  const updateVentaActiva = (newData) => {
    setVentas(prev => prev.map(v => 
      v.id === ventaActivaId ? { ...v, ...newData } : v
    ));
  };

  // 3. Función "Nueva Venta"
  const handleNuevaVenta = () => {
    const ultimaEsVacia = ventaActiva.productos.length === 0 && ventaActiva.servicios.length === 0;
    if (ultimaEsVacia && ventas.length > 0) return;

    const nuevoId = Date.now();
    const nuevaVenta = {
      id: nuevoId,
      nombre: `Venta ${ventas.length + 1}`,
      cliente: null,
      clienteAnonimo: false,
      productos: [],
      servicios: [],
      descuentoTipo: 'monto',
      descuentoValor: 0
    };
    setVentas([...ventas, nuevaVenta]);
    setVentaActivaId(nuevoId);
  };

  // 4. Función "Duplicar Venta"
  const handleDuplicarVenta = () => {
    const nuevoId = Date.now();
    const copia = {
      ...ventaActiva,
      id: nuevoId,
      nombre: `${ventaActiva.nombre} (copia)`,
      cliente: null, 
      clienteAnonimo: false
    };
    setVentas([...ventas, copia]);
    setVentaActivaId(nuevoId);
  };

  // 13. Función "Cancelar Venta" / "Limpiar al Confirmar"
  const handleCancelarVenta = (id) => {
    const filtradas = ventas.filter(v => v.id !== id);
    if (filtradas.length === 0) {
      const resetId = Date.now();
      const ventaInicial = [{ id: resetId, nombre: 'Venta 1', cliente: null, productos: [], servicios: [], descuentoTipo: 'monto', descuentoValor: 0 }];
      setVentas(ventaInicial);
      setVentaActivaId(resetId);
    } else {
      setVentas(filtradas);
      if (ventaActivaId === id) setVentaActivaId(filtradas[0].id);
    }
  };

  // Cálculos derivados de la venta activa
  const items = [...ventaActiva.productos, ...ventaActiva.servicios];
  const subtotal = items.reduce((acc, item) => acc + (Number(item.precio || 0) * item.cantidad), 0);
  const descuento = ventaActiva.descuentoTipo === 'porcentaje' 
    ? subtotal * (ventaActiva.descuentoValor / 100) 
    : Number(ventaActiva.descuentoValor);
  const total = subtotal - descuento;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0a0a0a] text-gray-900 dark:text-white p-4 font-sans">
      
      <div className="mb-6">
        <HeaderActions 
          ventas={ventas} 
          ventaActivaId={ventaActivaId} 
          setVentaActivaId={setVentaActivaId}
          onNueva={handleNuevaVenta}
          onDuplicar={handleDuplicarVenta}
        />
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* ClientCard */}
        <div className="col-span-12 lg:col-span-3">
          <ClientCard
            cliente={ventaActiva.cliente}
            setCliente={(c) => updateVentaActiva({ cliente: c })}
            clienteAnonimo={ventaActiva.clienteAnonimo}
            setClienteAnonimo={(a) => updateVentaActiva({ clienteAnonimo: a })}
          />
        </div>

        {/* ProductList */}
        <div className="col-span-12 lg:col-span-4">
          <ProductList
            productosSeleccionados={ventaActiva.productos}
            setProductosSeleccionados={(p) => updateVentaActiva({ productos: p })}
          />
        </div>

        {/* ServiceList */}
        <div className="col-span-12 lg:col-span-5">
          <ServiceList
            serviciosSeleccionados={ventaActiva.servicios}
            setServiciosSeleccionados={(s) => updateVentaActiva({ servicios: s })}
          />
        </div>

        {/* SaleDetail */}
        <div className="col-span-12 lg:col-span-7">
          <SaleDetail
            cliente={ventaActiva.cliente}
            clienteAnonimo={ventaActiva.clienteAnonimo}
            productos={ventaActiva.productos}
            servicios={ventaActiva.servicios}
            setProductos={(p) => updateVentaActiva({ productos: p })}
            setServicios={(s) => updateVentaActiva({ servicios: s })}
            descuentoTipo={ventaActiva.descuentoTipo}
            setDescuentoTipo={(t) => updateVentaActiva({ descuentoTipo: t })}
            descuentoValor={ventaActiva.descuentoValor}
            setDescuentoValor={(v) => updateVentaActiva({ descuentoValor: v })}
            subtotal={subtotal}
            descuento={descuento}
            total={total}
          />
        </div>

        {/* PaymentModule */}
        <div className="col-span-12 lg:col-span-5">
          <PaymentModule
            total={total}
            subtotal={subtotal}
            descuento={descuento}
            ventaActiva={ventaActiva}
            onConfirmar={() => handleCancelarVenta(ventaActivaId)} 
            onCancelar={() => handleCancelarVenta(ventaActivaId)}
          />
        </div>
      </div>
    </div>
  );
};

export default Venta;