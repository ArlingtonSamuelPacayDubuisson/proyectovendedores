#!/bin/bash

# Script para reconstruir el contenedor MCP Server limpiamente

echo "🧹 Deteniendo y eliminando contenedores..."
docker-compose down -v

echo "🗑️ Limpiando cache de Docker..."
docker system prune -f

echo "🏗️ Construyendo imagen desde cero (sin cache)..."
docker-compose build --no-cache mcp-server

echo "🚀 Levantando contenedores..."
docker-compose up -d

echo "✅ Verificando logs del MCP Server..."
docker-compose logs mcp-server

echo ""
echo "📊 Estado de los contenedores:"
docker-compose ps

echo ""
echo "🔍 Si no hay errores, el servidor debería estar corriendo en el puerto 3002"
echo "   Prueba: curl http://localhost:3002/health"
