// MCP Server - Servidor de herramientas para agentes IA
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://admin:admin123@mongodb:27017/vendedores_db?authSource=admin';
let db;
let client;

// Conectar a MongoDB
async function connectDB() {
  try {
    client = new MongoClient(mongoUri);
    await client.connect();
    db = client.db('vendedores_db');
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
}

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

    // Buscar vendedores cercanos usando geolocalización de MongoDB
    const sellers = await db.collection('users').aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          distanceField: "distance_km",
          maxDistance: radius * 1000, // Convertir km a metros
          spherical: true,
          query: { role: 'seller' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'seller_id',
          as: 'products'
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          address: 1,
          location: 1,
          distance_km: { $divide: ["$distance_km", 1000] },
          product_count: { $size: "$products" }
        }
      }
    ]).toArray();

    res.json({
      success: true,
      sellers,
      total: sellers.length,
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

    let query = { stock: { $gt: 0 } };

    if (category) {
      query.category = category;
    }

    if (min_price || max_price) {
      query.price = {};
      if (min_price) query.price.$gte = parseFloat(min_price);
      if (max_price) query.price.$lte = parseFloat(max_price);
    }

    if (seller_id) {
      query.seller_id = seller_id;
    }

    const products = await db.collection('products')
      .aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'users',
            localField: 'seller_id',
            foreignField: '_id',
            as: 'seller'
          }
        },
        { $unwind: '$seller' },
        {
          $project: {
            name: 1,
            description: 1,
            price: 1,
            stock: 1,
            category: 1,
            image_url: 1,
            created_at: 1,
            seller_name: '$seller.name',
            seller_id: '$seller._id',
            seller_address: '$seller.address',
            seller_phone: '$seller.phone'
          }
        },
        { $sort: { created_at: -1 } },
        { $limit: limit }
      ])
      .toArray();

    res.json({
      success: true,
      products,
      total: products.length,
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

    const products = await db.collection('products')
      .aggregate([
        { 
          $match: { 
            category: category,
            stock: { $gt: 0 }
          } 
        },
        {
          $lookup: {
            from: 'users',
            localField: 'seller_id',
            foreignField: '_id',
            as: 'seller'
          }
        },
        { $unwind: '$seller' },
        {
          $project: {
            name: 1,
            description: 1,
            price: 1,
            stock: 1,
            category: 1,
            image_url: 1,
            seller_name: '$seller.name',
            seller_address: '$seller.address'
          }
        },
        { $sort: { price: 1 } }
      ])
      .toArray();

    res.json({
      success: true,
      category,
      products,
      total: products.length
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
    const [
      totalSellers,
      totalBuyers,
      totalProducts,
      availableProducts,
      totalOrders,
      completedOrders,
      avgPrice,
      categories
    ] = await Promise.all([
      db.collection('users').countDocuments({ role: 'seller' }),
      db.collection('users').countDocuments({ role: 'buyer' }),
      db.collection('products').countDocuments(),
      db.collection('products').countDocuments({ stock: { $gt: 0 } }),
      db.collection('orders').countDocuments(),
      db.collection('orders').find({ status: 'completed' }).toArray(),
      db.collection('products').aggregate([
        { $match: { stock: { $gt: 0 } } },
        { $group: { _id: null, avgPrice: { $avg: '$price' } } }
      ]).toArray(),
      db.collection('products').aggregate([
        { $match: { stock: { $gt: 0 } } },
        {
          $group: {
            _id: '$category',
            product_count: { $sum: 1 },
            avg_price: { $avg: '$price' },
            total_stock: { $sum: '$stock' }
          }
        },
        { $sort: { product_count: -1 } }
      ]).toArray()
    ]);

    const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    const mostPopularCategory = categories.length > 0 ? categories[0]._id : null;

    res.json({
      success: true,
      general_statistics: {
        total_sellers: totalSellers,
        total_buyers: totalBuyers,
        total_products: totalProducts,
        available_products: availableProducts,
        total_orders: totalOrders,
        total_revenue: totalRevenue.toFixed(2),
        avg_product_price: avgPrice.length > 0 ? avgPrice[0].avgPrice.toFixed(2) : 0,
        most_popular_category: mostPopularCategory
      },
      category_statistics: categories.map(cat => ({
        category: cat._id,
        product_count: cat.product_count,
        avg_price: cat.avg_price.toFixed(2),
        total_stock: cat.total_stock
      }))
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

    if (!seller_id) {
      return res.status(400).json({ error: 'Se requiere seller_id' });
    }

    // Obtener ubicaciones de clientes que compraron a este vendedor
    const customerLocations = await db.collection('orders')
      .aggregate([
        { $match: { seller_id: seller_id } },
        {
          $lookup: {
            from: 'users',
            localField: 'buyer_id',
            foreignField: '_id',
            as: 'buyer'
          }
        },
        { $unwind: '$buyer' },
        {
          $match: {
            'buyer.location': { $exists: true }
          }
        },
        {
          $group: {
            _id: null,
            avg_lat: { $avg: { $arrayElemAt: ['$buyer.location.coordinates', 1] } },
            avg_lng: { $avg: { $arrayElemAt: ['$buyer.location.coordinates', 0] } },
            customer_count: { $sum: 1 }
          }
        }
      ])
      .toArray();

    // Zonas de alta demanda
    const hotzones = await db.collection('orders')
      .aggregate([
        {
          $match: {
            created_at: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } // Últimos 3 meses
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'buyer_id',
            foreignField: '_id',
            as: 'buyer'
          }
        },
        { $unwind: '$buyer' },
        {
          $match: {
            'buyer.location': { $exists: true }
          }
        },
        {
          $group: {
            _id: {
              lat: { $round: [{ $arrayElemAt: ['$buyer.location.coordinates', 1] }, 2] },
              lng: { $round: [{ $arrayElemAt: ['$buyer.location.coordinates', 0] }, 2] }
            },
            order_density: { $sum: 1 },
            avg_order_value: { $avg: '$total_amount' }
          }
        },
        { $match: { order_density: { $gte: 5 } } },
        { $sort: { order_density: -1 } },
        { $limit: 10 }
      ])
      .toArray();

    res.json({
      success: true,
      optimal_location: customerLocations.length > 0 ? {
        center_lat: customerLocations[0].avg_lat,
        center_lng: customerLocations[0].avg_lng,
        customer_count: customerLocations[0].customer_count
      } : null,
      high_demand_zones: hotzones.map(zone => ({
        lat: zone._id.lat,
        lng: zone._id.lng,
        order_density: zone.order_density,
        avg_order_value: zone.avg_order_value.toFixed(2)
      })),
      recommendation: customerLocations.length > 0
        ? `Ubicación óptima sugerida: ${customerLocations[0].avg_lat}, ${customerLocations[0].avg_lng}`
        : 'No hay suficientes datos para sugerir ubicación'
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
    
    // Convertir time_range a milisegundos
    const days = parseInt(time_range);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const activeZones = await db.collection('orders')
      .aggregate([
        { $match: { created_at: { $gte: startDate } } },
        {
          $lookup: {
            from: 'users',
            localField: 'buyer_id',
            foreignField: '_id',
            as: 'buyer'
          }
        },
        { $unwind: '$buyer' },
        {
          $match: {
            'buyer.location': { $exists: true }
          }
        },
        {
          $group: {
            _id: {
              lat: { $round: [{ $arrayElemAt: ['$buyer.location.coordinates', 1] }, 1] },
              lng: { $round: [{ $arrayElemAt: ['$buyer.location.coordinates', 0] }, 1] }
            },
            total_orders: { $sum: 1 },
            unique_customers: { $addToSet: '$buyer_id' },
            unique_sellers: { $addToSet: '$seller_id' },
            total_revenue: { $sum: '$total_amount' },
            avg_order_value: { $avg: '$total_amount' }
          }
        },
        {
          $project: {
            lat_zone: '$_id.lat',
            lng_zone: '$_id.lng',
            total_orders: 1,
            unique_customers: { $size: '$unique_customers' },
            unique_sellers: { $size: '$unique_sellers' },
            total_revenue: 1,
            avg_order_value: 1
          }
        },
        { $match: { total_orders: { $gte: 3 } } },
        { $sort: { total_orders: -1 } },
        { $limit: 20 }
      ])
      .toArray();

    res.json({
      success: true,
      time_range,
      active_zones: activeZones.map((zone, index) => ({
        ...zone,
        activity_rank: index + 1,
        total_revenue: zone.total_revenue.toFixed(2),
        avg_order_value: zone.avg_order_value.toFixed(2)
      })),
      total_zones_analyzed: activeZones.length
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
    database: db ? 'connected' : 'disconnected',
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
          seller_id: 'string (opcional)',
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
          seller_id: 'string (requerido)'
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

connectDB().then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`🚀 MCP Server ejecutándose en ${HOST}:${PORT}`);
    console.log(`📚 Documentación disponible en: http://localhost:${PORT}/tools`);
    console.log(`💡 Herramientas disponibles para agentes IA`);
  });
});

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor MCP...');
  if (client) {
    await client.close();
  }
  process.exit(0);
});
