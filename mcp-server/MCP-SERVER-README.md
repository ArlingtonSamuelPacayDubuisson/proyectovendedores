# 🤖 MCP Server - Marketplace con IA

Servidor de herramientas (MCP - Model Context Protocol) que permite a agentes de IA interactuar con tu plataforma de marketplace.

## 📁 Estructura del Proyecto

```
tu-proyecto/
├── backend/              # API del marketplace
├── frontend/             # Interfaz de usuario
├── mcp-server/          # 🆕 Servidor MCP para agentes IA
│   ├── index.js         # Servidor principal
│   └── package.json     # Dependencias
├── Dockerfile.mcp       # Docker para MCP Server
├── .env.mcp.example     # Variables de entorno ejemplo
└── docker-compose.yml   # Orquestación de servicios
```

## 🚀 Instalación Rápida

### 1. Organizar los archivos descargados:

```bash
# Crear carpeta mcp-server
mkdir mcp-server

# Mover archivos a sus ubicaciones
mv index.js mcp-server/
mv package.json mcp-server/
# Dockerfile.mcp y .env.mcp.example van en la raíz
```

### 2. Crear archivo .env para MCP Server:

```bash
cp .env.mcp.example .env.mcp
```

### 3. Iniciar todos los servicios:

```bash
docker-compose up -d
```

## 🌐 Puertos de los Servicios

| Servicio | Puerto | URL |
|----------|--------|-----|
| Backend API | 3000 | http://localhost:3000 |
| Frontend | 3001 | http://localhost:3001 |
| **MCP Server** | **3002** | **http://localhost:3002** |
| PostgreSQL | 5432 | localhost:5432 |

## 🛠️ Herramientas Disponibles del MCP Server

### 1. **Buscar Vendedores Cercanos**
```bash
POST http://localhost:3002/tools/find-nearby-sellers
Content-Type: application/json

{
  "latitude": 14.6349,
  "longitude": -90.5069,
  "radius": 5
}
```

### 2. **Consultar Productos Disponibles**
```bash
POST http://localhost:3002/tools/get-available-products
Content-Type: application/json

{
  "category": "electronics",
  "min_price": 10,
  "max_price": 500,
  "limit": 20
}
```

### 3. **Filtrar por Categoría**
```bash
POST http://localhost:3002/tools/filter-by-category
Content-Type: application/json

{
  "category": "electronics"
}
```

### 4. **Obtener Estadísticas**
```bash
GET http://localhost:3002/tools/get-statistics
```

### 5. **Sugerir Ubicaciones Óptimas**
```bash
POST http://localhost:3002/tools/suggest-optimal-locations
Content-Type: application/json

{
  "seller_id": 1
}
```

### 6. **Analizar Zonas Activas**
```bash
GET http://localhost:3002/tools/analyze-active-zones?time_range=30%20days
```

## 📚 Ver Documentación de Herramientas

```bash
GET http://localhost:3002/tools
```

Esto te mostrará todas las herramientas disponibles con su documentación.

## 🔍 Verificar Estado del Servidor

```bash
GET http://localhost:3002/health
```

## 🧪 Probar con cURL

```bash
# Buscar vendedores cercanos
curl -X POST http://localhost:3002/tools/find-nearby-sellers \
  -H "Content-Type: application/json" \
  -d '{"latitude": 14.6349, "longitude": -90.5069, "radius": 5}'

# Ver estadísticas
curl http://localhost:3002/tools/get-statistics
```

## 🤖 Integración con Claude u Otros Agentes IA

Los agentes de IA pueden hacer peticiones HTTP a estas herramientas para:
- Buscar productos
- Encontrar vendedores cercanos
- Analizar estadísticas
- Recomendar ubicaciones óptimas
- Y más...

Ejemplo de uso con un agente:
```
Usuario: "Encuentra vendedores de electrónicos cerca de Ciudad de Guatemala"

Agente IA hace:
POST /tools/find-nearby-sellers con lat/lng de Guatemala
Luego: POST /tools/get-available-products con category="electronics"

Agente responde: "Encontré 5 vendedores cerca tuyo con 23 productos..."
```

## 🐛 Solución de Problemas

### Ver logs del MCP Server:
```bash
docker-compose logs -f mcp-server
```

### Reiniciar solo el MCP Server:
```bash
docker-compose restart mcp-server
```

### Reconstruir si cambiaste código:
```bash
docker-compose up -d --build mcp-server
```

## 📊 Monitoreo

El MCP Server incluye logging automático de todas las peticiones y errores.

## 🔐 Seguridad

En producción, considera:
- Agregar autenticación API
- Limitar rate limiting
- Configurar CORS específicamente
- Usar variables de entorno seguras

## 📝 Notas Importantes

- El MCP Server se conecta a la misma base de datos que el backend
- No modifica datos, solo consulta (excepto las estadísticas)
- Es completamente independiente del backend REST
- Los agentes IA lo usan como "herramientas" para obtener información

## 🎯 Próximos Pasos

1. ✅ Levantar los servicios con `docker-compose up -d`
2. ✅ Verificar que funciona: `curl http://localhost:3002/health`
3. ✅ Ver herramientas disponibles: `curl http://localhost:3002/tools`
4. ✅ Probar una herramienta
5. 🚀 Integrar con tu agente IA favorito (Claude, GPT, etc.)

---

¿Preguntas? El MCP Server está listo para potenciar tu marketplace con IA! 🎉
