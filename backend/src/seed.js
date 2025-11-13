require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Vendedor = require('./models/Vendedor');
const Producto = require('./models/Producto');
const Categoria = require('./models/Categoria');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado');
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    process.exit(1);
  }
};

const categorias = [
  { nombre: 'Frutas', icono: '🍎', color: '#EF4444' },
  { nombre: 'Verduras', icono: '🥬', color: '#10B981' },
  { nombre: 'Comida Preparada', icono: '🍲', color: '#F59E0B' },
  { nombre: 'Bebidas', icono: '🥤', color: '#3B82F6' },
  { nombre: 'Artesanías', icono: '🎨', color: '#8B5CF6' },
  { nombre: 'Ropa', icono: '👕', color: '#EC4899' },
  { nombre: 'Flores', icono: '🌺', color: '#F472B6' },
  { nombre: 'Otros', icono: '📦', color: '#6B7280' }
];

const seedDatabase = async () => {
  try {
    // Limpiar base de datos
    console.log('🗑️  Limpiando base de datos...');
    await User.deleteMany({});
    await Vendedor.deleteMany({});
    await Producto.deleteMany({});
    await Categoria.deleteMany({});

    // Crear categorías
    console.log('📦 Creando categorías...');
    const categoriasCreadas = await Categoria.insertMany(categorias);
    console.log(`✅ ${categoriasCreadas.length} categorías creadas`);

    // Crear usuarios y vendedores
    console.log('👥 Creando usuarios y vendedores...');
    
    // Usuario comprador
    const comprador = await User.create({
      nombre: 'Juan Pérez',
      email: 'juan@test.com',
      password: '123456',
      telefono: '12345678',
      role: 'comprador'
    });

    // Vendedor 1 - Frutas
    const vendedor1User = await User.create({
      nombre: 'María López',
      email: 'maria@test.com',
      password: '123456',
      telefono: '87654321',
      role: 'vendedor'
    });

    const vendedor1 = await Vendedor.create({
      userId: vendedor1User._id,
      nombreNegocio: 'Frutas Frescas María',
      descripcion: 'Las mejores frutas de la temporada',
      disponible: true,
      ubicacionActual: {
        type: 'Point',
        coordinates: [-90.5069, 14.6349] // Guatemala City
      }
    });

    // Productos del vendedor 1
    const frutasCategoria = categoriasCreadas.find(c => c.nombre === 'Frutas');
    const productosVendedor1 = await Producto.insertMany([
      {
        vendedorId: vendedor1._id,
        nombre: 'Manzanas Rojas',
        categoria: frutasCategoria._id,
        descripcion: 'Manzanas frescas y jugosas',
        precio: 15,
        unidad: 'libra',
        disponible: true,
        stock: 50
      },
      {
        vendedorId: vendedor1._id,
        nombre: 'Bananos',
        categoria: frutasCategoria._id,
        descripcion: 'Bananos maduros',
        precio: 5,
        unidad: 'libra',
        disponible: true,
        stock: 100
      },
      {
        vendedorId: vendedor1._id,
        nombre: 'Naranjas',
        categoria: frutasCategoria._id,
        descripcion: 'Naranjas dulces para jugo',
        precio: 8,
        unidad: 'libra',
        disponible: true,
        stock: 75
      }
    ]);

    vendedor1.productos = productosVendedor1.map(p => p._id);
    await vendedor1.save();

    // Vendedor 2 - Verduras
    const vendedor2User = await User.create({
      nombre: 'Carlos Hernández',
      email: 'carlos@test.com',
      password: '123456',
      telefono: '55551234',
      role: 'vendedor'
    });

    const vendedor2 = await Vendedor.create({
      userId: vendedor2User._id,
      nombreNegocio: 'Verduras Don Carlos',
      descripcion: 'Verduras orgánicas del campo',
      disponible: true,
      ubicacionActual: {
        type: 'Point',
        coordinates: [-90.5100, 14.6300]
      }
    });

    // Productos del vendedor 2
    const verdurasCategoria = categoriasCreadas.find(c => c.nombre === 'Verduras');
    const productosVendedor2 = await Producto.insertMany([
      {
        vendedorId: vendedor2._id,
        nombre: 'Tomates',
        categoria: verdurasCategoria._id,
        descripcion: 'Tomates frescos',
        precio: 6,
        unidad: 'libra',
        disponible: true,
        stock: 60
      },
      {
        vendedorId: vendedor2._id,
        nombre: 'Aguacates',
        categoria: verdurasCategoria._id,
        descripcion: 'Aguacates Hass',
        precio: 10,
        unidad: 'unidad',
        disponible: true,
        stock: 40
      },
      {
        vendedorId: vendedor2._id,
        nombre: 'Zanahorias',
        categoria: verdurasCategoria._id,
        descripcion: 'Zanahorias orgánicas',
        precio: 7,
        unidad: 'libra',
        disponible: true,
        stock: 50
      }
    ]);

    vendedor2.productos = productosVendedor2.map(p => p._id);
    await vendedor2.save();

    // Vendedor 3 - Comida Preparada
    const vendedor3User = await User.create({
      nombre: 'Ana García',
      email: 'ana@test.com',
      password: '123456',
      telefono: '99998888',
      role: 'vendedor'
    });

    const vendedor3 = await Vendedor.create({
      userId: vendedor3User._id,
      nombreNegocio: 'Comidas Doña Ana',
      descripcion: 'Comida casera guatemalteca',
      disponible: false,
      ubicacionActual: {
        type: 'Point',
        coordinates: [-90.5150, 14.6380]
      }
    });

    // Productos del vendedor 3
    const comidaCategoria = categoriasCreadas.find(c => c.nombre === 'Comida Preparada');
    const productosVendedor3 = await Producto.insertMany([
      {
        vendedorId: vendedor3._id,
        nombre: 'Tacos',
        categoria: comidaCategoria._id,
        descripcion: 'Tacos de pollo o carne',
        precio: 5,
        unidad: 'unidad',
        disponible: true,
        stock: 30
      },
      {
        vendedorId: vendedor3._id,
        nombre: 'Atol de Elote',
        categoria: comidaCategoria._id,
        descripcion: 'Atol caliente tradicional',
        precio: 8,
        unidad: 'unidad',
        disponible: true,
        stock: 20
      }
    ]);

    vendedor3.productos = productosVendedor3.map(p => p._id);
    await vendedor3.save();

    console.log('✅ Base de datos poblada exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`  - ${categoriasCreadas.length} categorías`);
    console.log(`  - 4 usuarios (1 comprador, 3 vendedores)`);
    console.log(`  - 3 vendedores`);
    console.log(`  - ${productosVendedor1.length + productosVendedor2.length + productosVendedor3.length} productos`);
    console.log('\n🔑 Credenciales de prueba:');
    console.log('  Comprador: juan@test.com / 123456');
    console.log('  Vendedor 1: maria@test.com / 123456');
    console.log('  Vendedor 2: carlos@test.com / 123456');
    console.log('  Vendedor 3: ana@test.com / 123456');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al poblar base de datos:', error);
    process.exit(1);
  }
};

connectDB().then(seedDatabase);
