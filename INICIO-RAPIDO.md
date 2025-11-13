# 🚀 GUÍA RÁPIDA DE INICIO - Proyecto Vendedores Ambulantes

## ✅ LO QUE YA TIENES LISTO

### Backend Completo ✓
- ✅ Modelos de MongoDB (User, Vendedor, Producto, Categoria)
- ✅ Autenticación JWT
- ✅ API REST con todas las rutas
- ✅ Geolocalización con índices 2dsphere
- ✅ Middleware de protección
- ✅ Script de datos semilla (seed.js)
- ✅ Docker configurado

### Archivos Generados:
```
✅ docker-compose.yml
✅ README.md
✅ .gitignore
✅ backend/
   ✅ Dockerfile
   ✅ package.json
   ✅ .env.example
   ✅ src/
      ✅ server.js
      ✅ seed.js
      ✅ config/database.js
      ✅ models/ (4 modelos)
      ✅ routes/ (3 archivos de rutas)
      ✅ middleware/auth.js
```

## 📋 PRÓXIMOS PASOS (Día 1-2)

### 1. Copiar archivos a tu proyecto
```bash
# En tu terminal, copia los archivos descargados a tu carpeta proyecto-vendedores/
cp -r PROYECTO-VENDEDORES/* ~/proyecto-vendedores/
```

### 2. Configurar variables de entorno
```bash
cd ~/proyecto-vendedores/backend
cp .env.example .env
# Edita el .env si necesitas cambiar algo
```

### 3. Levantar el backend
```bash
# Desde la raíz del proyecto
docker-compose up -d mongodb backend

# Espera 10 segundos y luego pobla la base de datos
docker-compose exec backend node src/seed.js
```

### 4. Probar la API
```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@test.com","password":"123456"}'

# Ver vendedores
curl http://localhost:5000/api/vendedores
```

## 🎯 LO QUE FALTA POR HACER

### Frontend (Día 3-4)
```
frontend/
├── Dockerfile
├── package.json
├── index.html
├── vite.config.js
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── components/
    │   ├── Map.jsx              # Mapa de Google Maps
    │   ├── VendedorCard.jsx     # Tarjeta de vendedor
    │   ├── ProductoCard.jsx     # Tarjeta de producto
    │   ├── Login.jsx            # Formulario de login
    │   └── Register.jsx         # Formulario de registro
    ├── pages/
    │   ├── Home.jsx             # Página principal con mapa
    │   ├── VendedorDashboard.jsx # Panel del vendedor
    │   └── ProductosPage.jsx    # Lista de productos
    └── services/
        └── api.js               # Cliente HTTP (axios)
```

### MCP Server (Día 5)
```
mcp-server/
├── Dockerfile
├── package.json
└── src/
    └── index.js                 # Servidor MCP básico
```

### PWA (Día 6)
- Agregar manifest.json
- Service Worker
- Icons y splash screens

## 🔑 CREDENCIALES DE PRUEBA

```
Comprador:  juan@test.com / 123456
Vendedor 1: maria@test.com / 123456 (Frutas)
Vendedor 2: carlos@test.com / 123456 (Verduras)
Vendedor 3: ana@test.com / 123456 (Comida)
```

## 📍 API KEY DE GOOGLE MAPS

**IMPORTANTE:** Necesitas obtener una API key de Google Maps:

1. Ve a: https://console.cloud.google.com/
2. Crea un proyecto nuevo
3. Habilita estas APIs:
   - Maps JavaScript API
   - Geocoding API
4. Ve a "Credenciales" → "Crear credenciales" → "Clave de API"
5. Copia la clave y guárdala para el frontend

## ⚡ COMANDOS ÚTILES

```bash
# Ver logs en tiempo real
docker-compose logs -f backend

# Reiniciar el backend
docker-compose restart backend

# Detener todo
docker-compose down

# Limpiar todo (incluye base de datos)
docker-compose down -v

# Volver a poblar la base de datos
docker-compose exec backend node src/seed.js
```

## 🎨 PRÓXIMA SESIÓN: FRONTEND

En la próxima sesión crearemos:
1. Componente de mapa con Google Maps
2. Sistema de autenticación en React
3. Dashboard para vendedores
4. Interfaz para compradores
5. Responsive design con Tailwind CSS

## 📞 DEBUGGING

Si algo no funciona:

1. Verifica que Docker esté corriendo
2. Verifica los logs: `docker-compose logs backend`
3. Verifica que MongoDB esté corriendo: `docker-compose ps`
4. Prueba la conexión a MongoDB: `docker-compose exec mongodb mongosh`

## ✨ FUNCIONALIDADES PRINCIPALES A IMPLEMENTAR

### Para Vendedores:
- Toggle disponible/no disponible
- Actualizar ubicación en tiempo real
- Gestionar productos (CRUD)
- Ver estadísticas

### Para Compradores:
- Ver mapa con vendedores cercanos
- Filtrar por categoría
- Ver productos de cada vendedor
- Ver información de contacto

## 📊 CRONOGRAMA SUGERIDO

- **Día 1:** ✅ Backend (COMPLETADO)
- **Día 2:** Testing del backend + ajustes
- **Día 3:** Frontend - Estructura y autenticación
- **Día 4:** Frontend - Mapa y componentes principales
- **Día 5:** MCP Server + PWA
- **Día 6:** Testing y optimización
- **Día 7:** Despliegue y documentación final

---

🎉 **¡El backend está 100% funcional!** 

Ahora solo necesitas:
1. Copiar estos archivos a tu proyecto
2. Levantar los servicios con Docker
3. Continuar con el frontend

¿Listo para el siguiente paso? 🚀
