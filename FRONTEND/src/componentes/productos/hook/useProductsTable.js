import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../../lib/supabase';

const useProductsTable = ({
  filters,
  categoriaSeleccionada,
  refresh
}) => {

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [categorias, setCategorias] = useState([]);

  /* =========================
     OBTENER PRODUCTOS
  ========================= */

  const obtenerProductos = async () => {

    const { data, error } = await supabase
      .from('producto')
      .select(`
        *,
        categorias (
          id,
          nombre
        )
      `);

    if (error) {
      console.log(error.message);
      return;
    }

    const productosFormateados = (data || []).map(product => ({
      ...product,
      categoria: product.categorias?.nombre || 'Sin categoría',
      categoryColor:
        'bg-cyan-500/20 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400'
    }));

    setProducts(productosFormateados);
  };

  /* =========================
     OBTENER CATEGORÍAS
  ========================= */

  const obtenerCategorias = async () => {

    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('tipo', 'producto');

    if (error) {
      console.error(error);
      return;
    }

    setCategorias(data);
  };

  useEffect(() => {
    obtenerProductos();
    obtenerCategorias();
  }, [refresh]);

  /* =========================
     FILTROS
  ========================= */

  const filteredProducts = useMemo(() => {

    return products.filter(product => {

      /* FILTRO CATEGORÍA */
      if (
        categoriaSeleccionada &&
        categoriaSeleccionada.nombre !== 'Todos'
      ) {
        if (product.categoria_id !== categoriaSeleccionada.id) {
          return false;
        }
      }

      /* FILTRO NOMBRE */
      if (
        filters.nombre &&
        !product.nombre
          .toLowerCase()
          .includes(filters.nombre.toLowerCase())
      ) {
        return false;
      }

      /* FILTRO STOCK */
      if (filters.stock) {

        const stock = Number(product.stock);

        switch (filters.stock) {

          case '0':
            if (stock !== 0)
              return false;
            break;

          case '1-10':
            if (!(stock >= 1 && stock <= 10))
              return false;
            break;

          case '11-50':
            if (!(stock >= 11 && stock <= 50))
              return false;
            break;

          case '51-100':
            if (!(stock >= 51 && stock <= 100))
              return false;
            break;

          case '100+':
            if (!(stock > 100))
              return false;
            break;
        }
      }

      /* FILTRO PRECIO */
      if (filters.precio) {

        const precio = Number(product.precio);

        switch (filters.precio) {

          case '0-20':
            if (!(precio >= 0 && precio <= 20))
              return false;
            break;

          case '20-50':
            if (!(precio > 20 && precio <= 50))
              return false;
            break;

          case '50-100':
            if (!(precio > 50 && precio <= 100))
              return false;
            break;

          case '100+':
            if (!(precio > 100))
              return false;
            break;
        }
      }

      /* FILTRO ESTADO */
      if (
        filters.estado !== '' &&
        product.estado.toString() !== filters.estado
      ) {
        return false;
      }

      return true;
    });

  }, [products, filters, categoriaSeleccionada]);

  /* =========================
     PAGINACIÓN
  ========================= */

  const itemsPerPage = 5;

  const totalPages = Math.ceil(
    filteredProducts.length / itemsPerPage
  );

  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* =========================
     CERRAR MODAL
  ========================= */

const closeModal = () => {
  setModalType(null);
  setSelectedProduct(null);
};

  /* =========================
     CAMBIAR ESTADO
  ========================= */

  const handleToggleStatus = async (id) => {

    const product = products.find(p => p.id === id);

    if (!product) return;

    const { error } = await supabase
      .from('producto')
      .update({
        estado: !product.estado
      })
      .eq('id', id);

    if (error) {
      console.error(error);
      return;
    }

    setProducts(prev =>
      prev.map(p =>
        p.id === id
          ? {
              ...p,
              estado: !p.estado
            }
          : p
      )
    );
  };

const handleDelete = async (id) => {
  try {
    // 1. Verificar si existe localmente
    const productoAEliminar = products.find(p => p.id === id);
    if (!productoAEliminar) {
      alert("No se encontró el producto localmente.");
      return;
    }

    // 2. Proceder directamente con el borrado físico.
    // El Trigger de la BD se activará al instante y creará el log 'Eliminado'.
    const { error: deleteError } = await supabase
      .from('producto')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    // 3. Actualizar la interfaz removiendo el producto de la lista visual
    setProducts(prev => prev.filter(p => p.id !== id));
    closeModal();

    if (currentItems.length === 1 && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }

    alert('Producto eliminado correctamente. Historial de auditoría generado automáticamente.');

  } catch (error) {
    console.error("Error crítico en el proceso de borrado:", error);
    alert("No se pudo eliminar el producto: " + error.message);
  }
};
  /* =========================
     ACTUALIZAR PRODUCTO
  ========================= */

  const handleUpdate = async (updatedData) => {

    let imagen_url = selectedProduct?.imagen_url;

    /* IMAGEN OBLIGATORIA */
    if (!updatedData.imagen && !imagen_url) {
      alert('La imagen del producto es obligatoria');
      return;
    }

    /* SUBIR NUEVA IMAGEN */
    if (updatedData.imagen) {

      const file = updatedData.imagen;

      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('productos')
        .upload(`productos/${fileName}`, file);

      if (uploadError) {
        console.error(uploadError);
        return;
      }

const { data } = supabase.storage
  .from('servicios')
  .getPublicUrl(`servicios/${fileName}`, {
    transform: {
      width: 500,  
      quality: 80, 
      format: 'origin', 
    },
  });
    }

    const datosActualizados = {
      nombre: updatedData.nombre,
      descripcion: updatedData.descripcion,
      precio: Number(updatedData.precio),
      stock: Number(updatedData.stock),
      categoria_id: updatedData.categoria_id,
      imagen_url
    };

    const { error } = await supabase
      .from('producto')
      .update(datosActualizados)
      .eq('id', selectedProduct.id);

    if (error) {
      console.error(error);
      return;
    }

    await obtenerProductos();

    closeModal();
  };

  return {
    products,
    categorias,
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
    handleUpdate,

    obtenerProductos
  };
};

export default useProductsTable;