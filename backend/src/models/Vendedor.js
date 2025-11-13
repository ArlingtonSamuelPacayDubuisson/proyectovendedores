const mongoose = require('mongoose');

const vendedorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nombreNegocio: {
    type: String,
    required: [true, 'El nombre del negocio es requerido'],
    trim: true
  },
  descripcion: {
    type: String,
    maxlength: 500
  },
  foto: {
    type: String,
    default: 'https://via.placeholder.com/300'
  },
  disponible: {
    type: Boolean,
    default: false
  },
  ubicacionActual: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [-90.5069, 14.6349] // Guatemala City por defecto
    }
  },
  productos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto'
  }],
  calificacion: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalCalificaciones: {
    type: Number,
    default: 0
  },
  verificado: {
    type: Boolean,
    default: false
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índice geoespacial para búsquedas por ubicación
vendedorSchema.index({ ubicacionActual: '2dsphere' });

// Método para actualizar ubicación
vendedorSchema.methods.actualizarUbicacion = async function(longitude, latitude) {
  this.ubicacionActual.coordinates = [longitude, latitude];
  return await this.save();
};

// Método estático para buscar vendedores cercanos
vendedorSchema.statics.buscarCercanos = async function(longitude, latitude, maxDistance = 5000) {
  return await this.find({
    disponible: true,
    activo: true,
    ubicacionActual: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance // metros
      }
    }
  }).populate('userId', 'nombre telefono')
    .populate('productos');
};

module.exports = mongoose.model('Vendedor', vendedorSchema);
