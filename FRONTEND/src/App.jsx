import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Sidebar from "./common/sidebar";
import Venta from "./pages/venta";
import Servicios from "./pages/servicios";
import Productos from "./pages/productos";
import Clientes from "./pages/clientes";
import Citas from "./pages/citas";
import Ingresos from "./pages/Finanzas/ingresos";
import Egresos from "./pages/Finanzas/egresos";
import CierreCaja from "./pages/Finanzas/cierreCaja";
import CitasHistory from "./pages/historial/citas";
import VentaHistory from "./pages/historial/ventas";
import FinanzasHistory from "./pages/historial/finanzas";
import MovimientosHistory from "./pages/historial/movimientos";
import { motion } from "framer-motion";

export default function App() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <BrowserRouter>
      <div>
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        {/* Contenido */}
        <motion.div
          className={`
            min-h-screen
            bg-gray-100
            dark:bg-[#0f0f0f]
            transition-all duration-300
            ${isOpen ? "ml-[220px]" : "ml-[70px]"}
          `}
        >
          <Routes>
            <Route path="/" element={<Venta />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/citas" element={<Citas />} />
            <Route path="/finanzas/ingresos" element={<Ingresos />} />
            <Route path="/finanzas/egresos" element={<Egresos />} />
            <Route path="/finanzas/cierre" element={<CierreCaja />} />
            <Route path="/historial/citas" element={<CitasHistory/>}/>
            <Route path="/historial/finanzas" element={<FinanzasHistory/>}/>
            <Route path="/historial/ventas" element={<VentaHistory/>}/>
            <Route path="/historial/movimientos" element={<MovimientosHistory/>}/>
          </Routes>
        </motion.div>
      </div>
    </BrowserRouter>
  );
}