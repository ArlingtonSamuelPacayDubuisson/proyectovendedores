# 🚀 INICIO RÁPIDO - VENDEDORES AMBULANTES

## ⚡ Opción 1: Script Automático (RECOMENDADO)

### Windows PowerShell:
```powershell
.\start-project.ps1
```

Este script hará todo automáticamente:
- ✅ Verifica Docker
- ✅ Levanta Backend y MongoDB
- ✅ Pobla la base de datos
- ✅ Instala dependencias del frontend
- ✅ Abre el frontend en nueva terminal

---

## 🔧 Opción 2: Manual (Paso a Paso)

### Terminal 1 - Backend:
```bash
# 1. Levantar servicios
docker-compose up -d

# 2. Poblar base de datos
docker-compose exec backend node src/seed.js

# 3. Verificar que funciona
curl http://localhost:5000/api/health
```

### Terminal 2 - Frontend:
```bash
# 1. Ir a carpeta frontend
cd frontend

# 2. Instalar dependencias (solo la primera vez)
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Abrir navegador en http://localhost:3000
```

---

## 📍 URLs del Proyecto

| Servicio | URL | Descripción |
|----------|-----|-------------|
| 🌐 **Frontend** | http://localhost:3000 | Aplicación web |
| 🔌 **Backend API** | http://localhost:5000/api | API REST |
| 🗄️ **MongoDB** | mongodb://localhost:27017 | Base de datos |
| 🤖 **MCP Server** | http://localhost:3002 | Herramientas IA |

---

## 👤 Credenciales de Prueba

### Vendedores (pueden gestionar productos):
| Email | Password | Negocio |
|-------|----------|---------|
| maria@test.com | 123456 | Frutas Frescas María |
| carlos@test.com | 123456 | Verduras Don Carlos |
| ana@test.com | 123456 | Comidas Doña Ana |

### Comprador (solo puede ver):
| Email | Password |
|-------|----------|
| juan@test.com | 123456 |

---

## ✨ Funcionalidades Principales

### 🗺️ **Mapa Interactivo**
- Vista de mapa con OpenStreetMap (Leaflet)
- Marcadores de vendedores (verde = disponible, rojo = no disponible)
- Click en marcador para ver detalles
- Búsqueda por geolocalización (📍 Buscar Cercanos)

### 🔍 **Filtros**
- Filtrar por categoría (Frutas, Verduras, Comidas, etc.)
- Toggle entre vista de lista y mapa
- Ver todos los vendedores o solo cercanos

### 🛒 **Dashboard de Vendedor**
- Ver estado de disponibilidad
- Toggle disponible/no disponible
- Actualizar ubicación GPS
- Gestionar productos (CRUD completo)
- Ver estadísticas

### 📦 **Gestión de Productos**
- Crear nuevos productos
- Editar productos existentes
- Eliminar productos
- Establecer precio, stock, categoría
- Marcar como disponible/no disponible

---

## 🎯 Flujo de Prueba Recomendado

### 1️⃣ **Como Visitante (sin login)**
```
1. Abrir http://localhost:3000
2. Ver vendedores en la página principal
3. Click en "🗺️ Mapa" para ver el mapa
4. Click en un marcador para ver detalles
5. Filtrar por categoría (Frutas, Verduras, etc.)
6. Click en "📍 Buscar Cercanos" (permitir ubicación)
```

### 2️⃣ **Como Vendedor**
```
1. Click en "Iniciar Sesión"
2. Email: maria@test.com | Password: 123456
3. Ir al Dashboard
4. Ver estado de disponibilidad
5. Click en "Marcar No Disponible" para cambiar estado
6. Click en "📍 Actualizar Ubicación"
7. Click en "+ Agregar Producto"
8. Llenar formulario y guardar
9. Editar o eliminar productos existentes
```

### 3️⃣ **Verificar cambios en tiempo real**
```
1. Abrir dos ventanas del navegador
2. Ventana 1: Dashboard del vendedor
3. Ventana 2: Página principal (sin login)
4. Cambiar disponibilidad en Dashboard
5. Recargar página principal
6. Ver cómo cambia el marcador en el mapa
```

---

## 🐛 Solución de Problemas Comunes

### ❌ "Cannot connect to Docker daemon"
```bash
# Inicia Docker Desktop y espera a que esté listo
```

### ❌ "Port 5000 is already in use"
```bash
# Detén el servicio que usa el puerto
docker-compose down
# O cambia el puerto en docker-compose.yml
```

### ❌ "Module not found" en frontend
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### ❌ Mapa no se muestra
```bash
# Verifica que Leaflet CSS esté importado en index.css
# Limpia cache del navegador (Ctrl+Shift+R)
```

### ❌ Backend no responde
```bash
# Ver logs del backend
docker-compose logs -f backend

# Reiniciar backend
docker-compose restart backend
```

---

## 📊 Estado del Proyecto

```
Backend:           ████████████████████ 100%
Base de Datos:     ████████████████████ 100%
Frontend:          ████████████████████ 100%
Autenticación:     ████████████████████ 100%
Geolocalización:   ████████████████████ 100%
CRUD Productos:    ████████████████████ 100%
Mapas Interactivos: ████████████████████ 100%
MCP Server:        ██████████░░░░░░░░░░  50%
PWA:               ░░░░░░░░░░░░░░░░░░░░   0%
Despliegue:        ░░░░░░░░░░░░░░░░░░░░   0%

TOTAL: 90% COMPLETO ✅
```

---

## 📚 Documentación Completa

Para más detalles, consulta:
- `GUIA-COMPLETA-FRONTEND.md` - Guía detallada del frontend
- `CHECKLIST-PROGRESO.md` - Lista de tareas y progreso
- `README.md` - Documentación completa del proyecto

---

## 🛠️ Comandos Útiles

```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f backend

# Reiniciar un servicio
docker-compose restart backend

# Detener todo
docker-compose down

# Detener y eliminar volúmenes (datos)
docker-compose down -v

# Reconstruir una imagen
docker-compose build --no-cache backend

# Ejecutar comandos dentro de un contenedor
docker-compose exec backend node src/seed.js
```

---

## 🎉 ¡Listo para Usar!

Si sigues estos pasos, tendrás:
- ✅ Backend funcionando con API REST
- ✅ Base de datos MongoDB con datos de prueba
- ✅ Frontend React con mapas interactivos
- ✅ Sistema de autenticación completo
- ✅ Geolocalización en tiempo real
- ✅ CRUD de productos funcional

**¡Disfruta tu proyecto! 🚀**
