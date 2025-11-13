# Instrucciones para Corregir Error de Docker en Windows

## Problema Identificado

El error "Cannot find module 'express'" se debe a un **snapshot corrupto en la cache de Docker** durante la construcción de la imagen. Aunque `npm install` se ejecutó correctamente, las dependencias no se exportaron correctamente a la imagen final.

## Correcciones Aplicadas

✅ **package.json**: Se corrigieron las rutas en los scripts `start` y `dev` para usar `src/index.js`

## Pasos para Solucionar (Windows PowerShell)

Ejecuta estos comandos **uno por uno** en PowerShell como Administrador:

### 1. Detener y eliminar contenedores existentes
```powershell
docker-compose down -v
```

### 2. Limpiar la cache corrupta de Docker
```powershell
docker system prune -a -f
```

**⚠️ IMPORTANTE**: Este comando eliminará:
- Todas las imágenes no utilizadas
- Todas las redes no utilizadas
- La cache de build

### 3. Reconstruir la imagen sin cache
```powershell
docker-compose build --no-cache mcp-server
```

### 4. Levantar todos los servicios
```powershell
docker-compose up -d
```

### 5. Verificar los logs
```powershell
docker-compose logs -f mcp-server
```

**Deberías ver**:
```
✅ Conectado a MongoDB
🚀 MCP Server ejecutándose en 0.0.0.0:3002
📚 Documentación disponible en: http://localhost:3002/tools
💡 Herramientas disponibles para agentes IA
```

### 6. Verificar que el servidor esté funcionando
```powershell
curl http://localhost:3002/health
```

**Respuesta esperada**:
```json
{
  "status": "ok",
  "service": "MCP Server",
  "database": "connected",
  "timestamp": "2025-11-13T..."
}
```

## Alternativa: Script Todo-en-Uno (PowerShell)

Copia y pega este script completo en PowerShell:

```powershell
Write-Host "🧹 Deteniendo y eliminando contenedores..." -ForegroundColor Yellow
docker-compose down -v

Write-Host "🗑️ Limpiando cache de Docker..." -ForegroundColor Yellow
docker system prune -a -f

Write-Host "🏗️ Construyendo imagen desde cero (sin cache)..." -ForegroundColor Yellow
docker-compose build --no-cache mcp-server

Write-Host "🚀 Levantando contenedores..." -ForegroundColor Yellow
docker-compose up -d

Write-Host ""
Write-Host "✅ Verificando logs del MCP Server..." -ForegroundColor Green
docker-compose logs mcp-server

Write-Host ""
Write-Host "📊 Estado de los contenedores:" -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "🔍 Probando conectividad al servidor..." -ForegroundColor Cyan
Start-Sleep -Seconds 3
try {
    $response = Invoke-WebRequest -Uri http://localhost:3002/health -UseBasicParsing
    Write-Host "✅ Servidor funcionando correctamente!" -ForegroundColor Green
    Write-Host $response.Content
} catch {
    Write-Host "⚠️ El servidor aún no responde. Espera unos segundos e intenta:" -ForegroundColor Yellow
    Write-Host "   curl http://localhost:3002/health" -ForegroundColor White
}
```

## Solución de Problemas

### Si el error persiste después de la limpieza:

1. **Reinicia Docker Desktop**:
   - Clic derecho en el icono de Docker Desktop
   - Selecciona "Quit Docker Desktop"
   - Vuelve a abrir Docker Desktop
   - Espera a que inicie completamente

2. **Verifica que Docker Desktop tiene recursos suficientes**:
   - Abre Docker Desktop Settings
   - Ve a "Resources" → "Advanced"
   - Asegúrate de tener al menos:
     - Memory: 4GB
     - CPUs: 2
     - Disk: 20GB

3. **Limpieza completa de Docker** (⚠️ Elimina TODO):
   ```powershell
   docker system prune -a --volumes -f
   docker network prune -f
   docker volume prune -f
   ```

### Si aún falla la construcción:

Verifica que los archivos existan:
```powershell
# Verificar estructura del proyecto
Get-ChildItem -Path "mcp-server" -Recurse

# Debería mostrar:
# mcp-server/
# ├── package.json
# └── src/
#     └── index.js
```

## Cambios Realizados

### Antes (package.json):
```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

### Después (package.json):
```json
"scripts": {
  "start": "node src/index.js",
  "dev": "nodemon src/index.js"
}
```

Esta corrección asegura que el script apunte al archivo correcto dentro del contenedor Docker.

## Siguientes Pasos

Una vez que el servidor esté funcionando:

1. **Prueba las herramientas disponibles**:
   ```powershell
   curl http://localhost:3002/tools
   ```

2. **Verifica el estado de todos los servicios**:
   ```powershell
   docker-compose ps
   ```

3. **Revisa logs de otros servicios**:
   ```powershell
   docker-compose logs backend
   docker-compose logs mongodb
   ```

¿Necesitas ayuda adicional? 🚀
