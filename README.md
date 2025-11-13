# 🛒 Plataforma de Vendedores Ambulantes

Sistema de geolocalización y marketplace para vendedores ambulantes de Guatemala.

## 📋 Características

- 🗺️ Geolocalización en tiempo real de vendedores
- 🔐 Autenticación JWT
- 📱 Perfiles de vendedor y comprador
- 🛍️ Gestión de productos por categoría
- 📍 Búsqueda de vendedores cercanos
- 🔄 Toggle de disponibilidad
- 🤖 Servidor MCP para integración con IA

## 🚀 Tecnologías

- **Backend:** Node.js + Express + MongoDB
- **Frontend:** React + Vite + Tailwind CSS + Google Maps
- **Mobile:** PWA
- **MCP Server:** Node.js + @modelcontextprotocol/sdk
- **Infraestructura:** Docker + Docker Compose

## 📦 Estructura del Proyecto

```
proyecto-vendedores/
├── backend/              # API REST
├── frontend/             # Aplicación web React
├── mcp-server/           # Servidor MCP
└── docker-compose.yml    # Orquestación de servicios
```

## 🔧 Instalación y Configuración

### Prerrequisitos

- Docker y Docker Compose instalados
- Node.js 20+ (para desarrollo local sin Docker)
- Git

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd proyecto-vendedores
```

### 2. Configurar variables de entorno

**Backend (.env en /backend/):**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/vendedores_db?authSource=admin
JWT_SECRET=tu_secreto_super_seguro_cambialo_en_produccion
JWT_EXPIRE=7d
```

**Frontend (.env en /frontend/):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=TU_API_KEY_DE_GOOGLE_MAPS
```

### 3. Obtener API Key de Google Maps

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto nuevo
3. Habilita "Maps JavaScript API" y "Geocoding API"
4. Crea credenciales (API Key)
5. Copia la API Key al archivo `.env` del frontend

### 4. Levantar los servicios con Docker

```bash
# Construir e iniciar todos los servicios
docker-compose up --build

# En modo detached (segundo plano)
docker-compose up -d --build
```

Los servicios estarán disponibles en:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **MCP Server:** http://localhost:3001
- **MongoDB:** localhost:27017

### 5. Poblar la base de datos con datos de prueba

```bash
# Ejecutar el script de seeds dentro del contenedor
docker-compose exec backend node src/seed.js

# O si estás corriendo localmente
cd backend
npm run seed
```

## 👥 Usuarios de Prueba

Después de ejecutar el seed, puedes usar estas credenciales:

| Email | Contraseña | Rol |
|-------|-----------|-----|
| juan@test.com | 123456 | Comprador |
| maria@test.com | 123456 | Vendedor (Frutas) |
| carlos@test.com | 123456 | Vendedor (Verduras) |
| ana@test.com | 123456 | Vendedor (Comida) |

## 📡 API Endpoints

### Autenticación
```
POST   /api/auth/register     - Registrar usuario
POST   /api/auth/login        - Iniciar sesión
GET    /api/auth/me           - Obtener usuario actual (requiere token)
```

### Vendedores
```
GET    /api/vendedores                      - Obtener todos los vendedores
GET    /api/vendedores/cercanos             - Buscar vendedores cercanos
GET    /api/vendedores/:id                  - Obtener vendedor por ID
PUT    /api/vendedores/:id                  - Actualizar vendedor
PUT    /api/vendedores/:id/ubicacion        - Actualizar ubicación
PUT    /api/vendedores/:id/toggle-disponibilidad - Cambiar disponibilidad
```

### Productos
```
GET    /api/productos                  - Obtener todos los productos
GET    /api/productos/:id              - Obtener producto por ID
POST   /api/productos                  - Crear producto (vendedor)
PUT    /api/productos/:id              - Actualizar producto (vendedor)
DELETE /api/productos/:id              - Eliminar producto (vendedor)
GET    /api/productos/categoria/:id   - Productos por categoría
GET    /api/productos/categorias/all  - Obtener todas las categorías
```

## 🧪 Ejemplos de Uso

### Buscar vendedores cercanos

```bash
curl "http://localhost:5000/api/vendedores/cercanos?longitude=-90.5069&latitude=14.6349&maxDistance=5000"
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@test.com","password":"123456"}'
```

### Actualizar ubicación (requiere token)
```bash
curl -X PUT http://localhost:5000/api/vendedores/:id/ubicacion \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{"longitude":-90.5100,"latitude":14.6300}'
```

## 🛠️ Comandos Útiles

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (limpia la BD)
docker-compose down -v

# Reiniciar un servicio
docker-compose restart backend

# Entrar a la shell de un contenedor
docker-compose exec backend sh
docker-compose exec mongodb mongosh
```

## 📱 Desarrollo Local (sin Docker)

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔐 Seguridad

- Las contraseñas se encriptan con bcrypt
- Autenticación JWT con tokens que expiran
- Validación de roles (vendedor, comprador, admin)
- Middleware de protección de rutas
- CORS configurado

## 🌐 Despliegue

### Opciones recomendadas:

**Backend:**
- Railway
- Render
- Heroku

**Frontend:**
- Vercel
- Netlify

**Base de Datos:**
- MongoDB Atlas (gratis)
- Railway

## 📝 Próximas Mejoras

- [ ] Sistema de calificaciones y reseñas
- [ ] Chat en tiempo real entre comprador y vendedor
- [ ] Notificaciones push
- [ ] Sistema de pagos
- [ ] Análisis de ventas
- [ ] App móvil nativa (React Native)

## 👨‍💻 Autor

Proyecto académico - Universidad Mariano Gálvez
Curso: Desarrollo Web

## 📄 Licencia

MIT
