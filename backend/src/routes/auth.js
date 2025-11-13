const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Vendedor = require('../models/Vendedor');
const { protect } = require('../middleware/auth');

// Generar JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Registrar usuario
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, telefono, role } = req.body;

    // Validar campos
    if (!nombre || !email || !password || !telefono) {
      return res.status(400).json({
        success: false,
        message: 'Por favor complete todos los campos'
      });
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'El usuario ya existe'
      });
    }

    // Crear usuario
    const user = await User.create({
      nombre,
      email,
      password,
      telefono,
      role: role || 'comprador'
    });

    // Si es vendedor, crear perfil de vendedor
    let vendedor = null;
    if (user.role === 'vendedor') {
      vendedor = await Vendedor.create({
        userId: user._id,
        nombreNegocio: nombre
      });
    }

    // Generar token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
        vendedorId: vendedor ? vendedor._id : null
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login de usuario
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor ingrese email y contraseña'
      });
    }

    // Buscar usuario con password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Buscar vendedor si aplica
    let vendedor = null;
    if (user.role === 'vendedor') {
      vendedor = await Vendedor.findOne({ userId: user._id });
    }

    // Generar token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
        vendedorId: vendedor ? vendedor._id : null
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
});

// @route   GET /api/auth/me
// @desc    Obtener usuario actual
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    let vendedor = null;
    if (user.role === 'vendedor') {
      vendedor = await Vendedor.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        telefono: user.telefono,
        role: user.role,
        vendedorId: vendedor ? vendedor._id : null
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario'
    });
  }
});

module.exports = router;
