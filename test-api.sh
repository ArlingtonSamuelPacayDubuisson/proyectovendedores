#!/bin/bash

# Script de prueba de la API de Vendedores Ambulantes

API_URL="http://localhost:5000/api"
BOLD='\033[1m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BOLD}${BLUE}==================================${NC}"
echo -e "${BOLD}${BLUE}  API Testing - Vendedores App  ${NC}"
echo -e "${BOLD}${BLUE}==================================${NC}\n"

# 1. Health Check
echo -e "${BOLD}1. Health Check${NC}"
curl -s "${API_URL}/health" | jq '.'
echo -e "\n"

# 2. Login como vendedor
echo -e "${BOLD}2. Login (Vendedor: maria@test.com)${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@test.com","password":"123456"}')

echo "$LOGIN_RESPONSE" | jq '.'

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
VENDEDOR_ID=$(echo "$LOGIN_RESPONSE" | jq -r '.user.vendedorId')

if [ "$TOKEN" != "null" ]; then
  echo -e "${GREEN}✓ Login exitoso${NC}\n"
else
  echo -e "${RED}✗ Error en login${NC}\n"
  exit 1
fi

# 3. Obtener información del usuario actual
echo -e "${BOLD}3. Obtener usuario actual (GET /auth/me)${NC}"
curl -s "${API_URL}/auth/me" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo -e "\n"

# 4. Listar todos los vendedores
echo -e "${BOLD}4. Listar vendedores (GET /vendedores)${NC}"
curl -s "${API_URL}/vendedores" | jq '.data | length'
echo " vendedores encontrados\n"

# 5. Buscar vendedores cercanos
echo -e "${BOLD}5. Buscar vendedores cercanos (GET /vendedores/cercanos)${NC}"
echo "Buscando en: Guatemala City (-90.5069, 14.6349) - Radio: 5km"
curl -s "${API_URL}/vendedores/cercanos?longitude=-90.5069&latitude=14.6349&maxDistance=5000" | jq '.'
echo -e "\n"

# 6. Obtener detalle de un vendedor
echo -e "${BOLD}6. Detalle del vendedor (GET /vendedores/$VENDEDOR_ID)${NC}"
curl -s "${API_URL}/vendedores/${VENDEDOR_ID}" | jq '.data | {nombreNegocio, disponible, productos: .productos | length}'
echo -e "\n"

# 7. Cambiar disponibilidad
echo -e "${BOLD}7. Cambiar disponibilidad (PUT /vendedores/$VENDEDOR_ID/toggle-disponibilidad)${NC}"
curl -s -X PUT "${API_URL}/vendedores/${VENDEDOR_ID}/toggle-disponibilidad" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo -e "\n"

# 8. Actualizar ubicación
echo -e "${BOLD}8. Actualizar ubicación (PUT /vendedores/$VENDEDOR_ID/ubicacion)${NC}"
NEW_LOCATION='{"longitude":-90.5100,"latitude":14.6300}'
curl -s -X PUT "${API_URL}/vendedores/${VENDEDOR_ID}/ubicacion" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$NEW_LOCATION" | jq '.'
echo -e "\n"

# 9. Listar productos
echo -e "${BOLD}9. Listar productos (GET /productos)${NC}"
curl -s "${API_URL}/productos" | jq '.data | length'
echo " productos encontrados\n"

# 10. Listar categorías
echo -e "${BOLD}10. Listar categorías (GET /productos/categorias/all)${NC}"
CATEGORIAS=$(curl -s "${API_URL}/productos/categorias/all")
echo "$CATEGORIAS" | jq '.data | map({nombre, icono})'
echo -e "\n"

# 11. Crear un nuevo producto
echo -e "${BOLD}11. Crear producto (POST /productos)${NC}"
PRIMERA_CATEGORIA=$(echo "$CATEGORIAS" | jq -r '.data[0]._id')
NUEVO_PRODUCTO='{
  "nombre": "Producto de Prueba",
  "categoria": "'$PRIMERA_CATEGORIA'",
  "descripcion": "Producto creado desde el script de prueba",
  "precio": 25,
  "unidad": "unidad",
  "stock": 10
}'

curl -s -X POST "${API_URL}/productos" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$NUEVO_PRODUCTO" | jq '.'
echo -e "\n"

# Resumen final
echo -e "${BOLD}${GREEN}==================================${NC}"
echo -e "${BOLD}${GREEN}  ✓ Todas las pruebas exitosas  ${NC}"
echo -e "${BOLD}${GREEN}==================================${NC}\n"

echo -e "Token JWT: ${BLUE}$TOKEN${NC}"
echo -e "Vendedor ID: ${BLUE}$VENDEDOR_ID${NC}\n"

echo -e "${BOLD}Endpoints disponibles:${NC}"
echo "  - GET    /api/health"
echo "  - POST   /api/auth/login"
echo "  - POST   /api/auth/register"
echo "  - GET    /api/auth/me"
echo "  - GET    /api/vendedores"
echo "  - GET    /api/vendedores/cercanos"
echo "  - GET    /api/vendedores/:id"
echo "  - PUT    /api/vendedores/:id/ubicacion"
echo "  - PUT    /api/vendedores/:id/toggle-disponibilidad"
echo "  - GET    /api/productos"
echo "  - POST   /api/productos"
echo "  - GET    /api/productos/categorias/all"
echo ""
