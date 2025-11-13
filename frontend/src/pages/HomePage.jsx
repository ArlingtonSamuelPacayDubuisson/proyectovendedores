import { useState, useEffect } from 'react';
import { vendedoresAPI, categoriasAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Map } from '../components/Map';
import toast from 'react-hot-toast';

export const HomePage = () => {
  const [vendedores, setVendedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([14.6349, -90.5069]); // Guatemala City
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'map'
  const { isAuthenticated, isVendedor } = useAuth();

  useEffect(() => {
    loadData();
    getUserLocation();
  }, []);

  const loadData = async () => {
    try {
      const [vendedoresRes, categoriasRes] = await Promise.all([
        vendedoresAPI.getAll(),
        categoriasAPI.getAll()
      ]);
      
      setVendedores(vendedoresRes.data.data || []);
      setCategorias(categoriasRes.data.data || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar información');
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = [position.coords.latitude, position.coords.longitude];
          setUserLocation(location);
          setMapCenter(location);
        },
        (error) => {
          console.log('No se pudo obtener la ubicación:', error);
        }
      );
    }
  };

  const buscarCercanos = async () => {
    if (!userLocation) {
      toast.error('No se pudo obtener tu ubicación');
      return;
    }

    try {
      setLoading(true);
      const { data } = await vendedoresAPI.getCercanos(
        userLocation[1], // longitude
        userLocation[0], // latitude
        5000 // 5km
      );
      setVendedores(data.data || []);
      toast.success(`${data.count} vendedores encontrados cerca de ti`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al buscar vendedores cercanos');
    } finally {
      setLoading(false);
    }
  };

  const filteredVendedores = selectedCategoria
    ? vendedores.filter(v => 
        v.productos?.some(p => p.categoria === selectedCategoria)
      )
    : vendedores;

  const handleMarkerClick = (vendedor) => {
    // Scroll to the vendor card
    const element = document.getElementById(`vendedor-${vendedor._id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-4', 'ring-primary-500');
      setTimeout(() => {
        element.classList.remove('ring-4', 'ring-primary-500');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🛒 Vendedores Ambulantes Guatemala
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Encuentra vendedores cerca de ti y apoya la economía local
            </p>
            
            {!isAuthenticated && (
              <div className="flex justify-center space-x-4">
                <Link to="/register" className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Únete Ahora
                </Link>
                <Link to="/login" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                  Iniciar Sesión
                </Link>
              </div>
            )}

            {isAuthenticated && isVendedor && (
              <Link to="/dashboard" className="inline-block bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Ir a Mi Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Category Filters */}
            <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto">
              <button
                onClick={() => setSelectedCategoria(null)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                  !selectedCategoria
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Todos
              </button>
              {categorias.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategoria(cat._id)}
                  className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                    selectedCategoria === cat._id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {cat.icono} {cat.nombre}
                </button>
              ))}
            </div>

            {/* View Mode Toggle and Location Button */}
            <div className="flex items-center space-x-4">
              {userLocation && (
                <button
                  onClick={buscarCercanos}
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>📍</span>
                  <span>Buscar Cercanos</span>
                </button>
              )}
              
              <div className="flex bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white shadow text-primary-600'
                      : 'text-gray-600'
                  }`}
                >
                  📋 Lista
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    viewMode === 'map'
                      ? 'bg-white shadow text-primary-600'
                      : 'text-gray-600'
                  }`}
                >
                  🗺️ Mapa
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            {selectedCategoria
              ? `${categorias.find(c => c._id === selectedCategoria)?.nombre || 'Categoría'}`
              : 'Vendedores Disponibles'}
          </h2>
          <span className="text-gray-600">
            {filteredVendedores.length} vendedor{filteredVendedores.length !== 1 ? 'es' : ''}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : viewMode === 'map' ? (
          /* Map View */
          <div className="h-[600px] rounded-lg overflow-hidden shadow-lg">
            <Map 
              vendedores={filteredVendedores}
              center={mapCenter}
              zoom={13}
              onMarkerClick={handleMarkerClick}
            />
          </div>
        ) : filteredVendedores.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No hay vendedores disponibles</p>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendedores.map((vendedor) => (
              <div 
                key={vendedor._id} 
                id={`vendedor-${vendedor._id}`}
                className="card hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold flex-shrink-0">
                    {vendedor.nombreNegocio?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {vendedor.nombreNegocio}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {vendedor.descripcion || 'Sin descripción'}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        vendedor.disponible 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {vendedor.disponible ? '✓ Disponible' : '✗ No disponible'}
                      </span>
                      {vendedor.verificado && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          ✓ Verificado
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        📦 {vendedor.productos?.length || 0} productos
                      </span>
                      {vendedor.calificacion > 0 && (
                        <span className="text-yellow-600 font-medium">
                          ⭐ {vendedor.calificacion.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
