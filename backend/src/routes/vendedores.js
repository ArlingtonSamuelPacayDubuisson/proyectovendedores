const express = require('express');
const router = express.Router();
const Vendedor = require('../models/Vendedor');
const Producto = require('../models/Producto');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/vendedores
// @desc    Obtener todos los vendedores activos
// @access  Public
router.get('/', async (req, res) => {
  try {
    const vendedores = await Vendedor.find({ activo: true })
      .populate('userId', 'nombre telefono email')
      .populate({
        path: 'productos',
        populate: { path: 'categoria' }
      });

    res.json({
      success: true,
      count: vendedores.length,
      data: vendedores
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener vendedores'
    });
  }
});

// @route   GET /api/vendedores/cercanos
// @desc    Buscar vendedores cercanos por geolocalización
// @access  Public
router.get('/cercanos', async (req, res) => {
  try {
    const { longitude, latitude, maxDistance } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren coordenadas (longitude y latitude)'
      });
    }

    const distance = parseInt(maxDistance) || 5000; // 5km por defecto

    const vendedores = await Vendedor.buscarCercanos(
      parseFloat(longitude),
      parseFloat(latitude),
      distance
    );

    res.json({
      success: true,
      count: vendedores.length,
      data: vendedores,
      searchParams: {
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
        maxDistance: distance
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar vendedores cercanos',
      error: error.message
    });
  }
});

// @route   GET /api/vendedores/:id
// @desc    Obtener un vendedor por ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const vendedor = await Vendedor.findById(req.params.id)
      .populate('userId', 'nombre telefono email')
      .populate({
        path: 'productos',
        populate: { path: 'categoria' }
      });

    if (!vendedor) {
      return res.status(404).json({
        success: false,
        message: 'Vendedor no encontrado'
      });
    }

    res.json({
      success: true,
      data: vendedor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener vendedor'
    });
  }
});

// @route   PUT /api/vendedores/:id
// @desc    Actualizar vendedor
// @access  Private (vendedor)
router.put('/:id', protect, authorize('vendedor', 'admin'), async (req, res) => {
  try {
    let vendedor = await Vendedor.findById(req.params.id);

    if (!vendedor) {
      return res.status(404).json({
        success: false,
        message: 'Vendedor no encontrado'
      });
    }

    // Verificar que el vendedor solo pueda actualizar su propio perfil
    if (vendedor.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado'
      });
    }

    vendedor = await Vendedor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'nombre telefono');

    res.json({
      success: true,
      data: vendedor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar vendedor'
    });
  }
});

// @route   PUT /api/vendedores/:id/ubicacion
// @desc    Actualizar ubicación del vendedor
// @access  Private (vendedor)
router.put('/:id/ubicacion', protect, authorize('vendedor', 'admin'), async (req, res) => {
  try {
    const { longitude, latitude } = req.body;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren coordenadas'
      });
    }

    const vendedor = await Vendedor.findById(req.params.id);

    if (!vendedor) {
      return res.status(404).json({
        success: false,
        message: 'Vendedor no encontrado'
      });
    }

    // Verificar autorización
    if (vendedor.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado'
      });
    }

    await vendedor.actualizarUbicacion(parseFloat(longitude), parseFloat(latitude));

    res.json({
      success: true,
      message: 'Ubicación actualizada',
      data: vendedor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar ubicación'
    });
  }
});

// @route   PUT /api/vendedores/:id/toggle-disponibilidad
// @desc    Cambiar disponibilidad del vendedor (activo/inactivo)
// @access  Private (vendedor)
router.put('/:id/toggle-disponibilidad', protect, authorize('vendedor', 'admin'), async (req, res) => {
  try {
    const vendedor = await Vendedor.findById(req.params.id);

    if (!vendedor) {
      return res.status(404).json({
        success: false,
        message: 'Vendedor no encontrado'
      });
    }

    // Verificar autorización
    if (vendedor.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado'
      });
    }

    vendedor.disponible = !vendedor.disponible;
    await vendedor.save();

    res.json({
      success: true,
      message: `Vendedor ${vendedor.disponible ? 'disponible' : 'no disponible'}`,
      data: { disponible: vendedor.disponible }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar disponibilidad'
    });
  }
});

module.exports = router;
