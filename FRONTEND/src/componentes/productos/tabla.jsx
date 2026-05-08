import React, { useState, useMemo } from 'react';
import { Pencil, Trash2, Eye, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import FormularioVer from './formularios/FormularioVer';
import FormularioEditar from './formularios/FormularioEditar';

const initialProductos = [
  { id: 1, name: 'Shampoo Profesional L’Oréal', price: 'S/ 45.00', category: 'Cuidado capilar', categoryColor: 'bg-blue-500/20 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', stock: 10, status: true, image: 'https://via.placeholder.com/40' },
  { id: 2, name: 'Tinte Koleston Rojo Intenso', price: 'S/ 25.00', category: 'Tintes', categoryColor: 'bg-pink-500/20 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400', stock: 6, status: true, image: 'https://via.placeholder.com/40' },
  { id: 3, name: 'Máquina Cortadora Wahl', price: 'S/ 180.00', category: 'Herramientas', categoryColor: 'bg-gray-300 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300', stock: 3, status: true, image: 'https://via.placeholder.com/40' },
  { id: 4, name: 'Secadora Profesional Remington', price: 'S/ 120.00', category: 'Herramientas', categoryColor: 'bg-gray-300 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300', stock: 4, status: true, image: 'https://via.placeholder.com/40' },
  { id: 5, name: 'Aceite Reparador Argán', price: 'S/ 35.00', category: 'Tratamientos', categoryColor: 'bg-green-500/20 text-green-600 dark:bg-green-900/30 dark:text-green-400', stock: 8, status: true, image: 'https://via.placeholder.com/40' },
  { id: 6, name: 'Gel Fijador Extra Fuerte', price: 'S/ 18.00', category: 'Styling', categoryColor: 'bg-purple-500/20 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400', stock: 12, status: true, image: 'https://via.placeholder.com/40' },
  { id: 7, name: 'Cera Moldeadora Mate', price: 'S/ 22.00', category: 'Styling', categoryColor: 'bg-purple-500/20 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400', stock: 7, status: false, image: 'https://via.placeholder.com/40' },
  { id: 8, name: 'Acondicionador Hidratante', price: 'S/ 30.00', category: 'Cuidado capilar', categoryColor: 'bg-blue-500/20 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', stock: 5, status: true, image: 'https://via.placeholder.com/40' },
];

const ProductosTable = ({ filters, categoriaSeleccionada }) => {
  const [productos, setProductos] = useState(initialProductos);

  // MODALES
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [modalType, setModalType] = useState(null);

  // PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // FILTROS
  const filteredItems = useMemo(() => {
    return productos.filter((p) => {

      // FILTRO POR CATEGORÍA
      if (
        categoriaSeleccionada &&
        categoriaSeleccionada.nombre !== 'Todos'
      ) {
        if (p.categoria_id !== categoriaSeleccionada.id) {
          return false;
        }
      }

      // SEARCH
      if (
        filters.search &&
        !p.name.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // STOCK
      if (filters.stock === 'out' && p.stock !== 0) {
        return false;
      }

      if (
        filters.stock === 'low' &&
        !(p.stock >= 1 && p.stock <= 10)
      ) {
        return false;
      }

      if (
        filters.stock === 'medium' &&
        !(p.stock >= 11 && p.stock <= 50)
      ) {
        return false;
      }

      if (
        filters.stock === 'high' &&
        !(p.stock > 50)
      ) {
        return false;
      }

      // PRECIO
      const precioNumerico = parseFloat(
        p.price.replace(/[^\d.]/g, '')
      );

      if (filters.price === '0-50' && precioNumerico > 50) {
        return false;
      }

      if (
        filters.price === '50-150' &&
        !(precioNumerico > 50 && precioNumerico <= 150)
      ) {
        return false;
      }

      if (
        filters.price === '150-300' &&
        !(precioNumerico > 150 && precioNumerico <= 300)
      ) {
        return false;
      }

      if (
        filters.price === '300+' &&
        !(precioNumerico > 300)
      ) {
        return false;
      }

      // STATUS
      if (
        filters.status !== '' &&
        p.status.toString() !== filters.status
      ) {
        return false;
      }

      return true;
    });
  }, [productos, filters, categoriaSeleccionada]);

  // PAGINACIÓN
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // CERRAR MODAL
  const closeModal = () => {
    setSelectedProducto(null);
    setModalType(null);
  };

  // CAMBIAR STATUS
  const toggleStatus = (id) => {
    setProductos(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, status: !p.status }
          : p
      )
    );
  };

  // EDITAR
  const handleEditSubmit = (updatedData) => {
    setProductos(prev =>
      prev.map(p =>
        p.id === selectedProducto.id
          ? { ...p, ...updatedData }
          : p
      )
    );

    closeModal();
  };

  // ELIMINAR
  const handleDelete = (id) => {
    setProductos(prev =>
      prev.filter(p => p.id !== id)
    );

    closeModal();

    if (currentItems.length === 1 && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };
  return (
    <div className="w-full text-gray-800 dark:text-gray-300 font-sans">
      <div className="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#111111] shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-gray-800">
              <th className="px-6 py-4">Producto</th>
              <th className="px-6 py-4 text-center">Precio</th>
              <th className="px-6 py-4 text-center">Categoría</th>
              <th className="px-6 py-4 text-center">Stock</th>
              <th className="px-6 py-4 text-center">Estado</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {currentItems.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.03] transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover border border-gray-200 dark:border-gray-700" />
                    <span className="text-sm font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center text-sm font-semibold">{p.price}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded text-xs font-medium ${p.categoryColor}`}>
                    {p.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-sm">{p.stock}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => toggleStatus(p.id)} className={`w-10 h-5 flex items-center rounded-full p-1 transition ${p.status ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                      <div className={`bg-white w-3 h-3 rounded-full shadow transform transition ${p.status ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                    <span className="text-xs w-12 text-left">{p.status ? 'Activo' : 'Inactivo'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => { setSelectedProducto(p); setModalType('view'); }} className="p-2 border border-blue-500/30 rounded-lg text-blue-500 hover:bg-blue-500 transition"><Eye size={16} /></button>
                    <button onClick={() => { setSelectedProducto(p); setModalType('edit'); }} className="p-2 border border-yellow-500/30 rounded-lg text-yellow-500 hover:bg-yellow-500 transition hover:text-black"><Pencil size={16} /></button>
                    <button onClick={() => { setSelectedProducto(p); setModalType('delete'); }} className="p-2 border border-red-500/30 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                  No se encontraron servicios con estos filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINACIÓN */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/50">
          <p className="text-xs text-gray-500 font-bold uppercase">Total: {filteredItems.length} resultados</p>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="p-2 rounded border dark:border-zinc-700 disabled:opacity-20"><ChevronLeft size={18}/></button>
            <span className="flex items-center text-sm font-bold px-3">{currentPage} / {totalPages || 1}</span>
            <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="p-2 rounded border dark:border-zinc-700 disabled:opacity-20"><ChevronRight size={18}/></button>
          </div>
        </div>
      </div>

      {/* MODALES */}
      <FormularioVer 
        isOpen={modalType === 'view'} 
        onClose={closeModal} 
        producto={selectedProducto} 
      />
      
      <FormularioEditar 
        isOpen={modalType === 'edit'} 
        onClose={closeModal} 
        producto={selectedProducto}
        onSubmit={handleEditSubmit}
      />

      {/* MODAL DE ELIMINACIÓN */}
      {modalType === 'delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f0f0f] w-full max-w-sm rounded-2xl p-6 border border-red-500/20 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">¿Eliminar producto?</h3>
              <p className="text-gray-500 text-sm mb-6">
                Esta acción no se puede deshacer. El producto <span className="text-gray-800 dark:text-white font-bold italic">"{selectedProducto?.name}"</span> será borrado.
              </p>
              <div className="flex gap-3 w-full">
                <button onClick={closeModal} className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-zinc-800 font-semibold hover:bg-gray-200 dark:hover:bg-zinc-700 transition">
                  Cancelar
                </button>
                <button onClick={() => handleDelete(selectedProducto.id)} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-500 transition">
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductosTable;