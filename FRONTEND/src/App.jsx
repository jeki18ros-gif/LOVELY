import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Sidebar from "./common/sidebar";
import Venta from "./pages/venta";
import Servicios from "./pages/servicios";
import Productos from "./pages/productos";
import Clientes from "./pages/clientes";
import Citas from "./pages/citas";
import FinanzasGeneral from "./pages/finanzas";
import HistoryGeneral from "./pages/historial";
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
            <Route path="/finanzas" element={<FinanzasGeneral/>} />
            <Route path="/historial" element={<HistoryGeneral/>}/>
          </Routes>
        </motion.div>
      </div>
    </BrowserRouter>
  );
}