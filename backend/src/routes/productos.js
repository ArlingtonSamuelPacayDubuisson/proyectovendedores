const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const Vendedor = require('../models/Vendedor');
const Categoria = require('../models/Categoria');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/productos
// @desc    Obtener todos los productos
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { categoria, disponible, vendedor } = req.query;
    
    let filter = {};
    if (categoria) filter.categoria = categoria;
    if (disponible) filter.disponible = disponible === 'true';
    if (vendedor) filter.vendedorId = vendedor;

    const productos = await Producto.find(filter)
      .populate('categoria')
      .populate({
        path: 'vendedorId',
        populate: { path: 'userId', select: 'nombre telefono' }
      });

    res.json({
      success: true,
      count: productos.length,
      data: productos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos'
    });
  }
});

// @route   GET /api/productos/:id
// @desc    Obtener un producto por ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id)
      .populate('categoria')
      .populate({
        path: 'vendedorId',
        populate: { path: 'userId', select: 'nombre telefono' }
      });

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      data: producto
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener producto'
    });
  }
});

// @route   POST /api/productos
// @desc    Crear producto
// @access  Private (vendedor)
router.post('/', protect, authorize('vendedor', 'admin'), async (req, res) => {
  try {
    const { nombre, categoria, descripcion, precio, unidad, foto } = req.body;

    // Buscar el vendedor del usuario actual
    const vendedor = await Vendedor.findOne({ userId: req.user._id });
    
    if (!vendedor) {
      return res.status(404).json({
        success: false,
        message: 'Perfil de vendedor no encontrado'
      });
    }

    // Crear producto
    const producto = await Producto.create({
      vendedorId: vendedor._id,
      nombre,
      categoria,
      descripcion,
      precio,
      unidad,
      foto
    });

    // Agregar producto al array de productos del vendedor
    vendedor.productos.push(producto._id);
    await vendedor.save();

    const productoPopulado = await Producto.findById(producto._id)
      .populate('categoria')
      .populate('vendedorId');

    res.status(201).json({
      success: true,
      data: productoPopulado
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al crear producto',
      error: error.message
    });
  }
});

// @route   PUT /api/productos/:id
// @desc    Actualizar producto
// @access  Private (vendedor)
router.put('/:id', protect, authorize('vendedor', 'admin'), async (req, res) => {
  try {
    let producto = await Producto.findById(req.params.id).populate('vendedorId');

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Verificar que el producto pertenezca al vendedor
    if (producto.vendedorId.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado'
      });
    }

    producto = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('categoria').populate('vendedorId');

    res.json({
      success: true,
      data: producto
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar producto'
    });
  }
});

// @route   DELETE /api/productos/:id
// @desc    Eliminar producto
// @access  Private (vendedor)
router.delete('/:id', protect, authorize('vendedor', 'admin'), async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id).populate('vendedorId');

    if (!producto) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Verificar que el producto pertenezca al vendedor
    if (producto.vendedorId.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado'
      });
    }

    // Eliminar producto del array del vendedor
    await Vendedor.findByIdAndUpdate(
      producto.vendedorId._id,
      { $pull: { productos: producto._id } }
    );

    await producto.deleteOne();

    res.json({
      success: true,
      message: 'Producto eliminado'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar producto'
    });
  }
});

// @route   GET /api/productos/categoria/:categoriaId
// @desc    Obtener productos por categoría
// @access  Public
router.get('/categoria/:categoriaId', async (req, res) => {
  try {
    const productos = await Producto.find({ 
      categoria: req.params.categoriaId,
      disponible: true 
    })
      .populate('categoria')
      .populate({
        path: 'vendedorId',
        populate: { path: 'userId', select: 'nombre telefono' }
      });

    res.json({
      success: true,
      count: productos.length,
      data: productos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos'
    });
  }
});

// @route   GET /api/categorias
// @desc    Obtener todas las categorías
// @access  Public
router.get('/categorias/all', async (req, res) => {
  try {
    const categorias = await Categoria.find({ activo: true });

    res.json({
      success: true,
      count: categorias.length,
      data: categorias
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías'
    });
  }
});

// @route   POST /api/categorias
// @desc    Crear categoría
// @access  Private (admin)
router.post('/categorias', protect, authorize('admin'), async (req, res) => {
  try {
    const categoria = await Categoria.create(req.body);

    res.status(201).json({
      success: true,
      data: categoria
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al crear categoría'
    });
  }
});

module.exports = router;
