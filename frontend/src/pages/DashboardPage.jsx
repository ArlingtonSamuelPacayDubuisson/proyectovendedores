import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { vendedoresAPI, productosAPI } from '../services/api';
import { Modal } from '../components/Modal';
import { ProductoForm } from '../components/ProductoForm';
import toast from 'react-hot-toast';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [vendedor, setVendedor] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productoToEdit, setProductoToEdit] = useState(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      if (user?.vendedorId) {
        const { data: vendedorData } = await vendedoresAPI.getById(user.vendedorId);
        setVendedor(vendedorData.data);

        const { data: productosData } = await productosAPI.getAll({ 
          vendedor: user.vendedorId 
        });
        setProductos(productosData.data || []);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar información');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDisponibilidad = async () => {
    try {
      await vendedoresAPI.toggleDisponibilidad(user.vendedorId);
      setVendedor(prev => ({
        ...prev,
        disponible: !prev.disponible
      }));
      toast.success(vendedor.disponible ? 'Ahora estás NO disponible' : 'Ahora estás disponible');
    } catch (error) {
      toast.error('Error al cambiar disponibilidad');
    }
  };

  const handleActualizarUbicacion = async () => {
    if (!navigator.geolocation) {
      toast.error('Tu navegador no soporta geolocalización');
      return;
    }

    const toastId = toast.loading('Obteniendo tu ubicación...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await vendedoresAPI.updateUbicacion(
            user.vendedorId,
            position.coords.longitude,
            position.coords.latitude
          );
          toast.success('Ubicación actualizada correctamente', { id: toastId });
          loadData();
        } catch (error) {
          toast.error('Error al actualizar ubicación', { id: toastId });
        }
      },
      (error) => {
        toast.error('No se pudo obtener tu ubicación', { id: toastId });
      }
    );
  };

  const handleOpenModal = (producto = null) => {
    setProductoToEdit(producto);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductoToEdit(null);
  };

  const handleProductoSuccess = () => {
    handleCloseModal();
    loadData();
  };

  const handleDeleteProducto = async (productoId) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) {
      return;
    }

    try {
      await productosAPI.delete(productoId);
      toast.success('Producto eliminado');
      loadData();
    } catch (error) {
      toast.error('Error al eliminar producto');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const productosDisponibles = productos.filter(p => p.disponible).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mi Dashboard
          </h1>
          <p className="text-gray-600">
            Bienvenido, {user?.nombre}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Disponibilidad Card */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Estado</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                vendedor?.disponible 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {vendedor?.disponible ? '✓ Disponible' : '✗ No disponible'}
              </span>
            </div>
            <button
              onClick={handleToggleDisponibilidad}
              className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                vendedor?.disponible
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {vendedor?.disponible ? 'Marcar No Disponible' : 'Marcar Disponible'}
            </button>
          </div>

          {/* Productos Card */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Productos</h3>
            <p className="text-4xl font-bold text-primary-600 mb-2">
              {productos.length}
            </p>
            <p className="text-sm text-gray-600">
              {productosDisponibles} disponibles
            </p>
          </div>

          {/* Calificación Card */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Calificación</h3>
            <p className="text-4xl font-bold text-yellow-500 mb-2">
              {vendedor?.calificacion?.toFixed(1) || '0.0'}
            </p>
            <p className="text-sm text-gray-600">
              ⭐ {vendedor?.totalCalificaciones || 0} reseñas
            </p>
          </div>

          {/* Ubicación Card */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ubicación GPS</h3>
            <button
              onClick={handleActualizarUbicacion}
              className="w-full btn-primary text-sm"
            >
              📍 Actualizar Ubicación
            </button>
            {vendedor?.ubicacionActual && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Última actualización: {new Date(vendedor.updatedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Info del Negocio */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Mi Negocio</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-600">Nombre del Negocio:</span>
              <p className="text-lg font-semibold text-gray-900">{vendedor?.nombreNegocio}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Descripción:</span>
              <p className="text-gray-900">{vendedor?.descripcion || 'Sin descripción'}</p>
            </div>
            {vendedor?.verificado && (
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  ✓ Verificado
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Lista de Productos */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mis Productos</h2>
            <button 
              onClick={() => handleOpenModal()}
              className="btn-primary"
            >
              + Agregar Producto
            </button>
          </div>

          {productos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-600 text-lg mb-4">
                No tienes productos aún
              </p>
              <button 
                onClick={() => handleOpenModal()}
                className="btn-primary"
              >
                Crear tu primer producto
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productos.map((producto) => (
                <div 
                  key={producto._id} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 flex-1">{producto.nombre}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                      producto.disponible 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {producto.disponible ? 'Disponible' : 'No disponible'}
                    </span>
                  </div>

                  {producto.categoria && (
                    <p className="text-xs text-gray-500 mb-2">
                      {producto.categoria.icono} {producto.categoria.nombre}
                    </p>
                  )}

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {producto.descripcion || 'Sin descripción'}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-primary-600">
                      Q{producto.precio.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">
                      / {producto.unidad}
                    </span>
                  </div>

                  {producto.stock !== undefined && (
                    <p className="text-xs text-gray-500 mb-3">
                      Stock: {producto.stock} {producto.unidad}
                    </p>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOpenModal(producto)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProducto(producto._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded-lg transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Producto */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={productoToEdit ? 'Editar Producto' : 'Nuevo Producto'}
        size="md"
      >
        <ProductoForm
          producto={productoToEdit}
          onSuccess={handleProductoSuccess}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};
