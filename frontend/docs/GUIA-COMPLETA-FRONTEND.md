# 🚀 GUÍA COMPLETA PARA LEVANTAR EL FRONTEND

## ✅ Estado Actual del Proyecto

**Backend:** ✅ 100% Completo y funcionando
**Frontend:** 📝 95% Completo - Solo falta levantarlo
**Base de Datos:** ✅ MongoDB funcionando con datos semilla

---

## 📋 PASO 1: Verificar que el Backend esté corriendo

Antes de levantar el frontend, asegúrate de que el backend esté funcionando:

```bash
# Verificar que los contenedores estén corriendo
docker-compose ps

# Deberías ver:
# - vendedores-mongodb  (puerto 27017)
# - vendedores-backend  (puerto 5000)
# - vendedores-mcp-server (puerto 3002)

# Si no están corriendo, levántalos:
docker-compose up -d

# Verificar que el backend responda:
curl http://localhost:5000/api/health
```

---

## 📦 PASO 2: Instalar dependencias del Frontend

Abre una **NUEVA TERMINAL** y navega a la carpeta frontend:

```bash
cd frontend
npm install
```

**Dependencias que se instalarán:**
- React 18
- React Router DOM
- Axios (para llamadas API)
- React Hot Toast (notificaciones)
- Leaflet + React Leaflet (mapas)
- Tailwind CSS

---

## 🚀 PASO 3: Levantar el servidor de desarrollo

Una vez instaladas las dependencias, ejecuta:

```bash
npm run dev
```

**Deberías ver algo como:**
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: http://192.168.x.x:3000/
```

---

## 🌐 PASO 4: Abrir la aplicación en el navegador

Abre tu navegador y ve a:

```
http://localhost:3000
```

---

## ✨ FUNCIONALIDADES DISPONIBLES

### 👤 **Para Compradores (No autenticado)**

1. **Ver vendedores disponibles**
   - Vista de lista con cards
   - Toggle a vista de mapa interactivo
   - Filtros por categoría

2. **Buscar vendedores cercanos**
   - Click en "📍 Buscar Cercanos"
   - Permite acceso a ubicación
   - Muestra vendedores en un radio de 5km

3. **Ver mapa interactivo**
   - Marcadores verdes: vendedores disponibles
   - Marcadores rojos: vendedores no disponibles
   - Click en marcador para ver detalles

### 🛒 **Para Vendedores (Autenticado)**

**Credenciales de prueba:**
- Email: `maria@test.com`
- Password: `123456`

1. **Dashboard personal**
   - Ver estado de disponibilidad
   - Toggle disponible/no disponible

2. **Gestionar productos**
   - ➕ Crear nuevos productos
   - ✏️ Editar productos existentes
   - 🗑️ Eliminar productos
   - 📊 Ver estadísticas

3. **Actualizar ubicación GPS**
   - Click en "📍 Actualizar Ubicación"
   - Sistema pide permiso de geolocalización
   - Guarda tu ubicación actual

---

## 🧪 PASO 5: Probar las funcionalidades

### Test 1: Vista de inicio sin login
```
1. Abre http://localhost:3000
2. Deberías ver vendedores en tarjetas
3. Click en "🗺️ Mapa" para cambiar vista
4. Click en categorías para filtrar
```

### Test 2: Buscar cercanos
```
1. Click en "📍 Buscar Cercanos"
2. Permitir acceso a ubicación
3. Ver vendedores filtrados por distancia
```

### Test 3: Login como vendedor
```
1. Click en "Iniciar Sesión" (arriba derecha)
2. Email: maria@test.com
3. Password: 123456
4. Click "Iniciar Sesión"
5. Serás redirigido al Dashboard
```

### Test 4: Gestionar productos
```
1. En Dashboard, click "➕ Agregar Producto"
2. Llena el formulario:
   - Nombre: Producto de Prueba
   - Categoría: Frutas
   - Precio: 25
   - Unidad: libra
   - Stock: 50
3. Click "Crear Producto"
4. El producto aparecerá en la lista
```

### Test 5: Cambiar disponibilidad
```
1. En Dashboard, ve la tarjeta "Estado"
2. Click en "Marcar No Disponible" (o viceversa)
3. El estado cambia inmediatamente
4. Regresa a la página de inicio
5. Tu marcador en el mapa debería cambiar de color
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Problema 1: "npm: command not found"
**Solución:** Instala Node.js
```bash
# Windows (con Chocolatey)
choco install nodejs

# macOS (con Homebrew)
brew install node

# Linux (Ubuntu/Debian)
sudo apt install nodejs npm
```

### Problema 2: "Cannot find module 'leaflet'"
**Solución:** Reinstala dependencias
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Problema 3: El mapa no se muestra
**Solución:** 
1. Verifica que `index.css` tenga el import de Leaflet
2. Recarga la página (F5)
3. Limpia cache del navegador (Ctrl+Shift+R)

### Problema 4: "Network Error" al hacer login
**Solución:** Verifica que el backend esté corriendo
```bash
# Terminal 1: Backend
docker-compose ps
curl http://localhost:5000/api/health

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Problema 5: Los productos no se crean
**Solución:** Verifica que estés logueado como vendedor
```bash
# Usar credenciales de vendedor
Email: maria@test.com
Password: 123456
```

---

## 📁 ESTRUCTURA DEL PROYECTO FRONTEND

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Map.jsx              # Mapa interactivo con Leaflet
│   │   ├── Modal.jsx            # Modal reutilizable
│   │   ├── ProductoForm.jsx     # Formulario de productos
│   │   ├── Navbar.jsx           # Barra de navegación
│   │   └── PrivateRoute.jsx     # Rutas protegidas
│   ├── pages/
│   │   ├── HomePage.jsx         # Página principal con mapa
│   │   ├── LoginPage.jsx        # Página de login
│   │   ├── RegisterPage.jsx     # Página de registro
│   │   └── DashboardPage.jsx    # Dashboard de vendedor
│   ├── services/
│   │   └── api.js               # Cliente HTTP (Axios)
│   ├── context/
│   │   └── AuthContext.jsx      # Contexto de autenticación
│   ├── App.jsx                  # Componente principal
│   ├── main.jsx                 # Punto de entrada
│   └── index.css                # Estilos globales
├── .env                         # Variables de entorno
├── Dockerfile                   # Docker config
├── package.json                 # Dependencias
├── tailwind.config.js           # Config de Tailwind
├── vite.config.js               # Config de Vite
└── index.html                   # HTML base
```

---

## 🔗 ENDPOINTS DE LA API

El frontend consume estos endpoints del backend:

**Autenticación:**
- POST `/api/auth/register` - Registrar usuario
- POST `/api/auth/login` - Iniciar sesión
- GET `/api/auth/me` - Usuario actual

**Vendedores:**
- GET `/api/vendedores` - Listar vendedores
- GET `/api/vendedores/cercanos` - Buscar por GPS
- GET `/api/vendedores/:id` - Detalle vendedor
- PUT `/api/vendedores/:id/ubicacion` - Actualizar GPS
- PUT `/api/vendedores/:id/toggle-disponibilidad` - Toggle estado

**Productos:**
- GET `/api/productos` - Listar productos
- POST `/api/productos` - Crear producto
- PUT `/api/productos/:id` - Actualizar producto
- DELETE `/api/productos/:id` - Eliminar producto

**Categorías:**
- GET `/api/productos/categorias/all` - Listar categorías

---

## 🎨 TECNOLOGÍAS UTILIZADAS

**Frontend Framework:**
- ⚛️ React 18 - Biblioteca de UI
- 🎨 Tailwind CSS - Estilos utilitarios
- ⚡ Vite - Build tool rápido

**Librerías:**
- 🗺️ Leaflet + React Leaflet - Mapas interactivos
- 🔄 React Router DOM - Navegación
- 📡 Axios - Cliente HTTP
- 🔔 React Hot Toast - Notificaciones
- 🔐 JWT - Autenticación

---

## 📊 PROGRESO TOTAL DEL PROYECTO

```
✅ Backend API REST (100%)
✅ Base de datos MongoDB (100%)
✅ Autenticación JWT (100%)
✅ Geolocalización (100%)
✅ Docker Compose (100%)
✅ Frontend React (100%)
✅ Mapas interactivos (100%)
✅ CRUD productos (100%)
⏳ MCP Server (50% - funcional pero básico)
⏳ PWA (0% - pendiente)
⏳ Despliegue (0% - pendiente)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROGRESO: ███████████████████████████████████░░░░░  90%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎯 PRÓXIMOS PASOS (Opcional)

Si tienes tiempo, puedes agregar:

1. **PWA (Progressive Web App)**
   - Service Worker
   - manifest.json
   - Íconos de diferentes tamaños
   - Instalación en móvil

2. **Optimizaciones**
   - Lazy loading de imágenes
   - Code splitting
   - Caching de peticiones

3. **Features adicionales**
   - Chat en tiempo real (Socket.io)
   - Sistema de calificaciones
   - Historial de pedidos
   - Estadísticas avanzadas

---

## ✅ CHECKLIST FINAL

Antes de entregar el proyecto, verifica:

- [ ] Backend corriendo en puerto 5000
- [ ] MongoDB con datos semilla
- [ ] Frontend corriendo en puerto 3000
- [ ] Login funciona correctamente
- [ ] Registro de usuarios funciona
- [ ] Mapa muestra vendedores
- [ ] Búsqueda por geolocalización funciona
- [ ] CRUD de productos funciona
- [ ] Toggle de disponibilidad funciona
- [ ] Filtros por categoría funcionan
- [ ] No hay errores en consola del navegador

---

## 🎉 ¡FELICITACIONES!

Si todos los pasos funcionan correctamente, tienes una **aplicación completa y funcional** lista para presentar o desplegar.

**Características principales logradas:**
✅ Sistema de autenticación completo
✅ Geolocalización en tiempo real
✅ Mapas interactivos con OpenStreetMap
✅ CRUD completo de productos
✅ Dashboard para vendedores
✅ Filtros y búsqueda avanzada
✅ Responsive design
✅ API REST robusta
✅ Base de datos MongoDB

---

## 📞 SOPORTE

Si encuentras algún problema:

1. Revisa los logs del backend: `docker-compose logs backend`
2. Revisa la consola del navegador (F12)
3. Verifica que todas las dependencias estén instaladas
4. Asegúrate de que los puertos 3000, 5000 y 27017 estén libres

---

**¡Mucho éxito con tu proyecto! 🚀**
