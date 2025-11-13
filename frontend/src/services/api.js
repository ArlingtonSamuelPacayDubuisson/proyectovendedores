import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== AUTH ==========
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// ========== VENDEDORES ==========
export const vendedoresAPI = {
  getAll: () => api.get('/vendedores'),
  getById: (id) => api.get(`/vendedores/${id}`),
  getCercanos: (longitude, latitude, maxDistance = 5000) => 
    api.get('/vendedores/cercanos', { 
      params: { longitude, latitude, maxDistance } 
    }),
  update: (id, data) => api.put(`/vendedores/${id}`, data),
  updateUbicacion: (id, longitude, latitude) =>
    api.put(`/vendedores/${id}/ubicacion`, { longitude, latitude }),
  toggleDisponibilidad: (id) => api.put(`/vendedores/${id}/toggle-disponibilidad`),
};

// ========== PRODUCTOS ==========
export const productosAPI = {
  getAll: (filters = {}) => api.get('/productos', { params: filters }),
  getById: (id) => api.get(`/productos/${id}`),
  create: (data) => api.post('/productos', data),
  update: (id, data) => api.put(`/productos/${id}`, data),
  delete: (id) => api.delete(`/productos/${id}`),
  getPorCategoria: (categoriaId) => api.get(`/productos/categoria/${categoriaId}`),
};

// ========== CATEGORIAS ==========
export const categoriasAPI = {
  getAll: () => api.get('/productos/categorias/all'),
};

export default api;
