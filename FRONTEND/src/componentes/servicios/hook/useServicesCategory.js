import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

const useServicesCategory = (onCategoriaChange) => {

  const [categorias, setCategorias] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newCat, setNewCat] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const obtenerCategorias = async () => {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('tipo', 'servicio');
    if (error) {
      console.error(error);
      return;}
    const categoriasFormateadas = [
      {
        id: 0,
        nombre: 'Todos',
        cantidad: 0,
        activo: true
      },
      ...data.map(cat => ({
        ...cat,
        cantidad: 0,
        activo: false
      }))];
    setCategorias(categoriasFormateadas);};
  const obtenerCantidadPorCategoria = async () => {
    const { data, error } = await supabase
      .from('servicio')
      .select('categoria_id');
    if (error) {
      console.error(error);
      return;}
    const conteo = {};
    data.forEach(item => {
      conteo[item.categoria_id] =
        (conteo[item.categoria_id] || 0) + 1;});
    setCategorias(prev =>
      prev.map(cat => ({
        ...cat,
        cantidad:
          cat.id === 0
            ? data.length
            : conteo[cat.id] || 0})));};
  const cargarTodo = async () => {
    await obtenerCategorias();
    setTimeout(() => {
      obtenerCantidadPorCategoria();
    }, 100);};
  useEffect(() => {
    cargarTodo();
  }, []);
  const handleSave = async () => {
    if (!newCat.trim()) return;
    if (editIndex !== null) {
      const categoria = categorias[editIndex];
      const { error } = await supabase
        .from('categorias')
        .update({
          nombre: newCat
        })
        .eq('id', categoria.id);
      if (error) {
        console.error(error);
        return;}
      setCategorias(prev =>
        prev.map((cat, i) =>
          i === editIndex
            ? { ...cat, nombre: newCat }
            : cat));
    } else {
      const { data, error } = await supabase
        .from('categorias')
        .insert([
          {
            nombre: newCat,
            tipo: 'servicio'
          }])
        .select();
      if (error) {
        console.error(error);
        return;}
      setCategorias(prev => [
        ...prev,
        {
          ...data[0],
          cantidad: 0,
          activo: false
        }]);}
    setNewCat('');
    setShowForm(false);
    setEditIndex(null);
    await obtenerCantidadPorCategoria();};
  const handleCancel = () => {
    setShowForm(false);
    setEditIndex(null);
    setNewCat('');};
  const handleEdit = (index) => {
    setNewCat(categorias[index].nombre);
    setEditIndex(index);
    setShowForm(true);
    setMenuOpen(null);};
  const handleDelete = async (index) => {
    const categoria = categorias[index];
    const { count } = await supabase
      .from('servicio')
      .select('*', {
        count: 'exact',
        head: true})
      .eq('categoria_id', categoria.id);
    if (count > 0) {
      alert('No puedes eliminar una categoría con servicios');
      return;}
    const { error } = await supabase
      .from('categorias')
      .delete()
      .eq('id', categoria.id);
    if (error) {
      console.error(error);
      return;}
    setCategorias(prev =>
      prev.filter((_, i) => i !== index));};
  const seleccionarCategoria = (index) => {
    const updated = categorias.map((c, i) => ({
      ...c,
      activo: i === index}));
    setCategorias(updated);
    const categoriaSeleccionada = updated[index];
    onCategoriaChange(categoriaSeleccionada);};
  return {
    categorias,showForm,setShowForm,newCat,setNewCat,editIndex,setEditIndex,menuOpen,
setMenuOpen,handleSave,handleCancel,handleEdit,handleDelete,seleccionarCategoria
  };};

export default useServicesCategory;