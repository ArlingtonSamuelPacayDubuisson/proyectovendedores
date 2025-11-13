import { useState, useEffect } from 'react';
import { productosAPI, categoriasAPI } from '../services/api';
import toast from 'react-hot-toast';

export const ProductoForm = ({ producto, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    descripcion: '',
    precio: '',
    unidad: 'unidad',
    stock: '',
    disponible: true,
  });
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(true);

  useEffect(() => {
    loadCategorias();
    if (producto) {
      setFormData({
        nombre: producto.nombre || '',
        categoria: producto.categoria?._id || producto.categoria || '',
        descripcion: producto.descripcion || '',
        precio: producto.precio || '',
        unidad: producto.unidad || 'unidad',
        stock: producto.stock || '',
        disponible: producto.disponible !== undefined ? producto.disponible : true,
      });
    }
  }, [producto]);

  const loadCategorias = async () => {
    try {
      const { data } = await categoriasAPI.getAll();
      setCategorias(data.data || []);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      toast.error('Error al cargar categorías');
    } finally {
      setLoadingCategorias(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.categoria || !formData.precio) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: formData.stock ? parseFloat(formData.stock) : 0,
      };

      if (producto) {
        // Actualizar
        await productosAPI.update(producto._id, dataToSend);
        toast.success('Producto actualizado exitosamente');
      } else {
        // Crear
        await productosAPI.create(dataToSend);
        toast.success('Producto creado exitosamente');
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error:', error);
      const message = error.response?.data?.message || 'Error al guardar el producto';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingCategorias) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombre */}
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del Producto *
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          required
          value={formData.nombre}
          onChange={handleChange}
          className="input-field"
          placeholder="Ej: Manzanas Rojas"
        />
      </div>

      {/* Categoría */}
      <div>
        <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
          Categoría *
        </label>
        <select
          id="categoria"
          name="categoria"
          required
          value={formData.categoria}
          onChange={handleChange}
          className="input-field"
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.icono} {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={3}
          value={formData.descripcion}
          onChange={handleChange}
          className="input-field"
          placeholder="Describe tu producto..."
        />
      </div>

      {/* Precio y Unidad */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">
            Precio (Q) *
          </label>
          <input
            type="number"
            id="precio"
            name="precio"
            required
            min="0"
            step="0.01"
            value={formData.precio}
            onChange={handleChange}
            className="input-field"
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="unidad" className="block text-sm font-medium text-gray-700 mb-1">
            Unidad *
          </label>
          <select
            id="unidad"
            name="unidad"
            required
            value={formData.unidad}
            onChange={handleChange}
            className="input-field"
          >
            <option value="unidad">Unidad</option>
            <option value="kg">Kilogramo (kg)</option>
            <option value="libra">Libra</option>
            <option value="docena">Docena</option>
            <option value="caja">Caja</option>
            <option value="bolsa">Bolsa</option>
            <option value="litro">Litro</option>
          </select>
        </div>
      </div>

      {/* Stock */}
      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
          Stock Disponible
        </label>
        <input
          type="number"
          id="stock"
          name="stock"
          min="0"
          step="0.01"
          value={formData.stock}
          onChange={handleChange}
          className="input-field"
          placeholder="0"
        />
      </div>

      {/* Disponible */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="disponible"
          name="disponible"
          checked={formData.disponible}
          onChange={handleChange}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="disponible" className="ml-2 block text-sm text-gray-900">
          Producto disponible para la venta
        </label>
      </div>

      {/* Buttons */}
      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 btn-primary disabled:opacity-50"
        >
          {loading ? 'Guardando...' : producto ? 'Actualizar Producto' : 'Crear Producto'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 btn-secondary"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};
