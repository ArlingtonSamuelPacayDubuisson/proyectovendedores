const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  vendedorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendedor',
    required: true
  },
  nombre: {
    type: String,
    required: [true, 'El nombre del producto es requerido'],
    trim: true
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true
  },
  descripcion: {
    type: String,
    maxlength: 300
  },
  precio: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: 0
  },
  unidad: {
    type: String,
    required: [true, 'La unidad es requerida'],
    enum: ['kg', 'libra', 'unidad', 'docena', 'caja', 'bolsa', 'litro']
  },
  foto: {
    type: String,
    default: 'https://via.placeholder.com/300'
  },
  disponible: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Índice para búsquedas rápidas
productoSchema.index({ nombre: 'text', descripcion: 'text' });
productoSchema.index({ categoria: 1, disponible: 1 });

module.exports = mongoose.model('Producto', productoSchema);
