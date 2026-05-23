import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Scissors,
  Package,
  Users,
  Calendar,
  History,
  DollarSign,
  Sun,
  Moon
} from "lucide-react";
import logo1 from "../assets/Logo1.png";
import logo2 from "../assets/Logo2.png";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { name: "Venta", icon: ShoppingCart, path: "/" },
  { name: "Servicios", icon: Scissors, path: "/servicios" },
  { name: "Productos", icon: Package, path: "/productos" },
  { name: "Clientes", icon: Users, path: "/clientes" },
  { name: "Citas", icon: Calendar, path: "/citas" },
  { name: "Finanzas", icon: DollarSign, path: "/finanzas" },
  { name: "Historial", icon: History, path: "/historial" },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const [dark, setDark] = useState(false);
  const location = useLocation();
const [openMenu, setOpenMenu] = useState(null);
  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDark(false);
    }
  }, []);

  return (
    <motion.div
      animate={{ width: isOpen ? 220 : 70 }}
      className={`fixed top-0 left-0 h-screen flex flex-col z-50
      transition-colors duration-300
      ${dark ? "bg-black text-white" : "bg-white text-black"}
      `}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src={dark ? logo1 : logo2}
          alt="logo"
          className="w-10 h-10 rounded-full"
        />
        {isOpen && (
          <span className="font-bold tracking-wide">
            LOVELY
          </span>
        )}
      </div>

      {/* Menu */}
      <div className="flex-1">
        {menuItems.map((item, index) => {
  const Icon = item.icon;

  // Si tiene submenú
  if (item.children) {
    const isOpenMenu = openMenu === item.name;

    return (
      <div key={index}>
        <div
          onClick={() =>
            setOpenMenu(isOpenMenu ? null : item.name)
          }
          className={`flex items-center gap-3 p-4 cursor-pointer transition
          ${dark ? "hover:bg-white/10" : "hover:bg-black/10"}
          `}
        >
          <Icon size={20} className="text-yellow-500" />
          {isOpen && <span>{item.name}</span>}
        </div>

        {/* Submenú */}
        {isOpen && isOpenMenu && (
          <div className="ml-10 flex flex-col">
            {item.children.map((sub, i) => {
              const active = location.pathname === sub.path;

              return (
                <Link to={sub.path} key={i}>
                  <div
                    className={`p-2 text-sm transition
                    ${
                      active
                        ? "text-yellow-500"
                        : dark
                        ? "hover:text-yellow-400"
                        : "hover:text-yellow-600"
                    }`}
                  >
                    {sub.name}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Items normales
  const active = location.pathname === item.path;

  return (
    <Link to={item.path} key={index}>
      <div
        className={`flex items-center gap-3 p-4 transition-all duration-200
        ${
          active
            ? "bg-yellow-500/20 text-yellow-500"
            : dark
            ? "hover:bg-white/10"
            : "hover:bg-black/10"
        }`}
      >
        <Icon size={20} className="text-yellow-500" />
        {isOpen && <span>{item.name}</span>}
      </div>
    </Link>
  );
})}
      </div>

      {/* Botón modo */}
      <div
        className={`p-4 flex items-center gap-3 cursor-pointer transition
        ${dark ? "hover:bg-white/10" : "hover:bg-black/10"}`}
        onClick={() => {
          const html = document.documentElement;

          if (html.classList.contains("dark")) {
            html.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setDark(false);
          } else {
            html.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setDark(true);
          }
        }}
      >
        {dark ? (
          <Moon size={20} className="text-yellow-500" />
        ) : (
          <Sun size={20} className="text-yellow-500" />
        )}
        {isOpen && <span>Modo</span>}
      </div>
    </motion.div>
  );
}