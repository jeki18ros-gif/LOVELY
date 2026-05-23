import React, { useState, useEffect } from 'react';
import {
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

import FormularioVer from './formularios/formularioVer';
import FormularioEditar from './formularios/formularioEditar';
import useProductsTable from './hook/useProductsTable';

const ProductTable = ({
  filters,
  categoriaSeleccionada,
  refresh,
  categorias
}) => {

  const {
    selectedProduct,
    modalType,
    currentPage,
    setSelectedProduct,
    setModalType,
    setCurrentPage,
    filteredProducts,
    currentItems,
    totalPages,
    closeModal,
    handleToggleStatus,
    handleDelete,
    handleUpdate
  } = useProductsTable({
    filters,
    categoriaSeleccionada,
    refresh
  });

  return (
    <div className="w-full text-gray-800 dark:text-gray-300 font-sans p-4">
      {/* CONTENEDOR PRINCIPAL: Bordes hiper redondeados, sombras pesadas y color de fondo unificado */}
      <div className="w-full overflow-hidden rounded-3xl border border-amber-500/20 bg-white dark:bg-[#0b0b0b] shadow-2xl">

        {/* TABLA RESPONSIVE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {/* HEADER: Fondo dorado semitransparente, texto estilizado en alta definición */}
              <tr className="text-amber-700 dark:text-amber-400 text-xs uppercase tracking-wider border-b border-amber-500/20 bg-amber-500/10">
                <th className="px-6 py-4 text-center font-bold">Imagen</th>
                <th className="px-6 py-4 font-bold">Producto</th>
                <th className="px-6 py-4 text-center font-bold">Precio</th>
                <th className="px-6 py-4 text-center font-bold">Stock</th>
                <th className="px-6 py-4 text-center font-bold">Categoría</th>
                <th className="px-6 py-4 text-center font-bold">Estado</th>
                <th className="px-6 py-4 text-center font-bold">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-amber-500/10">
              {currentItems.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-amber-500/10 transition-colors duration-150"
                >

                  {/* Imagen del Producto */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <img
                        src={product.imagen_url}
                        alt={product.nombre}
                        className="w-14 h-14 rounded-2xl object-cover border border-amber-500/20 shadow-sm"
                      />
                    </div>
                  </td>

                  {/* Nombre del Producto */}
                  <td className="px-6 py-4 text-sm font-semibold text-black dark:text-gray-100">
                    {product.nombre}
                  </td>

                  {/* Precio Formateado en PEN */}
                  <td className="px-6 py-4 text-sm text-center font-bold text-amber-600 dark:text-amber-400">
                    {new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(product.precio || 0)}
                  </td>

                  {/* Stock Estilizado */}
                  <td className="px-6 py-4 text-sm text-center">
                    <span
                      className={`
                        px-3 py-1 rounded-xl text-xs font-bold border
                        ${
                          product.stock > 10
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400'
                            : product.stock > 0
                            ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                            : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
                        }
                      `}
                    >
                      {product.stock} unds
                    </span>
                  </td>

                  {/* Categoría (Badge tipo píldora de lujo) */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-bold border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 ${product.categoryColor}`}
                    >
                      {product.categoria}
                    </span>
                  </td>

                  {/* Estado (Toggle switch de Amber a Gris) */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(product.id)}
                        className={`w-10 h-5 flex items-center rounded-full p-1 transition-all duration-300 cursor-pointer ${
                          product.estado ? 'bg-amber-500' : 'bg-gray-300 dark:bg-zinc-800'
                        }`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ${
                            product.estado ? 'translate-x-5 bg-black' : 'translate-x-0 bg-white'
                          }`}
                        />
                      </button>

                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-12 text-left">
                        {product.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </td>

                  {/* Botones de Acción Estilizados */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => { setSelectedProduct(product); setModalType('view'); }}
                        className="p-2 border border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-black transition duration-200"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() => { setSelectedProduct(product); setModalType('edit'); }}
                        className="p-2 border border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-black transition duration-200"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => { setSelectedProduct(product); setModalType('delete'); }}
                        className="p-2 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-600 hover:text-white transition duration-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {currentItems.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-gray-500 font-medium"
                  >
                    No se encontraron productos con estos filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-amber-500/10 bg-amber-500/[0.01] dark:bg-zinc-900/20">
          <p className="text-xs text-amber-700 dark:text-amber-500/60 uppercase tracking-widest font-bold">
            Total: {filteredProducts.length} resultados
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-amber-500/10 text-amber-600 dark:text-amber-400 disabled:opacity-20 hover:bg-amber-500/10 transition"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-sm font-mono font-bold px-2 text-black dark:text-white">
              {currentPage} / {totalPages || 1}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-amber-500/10 text-amber-600 dark:text-amber-400 disabled:opacity-20 hover:bg-amber-500/10 transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* --- MODALES --- */}
      <FormularioVer
        key={selectedProduct?.id}
        isOpen={modalType === 'view'}
        onClose={closeModal}
        product={selectedProduct}
      />

      <FormularioEditar
        isOpen={modalType === 'edit'}
        onClose={closeModal}
        product={selectedProduct}
        onSubmit={handleUpdate}
        categorias={categorias}
      />

      {/* CONFIRMACIÓN DE ELIMINACIÓN */}
      {modalType === 'delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0f0f0f] w-full max-w-sm rounded-3xl p-6 border border-red-500/20 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4">
                <AlertTriangle size={32} />
              </div>

              <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                ¿Eliminar producto?
              </h3>

              <p className="text-gray-500 text-sm mb-6 px-2">
                Esta acción es irreversible. El producto{' '}
                <span className="text-amber-600 dark:text-amber-400 font-bold italic">
                  "{selectedProduct?.nombre}"
                </span>{' '}
                será removido permanentemente.
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={closeModal}
                  className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-zinc-800 font-bold text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
                >
                  Cancelar
                </button>

                <button
                  onClick={() => handleDelete(selectedProduct.id)}
                  className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-500 shadow-lg shadow-red-600/10 transition"
                >
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

export default ProductTable;