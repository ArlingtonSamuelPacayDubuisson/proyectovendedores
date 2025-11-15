# ✅ CHECKLIST VISUAL - INICIAR PROYECTO

## 📋 VERIFICACIÓN PREVIA

Antes de empezar, verifica que tengas instalado:

```
□ Docker Desktop
□ Node.js (v18 o superior)
□ npm (v9 o superior)
□ Terminal/PowerShell
□ Navegador web moderno
```

**Verificar instalación:**
```bash
docker --version    # Debe mostrar Docker version X.X.X
node --version      # Debe mostrar v18.X.X o superior
npm --version       # Debe mostrar 9.X.X o superior
```

---

## 🚀 PASOS PARA INICIAR (Opción Automática)

### ⚡ Usando el Script PowerShell:

```
Step 1: □ Abrir PowerShell en la carpeta del proyecto
Step 2: □ Ejecutar: .\start-project.ps1
Step 3: □ Esperar a que se complete (2-3 minutos)
Step 4: □ Cuando pregunte sobre poblar BD, escribir 'S' y Enter
Step 5: □ Cuando pregunte sobre abrir frontend, escribir 'S' y Enter
Step 6: □ Abrir navegador en http://localhost:3000
Step 7: □ ¡Listo! 🎉
```

---

## 🔧 PASOS PARA INICIAR (Opción Manual)

### Terminal 1 - Backend y Base de Datos:

```bash
□ Paso 1: Verificar que Docker esté corriendo
   docker info

□ Paso 2: Levantar servicios
   docker-compose up -d

□ Paso 3: Esperar 10-15 segundos

□ Paso 4: Poblar base de datos
   docker-compose exec backend node src/seed.js

□ Paso 5: Verificar que el backend funcione
   curl http://localhost:5000/api/health
   
   Debes ver: {"success":true,"message":"API funcionando correctamente"}
```

### Terminal 2 - Frontend:

```bash
□ Paso 6: Ir a la carpeta frontend
   cd frontend

□ Paso 7: Instalar dependencias (solo primera vez)
   npm install
   
   Esperar 1-2 minutos

□ Paso 8: Iniciar servidor de desarrollo
   npm run dev

□ Paso 9: Esperar a ver:
   ➜  Local:   http://localhost:3000/

□ Paso 10: Abrir navegador en http://localhost:3000
```

---

## 🧪 VERIFICACIÓN DE FUNCIONALIDADES

### ✅ Test 1: Página Principal

```
□ Abrir http://localhost:3000
□ Debe mostrar "Vendedores Ambulantes Guatemala"
□ Debe haber 3 tarjetas de vendedores
□ Debe haber botones de categorías (Frutas, Verduras, etc.)
□ Debe haber botón "🗺️ Mapa"
```

### ✅ Test 2: Vista de Mapa

```
□ Click en botón "🗺️ Mapa"
□ Debe mostrarse un mapa de OpenStreetMap
□ Debe haber 3 marcadores (2 verdes, 1 rojo)
□ Click en un marcador verde
□ Debe aparecer popup con información del vendedor
```

### ✅ Test 3: Filtros

```
□ Click en "Frutas" en los filtros
□ Debe mostrar solo vendedores con frutas
□ Click en "Todos"
□ Debe mostrar todos los vendedores nuevamente
```

### ✅ Test 4: Buscar Cercanos (Requiere permitir ubicación)

```
□ Click en "📍 Buscar Cercanos"
□ Navegador pide permiso de ubicación
□ Click en "Permitir"
□ Debe mostrar vendedores ordenados por distancia
□ Toast de notificación: "X vendedores encontrados cerca de ti"
```

### ✅ Test 5: Login como Vendedor

```
□ Click en "Iniciar Sesión" (arriba derecha)
□ Ingresar email: maria@test.com
□ Ingresar password: 123456
□ Click en "Iniciar Sesión"
□ Debe redirigir a Dashboard
□ Debe aparecer "Bienvenido, María López"
```

### ✅ Test 6: Dashboard de Vendedor

```
□ Verificar que aparezcan 4 tarjetas:
   □ Estado (Disponible/No disponible)
   □ Productos (número total)
   □ Calificación (estrellas)
   □ Ubicación GPS

□ Verificar sección "Mi Negocio"
   □ Debe mostrar "Frutas Frescas María"
   
□ Verificar lista de productos
   □ Debe haber al menos 3 productos
```

### ✅ Test 7: Cambiar Disponibilidad

```
□ En tarjeta "Estado", click en "Marcar No Disponible"
□ Estado debe cambiar a "✗ No disponible"
□ Toast de notificación: "Ahora estás NO disponible"
□ Abrir http://localhost:3000 en otra pestaña
□ Tu marcador en el mapa debe ser ROJO
```

### ✅ Test 8: Actualizar Ubicación GPS

```
□ En tarjeta "Ubicación GPS", click en "📍 Actualizar Ubicación"
□ Navegador pide permiso de ubicación
□ Click en "Permitir"
□ Toast: "Ubicación actualizada correctamente"
```

### ✅ Test 9: Crear Producto

```
□ Click en "+ Agregar Producto"
□ Debe abrirse un modal
□ Llenar formulario:
   Nombre: Manzanas Premium
   Categoría: Frutas
   Precio: 25
   Unidad: libra
   Stock: 50
   Marcar checkbox "Producto disponible"
□ Click en "Crear Producto"
□ Modal debe cerrarse
□ Producto debe aparecer en la lista
□ Toast: "Producto creado exitosamente"
```

### ✅ Test 10: Editar Producto

```
□ En la lista de productos, buscar "Manzanas Premium"
□ Click en botón "Editar"
□ Debe abrirse modal con datos precargados
□ Cambiar precio a: 20
□ Click en "Actualizar Producto"
□ Modal debe cerrarse
□ Precio debe actualizarse en la lista
□ Toast: "Producto actualizado exitosamente"
```

### ✅ Test 11: Eliminar Producto

```
□ En la lista de productos, buscar "Manzanas Premium"
□ Click en botón "Eliminar"
□ Debe aparecer confirmación: "¿Estás seguro de eliminar?"
□ Click en "Aceptar"
□ Producto debe desaparecer de la lista
□ Toast: "Producto eliminado"
```

### ✅ Test 12: Cerrar Sesión

```
□ Click en "Salir" (arriba derecha)
□ Debe redirigir a página principal
□ Toast: "Sesión cerrada"
□ No debe mostrar "Mi Dashboard" en navbar
```

---

## 🔍 VERIFICACIÓN DE SERVICIOS

### Backend API:

```bash
□ curl http://localhost:5000/api/health
   Respuesta esperada: {"success":true,...}

□ curl http://localhost:5000/api/vendedores
   Respuesta esperada: {"success":true,"count":3,...}

□ curl http://localhost:5000/api/productos
   Respuesta esperada: {"success":true,"count":8,...}
```

### Base de Datos:

```bash
□ docker-compose exec mongodb mongosh
   Debe conectarse a MongoDB shell

□ use vendedores_db
   Debe cambiar a la base de datos

□ db.users.countDocuments()
   Debe mostrar: 4

□ db.vendedores.countDocuments()
   Debe mostrar: 3

□ db.productos.countDocuments()
   Debe mostrar: 8
```

### MCP Server (Opcional):

```bash
□ curl http://localhost:3002/health
   Respuesta esperada: {"status":"ok",...}

□ curl http://localhost:3002/tools
   Respuesta esperada: Lista de herramientas disponibles
```

---

## 📊 CHECKLIST DE ESTADO

### Backend: ✅ 100%
```
✅ API REST funcionando
✅ MongoDB conectada
✅ Datos semilla cargados
✅ Autenticación JWT operativa
✅ Geolocalización funcionando
✅ 15+ endpoints disponibles
```

### Frontend: ✅ 100%
```
✅ Página principal
✅ Login/Registro
✅ Dashboard de vendedor
✅ Mapa interactivo
✅ CRUD de productos
✅ Filtros por categoría
✅ Búsqueda por GPS
✅ Notificaciones toast
✅ Diseño responsive
```

### Geolocalización: ✅ 100%
```
✅ Búsqueda por coordenadas
✅ Marcadores en mapa
✅ Actualización de ubicación
✅ Cálculo de distancia
✅ Radio de búsqueda (5km)
```

---

## 🐛 LISTA DE PROBLEMAS COMUNES

```
□ Si Docker no inicia:
   → Abrir Docker Desktop y esperar

□ Si puerto 5000 ocupado:
   → docker-compose down
   → Verificar con: netstat -ano | findstr :5000

□ Si "Module not found" en frontend:
   → cd frontend
   → rm -rf node_modules
   → npm install

□ Si el mapa no se muestra:
   → Verificar en index.css: @import 'leaflet/dist/leaflet.css';
   → Limpiar cache: Ctrl+Shift+R

□ Si backend no responde:
   → docker-compose logs backend
   → docker-compose restart backend

□ Si no aparecen vendedores:
   → docker-compose exec backend node src/seed.js
   → Verificar: curl http://localhost:5000/api/vendedores
```

---

## 📝 NOTAS FINALES

### Credenciales para Testing:

```
Vendedor 1: maria@test.com / 123456
Vendedor 2: carlos@test.com / 123456
Vendedor 3: ana@test.com / 123456
Comprador:  juan@test.com / 123456
```

### URLs Importantes:

```
Frontend:    http://localhost:3000
Backend:     http://localhost:5000/api
MongoDB:     mongodb://localhost:27017
MCP Server:  http://localhost:3002
```

### Comandos Útiles:

```bash
# Ver logs
docker-compose logs -f backend

# Reiniciar servicios
docker-compose restart

# Detener todo
docker-compose down

# Reconstruir
docker-compose build --no-cache

# Estado de contenedores
docker-compose ps
```

---

## ✅ CHECKLIST FINAL ANTES DE ENTREGAR

```
□ Backend levantado y respondiendo
□ Frontend corriendo sin errores
□ Login funciona correctamente
□ Dashboard de vendedor accesible
□ Mapa muestra vendedores
□ Búsqueda por GPS funciona
□ CRUD de productos operativo
□ No hay errores en consola del navegador
□ No hay errores en logs de Docker
□ Documentación completa disponible
```

---

## 🎉 ¡PROYECTO COMPLETO!

Si todos los checks están marcados:
✅ Tu proyecto está **LISTO** para:
- Demo
- Presentación
- Testing
- Despliegue (con algunas modificaciones)

**Estado: 90% COMPLETO** 🚀

¡Felicitaciones! 🎊
