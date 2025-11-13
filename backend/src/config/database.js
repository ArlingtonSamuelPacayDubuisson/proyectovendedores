const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    
    // Crear índice geoespacial para ubicaciones
    const Vendedor = require('../models/Vendedor');
    await Vendedor.collection.createIndex({ ubicacionActual: '2dsphere' });
    console.log('✅ Índice geoespacial creado');
    
  } catch (error) {
    console.error(`❌ Error de conexión: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
