// MCP Server - Servidor de herramientas para agentes IA
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors()); // Permitir peticiones desde cualquier origen
app.use(express.json());

// Configuración de la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// ==============================================
// HERRAMIENTA 1: Buscar vendedores cercanos
// ==============================================
app.post('/tools/find-nearby-sellers', async (req, res) => {
  try {
    const { latitude, longitude, radius = 5 } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ 
        error: 'Se requieren latitude y longitude' 
      });
    }

    // Consulta usando la fórmula de Haversine para calcular distancia
    const query = `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.phone,
        u.address,
        u.latitude,
        u.longitude,
        COUNT(p.id) as product_count,
        (
          6371 * acos(
            cos(radians($1)) * cos(radians(u.latitude)) *
            cos(radians(u.longitude) - radians($2)) +
            sin(radians($1)) * sin(radians(u.latitude))
          )
        ) AS distance_km
      FROM users u
      LEFT JOIN products p ON u.id = p.seller_id
      WHERE u.role = 'seller'
        AND u.latitude IS NOT NULL
        AND u.longitude IS NOT NULL
      GROUP BY u.id
      HAVING (
        6371 * acos(
          cos(radians($1)) * cos(radians(u.latitude)) *
          cos(radians(u.longitude) - radians($2)) +
          sin(radians($1)) * sin(radians(u.latitude))
        )
      ) <= $3
      ORDER BY distance_km ASC;
    `;

    const result = await pool.query(query, [latitude, longitude, radius]);

    res.json({
      success: true,
      sellers: result.rows,
      total: result.rows.length,
      search_params: {
        latitude,
        longitude,
        radius_km: radius
      }
    });

  } catch (error) {
    console.error('Error buscando vendedores:', error);
    res.status(500).json({ error: 'Error al buscar vendedores' });
  }
});

// ==============================================
// HERRAMIENTA 2: Consultar productos disponibles
// ==============================================
app.post('/tools/get-available-products', async (req, res) => {
  try {
    const { 
      category, 
      min_price, 
      max_price, 
      seller_id,
      limit = 50 
    } = req.body;

    let query = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock,
        p.category,
        p.image_url,
        p.created_at,
        u.name as seller_name,
        u.id as seller_id,
        u.address as seller_address,
        u.phone as seller_phone
      FROM products p
      JOIN users u ON p.seller_id = u.id
      WHERE p.stock > 0
    `;

    const params = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND p.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (min_price) {
      query += ` AND p.price >= $${paramIndex}`;
      params.push(min_price);
      paramIndex++;
    }

    if (max_price) {
      query += ` AND p.price <= $${paramIndex}`;
      params.push(max_price);
      paramIndex++;
    }

    if (seller_id) {
      query += ` AND p.seller_id = $${paramIndex}`;
      params.push(seller_id);
      paramIndex++;
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await pool.query(query, params);

    res.json({
      success: true,
      products: result.rows,
      total: result.rows.length,
      filters_applied: {
        category: category || 'all',
        price_range: {
          min: min_price || 0,
          max: max_price || 'unlimited'
        }
      }
    });

  } catch (error) {
    console.error('Error consultando productos:', error);
    res.status(500).json({ error: 'Error al consultar productos' });
  }
});

// ==============================================
// HERRAMIENTA 3: Filtrar por categoría
// ==============================================
app.post('/tools/filter-by-category', async (req, res) => {
  try {
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({ 
        error: 'Se requiere especificar una categoría' 
      });
    }

    const query = `
      SELECT 
        p.*,
        u.name as seller_name,
        u.address as seller_address,
        COUNT(*) OVER() as total_in_category
      FROM products p
      JOIN users u ON p.seller_id = u.id
      WHERE p.category = $1 AND p.stock > 0
      ORDER BY p.price ASC;
    `;

    const result = await pool.query(query, [category]);

    res.json({
      success: true,
      category,
      products: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Error filtrando por categoría:', error);
    res.status(500).json({ error: 'Error al filtrar productos' });
  }
});

// ==============================================
// HERRAMIENTA 4: Obtener estadísticas
// ==============================================
app.get('/tools/get-statistics', async (req, res) => {
  try {
    // Estadísticas generales de la plataforma
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'seller') as total_sellers,
        (SELECT COUNT(*) FROM users WHERE role = 'buyer') as total_buyers,
        (SELECT COUNT(*) FROM products) as total_products,
        (SELECT COUNT(*) FROM products WHERE stock > 0) as available_products,
        (SELECT COUNT(*) FROM orders) as total_orders,
        (SELECT SUM(total_amount) FROM orders WHERE status = 'completed') as total_revenue,
        (SELECT AVG(price) FROM products WHERE stock > 0) as avg_product_price,
        (SELECT category FROM products GROUP BY category ORDER BY COUNT(*) DESC LIMIT 1) as most_popular_category;
    `;

    const categoryStatsQuery = `
      SELECT 
        category,
        COUNT(*) as product_count,
        AVG(price) as avg_price,
        SUM(stock) as total_stock
      FROM products
      WHERE stock > 0
      GROUP BY category
      ORDER BY product_count DESC;
    `;

    const [generalStats, categoryStats] = await Promise.all([
      pool.query(statsQuery),
      pool.query(categoryStatsQuery)
    ]);

    res.json({
      success: true,
      general_statistics: generalStats.rows[0],
      category_statistics: categoryStats.rows
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// ==============================================
// HERRAMIENTA 5: Sugerir ubicaciones óptimas
// ==============================================
app.post('/tools/suggest-optimal-locations', async (req, res) => {
  try {
    const { seller_id } = req.body;

    // Análisis de ubicaciones con mayor demanda
    const query = `
      SELECT 
        ROUND(AVG(latitude)::numeric, 4) as center_lat,
        ROUND(AVG(longitude)::numeric, 4) as center_lng,
        COUNT(*) as customer_count,
        STRING_AGG(DISTINCT address, ', ') as sample_addresses
      FROM (
        SELECT DISTINCT ON (u.id)
          u.latitude,
          u.longitude,
          u.address
        FROM orders o
        JOIN users u ON o.buyer_id = u.id
        WHERE o.seller_id = $1
          AND u.latitude IS NOT NULL
          AND u.longitude IS NOT NULL
        ORDER BY u.id, o.created_at DESC
      ) as customer_locations
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
    `;

    const hotzonesQuery = `
      SELECT 
        ROUND(u.latitude::numeric, 2) as lat_zone,
        ROUND(u.longitude::numeric, 2) as lng_zone,
        COUNT(*) as order_density,
        AVG(o.total_amount) as avg_order_value
      FROM orders o
      JOIN users u ON o.buyer_id = u.id
      WHERE u.latitude IS NOT NULL 
        AND u.longitude IS NOT NULL
        AND o.created_at >= NOW() - INTERVAL '3 months'
      GROUP BY lat_zone, lng_zone
      HAVING COUNT(*) >= 5
      ORDER BY order_density DESC
      LIMIT 10;
    `;

    const [optimalLocation, hotzones] = await Promise.all([
      pool.query(query, [seller_id]),
      pool.query(hotzonesQuery)
    ]);

    res.json({
      success: true,
      optimal_location: optimalLocation.rows[0],
      high_demand_zones: hotzones.rows,
      recommendation: optimalLocation.rows[0] ? 
        `Ubicación óptima sugerida: ${optimalLocation.rows[0].center_lat}, ${optimalLocation.rows[0].center_lng}` :
        'No hay suficientes datos para sugerir ubicación'
    });

  } catch (error) {
    console.error('Error sugiriendo ubicaciones:', error);
    res.status(500).json({ error: 'Error al sugerir ubicaciones' });
  }
});

// ==============================================
// HERRAMIENTA 6: Analizar zonas con más actividad
// ==============================================
app.get('/tools/analyze-active-zones', async (req, res) => {
  try {
    const { time_range = '30 days' } = req.query;

    const query = `
      WITH zone_activity AS (
        SELECT 
          ROUND(u.latitude::numeric, 1) as lat_zone,
          ROUND(u.longitude::numeric, 1) as lng_zone,
          COUNT(DISTINCT o.id) as total_orders,
          COUNT(DISTINCT o.buyer_id) as unique_customers,
          COUNT(DISTINCT o.seller_id) as unique_sellers,
          SUM(o.total_amount) as total_revenue,
          AVG(o.total_amount) as avg_order_value
        FROM orders o
        JOIN users u ON o.buyer_id = u.id
        WHERE o.created_at >= NOW() - $1::interval
          AND u.latitude IS NOT NULL
          AND u.longitude IS NOT NULL
        GROUP BY lat_zone, lng_zone
      )
      SELECT 
        *,
        RANK() OVER (ORDER BY total_orders DESC) as activity_rank
      FROM zone_activity
      WHERE total_orders >= 3
      ORDER BY total_orders DESC
      LIMIT 20;
    `;

    const result = await pool.query(query, [time_range]);

    res.json({
      success: true,
      time_range,
      active_zones: result.rows,
      total_zones_analyzed: result.rows.length
    });

  } catch (error) {
    console.error('Error analizando zonas:', error);
    res.status(500).json({ error: 'Error al analizar zonas' });
  }
});

// ==============================================
// ENDPOINT DE SALUD
// ==============================================
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'MCP Server',
    timestamp: new Date().toISOString()
  });
});

// ==============================================
// DOCUMENTACIÓN DE HERRAMIENTAS
// ==============================================
app.get('/tools', (req, res) => {
  res.json({
    available_tools: [
      {
        name: 'find-nearby-sellers',
        method: 'POST',
        endpoint: '/tools/find-nearby-sellers',
        description: 'Encuentra vendedores cercanos a una ubicación',
        parameters: {
          latitude: 'number (requerido)',
          longitude: 'number (requerido)',
          radius: 'number (opcional, default: 5 km)'
        }
      },
      {
        name: 'get-available-products',
        method: 'POST',
        endpoint: '/tools/get-available-products',
        description: 'Consulta productos disponibles con filtros',
        parameters: {
          category: 'string (opcional)',
          min_price: 'number (opcional)',
          max_price: 'number (opcional)',
          seller_id: 'number (opcional)',
          limit: 'number (opcional, default: 50)'
        }
      },
      {
        name: 'filter-by-category',
        method: 'POST',
        endpoint: '/tools/filter-by-category',
        description: 'Filtra productos por categoría específica',
        parameters: {
          category: 'string (requerido)'
        }
      },
      {
        name: 'get-statistics',
        method: 'GET',
        endpoint: '/tools/get-statistics',
        description: 'Obtiene estadísticas generales de la plataforma'
      },
      {
        name: 'suggest-optimal-locations',
        method: 'POST',
        endpoint: '/tools/suggest-optimal-locations',
        description: 'Sugiere ubicaciones óptimas para vendedores',
        parameters: {
          seller_id: 'number (requerido)'
        }
      },
      {
        name: 'analyze-active-zones',
        method: 'GET',
        endpoint: '/tools/analyze-active-zones',
        description: 'Analiza zonas con mayor actividad comercial',
        parameters: {
          time_range: 'string (opcional, default: "30 days")'
        }
      }
    ]
  });
});

// Iniciar servidor
const PORT = process.env.MCP_SERVER_PORT || 3002;
const HOST = process.env.MCP_SERVER_HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 MCP Server ejecutándose en ${HOST}:${PORT}`);
  console.log(`📚 Documentación disponible en: http://localhost:${PORT}/tools`);
  console.log(`💡 Herramientas disponibles para agentes IA`);
});
