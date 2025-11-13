const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la categoría es requerido'],
    unique: true,
    trim: true
  },
  icono: {
    type: String,
    default: '📦'
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  descripcion: {
    type: String
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Categoria', categoriaSchema);
