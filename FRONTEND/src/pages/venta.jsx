import React from 'react';
import HeaderActions from '../componentes/Venta/header';
import ClientCard from '../componentes/Venta/clientes';
import ProductList from '../componentes/Venta/productos';
import ServiceList from '../componentes/Venta/servicios';
import SaleDetail from '../componentes/Venta/detalleventa';
import PaymentModule from '../componentes/Venta/pago';

const Venta = () => {
  return (
    <div className="
      min-h-screen 
      bg-gray-100 text-gray-900 
      dark:bg-[#0a0a0a] dark:text-white 
      p-4 font-sans transition-colors duration-300
    ">
      
      {/* Header */}
      <div className="mb-6">
        <HeaderActions />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-12 gap-4">
        
        <div className="col-span-12 lg:col-span-3">
          <ClientCard />
        </div>
        
        <div className="col-span-12 lg:col-span-4">
          <ProductList />
        </div>
        
        <div className="col-span-12 lg:col-span-5">
          <ServiceList />
        </div>

        <div className="col-span-12 lg:col-span-7">
          <SaleDetail />
        </div>
        
        <div className="col-span-12 lg:col-span-5">
          <PaymentModule />
        </div>

      </div>
    </div>
  );
};

export default Venta;