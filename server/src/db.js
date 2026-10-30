const mysql = require('mysql2/promise');

const INITIAL_HAMBURGERS = [
  {
    id: 1,
    name: 'Rey de las Burgers',
    category: 'Especiales',
    price: 14.90,
    stock: 45,
    available: true,
    specialtyLevel: '👑 Especialidad Leyenda',
    badgeType: 'legend',
    rating: 4.9,
    reviewsCount: 428,
    prepTime: '12-15 min',
    calories: '890 kcal',
    protein: '58g',
    tags: ['Best Seller', 'Angus 100%', 'Chef Special'],
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=80',
    description: 'Nuestra creación insigne: triple medallón de res Angus flameada al fuego directo, triple queso cheddar fundido al humo, tocino curado crocante, cebolla confitada al oporto y salsa secreta King Rapid en pan brioche artesanal dorado con mantequilla clarificada.'
  },
  {
    id: 2,
    name: 'Burger Real Clásica',
    category: 'Clásicas',
    price: 9.50,
    stock: 65,
    available: true,
    specialtyLevel: '⭐ Especialidad Clásica Real',
    badgeType: 'signature',
    rating: 4.8,
    reviewsCount: 312,
    prepTime: '8-10 min',
    calories: '620 kcal',
    protein: '38g',
    tags: ['Tradicional', 'Equilibrada', 'Favorita'],
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=700&auto=format&fit=crop&q=80',
    description: 'La esencia de la hamburguesa perfecta: jugoso corte de res prime de 180g, queso cheddar americano suavemente fundido, lechuga romana recién cortada, rodajas de tomate pera, pepinillos encurtidos al eneldo y emulsión Imperial en pan brioche con sésamo tostado.'
  },
  {
    id: 3,
    name: 'Burger Real Doble',
    category: 'Especiales',
    price: 12.80,
    stock: 50,
    available: true,
    specialtyLevel: '🔥 Especialidad Doble Carne',
    badgeType: 'double',
    rating: 4.9,
    reviewsCount: 290,
    prepTime: '10-12 min',
    calories: '780 kcal',
    protein: '52g',
    tags: ['Doble Carne', 'Sabor Fuerte', 'BBQ Smoked'],
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=700&auto=format&fit=crop&q=80',
    description: 'Doble medallón smash con costra caramelizada irresistible (360g total), doble capa de queso americano fundido, tiras de panceta ahumada glaseadas en maple y reducción artesanal de salsa BBQ con toque de leña.'
  },
  {
    id: 4,
    name: 'Burger Doble Especial',
    category: 'Especiales',
    price: 13.50,
    stock: 38,
    available: true,
    specialtyLevel: '⚡ Especialidad Chef Gourmet',
    badgeType: 'gourmet',
    rating: 4.9,
    reviewsCount: 345,
    prepTime: '12-14 min',
    calories: '810 kcal',
    protein: '54g',
    tags: ['Gourmet', 'Trufa & Hongos', 'Queso Gouda'],
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=700&auto=format&fit=crop&q=80',
    description: 'Dos medallones jugosos a la parrilla (360g), queso gouda trufado fundido, champiñones portobello salteados a la mantequilla con tomillo fresco, mayonesa de ajo negro asado y pan brioche artesanal sellado.'
  },
  {
    id: 5,
    name: 'Burger Crispy Smoke BBQ',
    category: 'Pollo & Crispy',
    price: 10.90,
    stock: 42,
    available: true,
    specialtyLevel: '🍗 Nivel Crunchy Master',
    badgeType: 'crispy',
    rating: 4.7,
    reviewsCount: 198,
    prepTime: '10-12 min',
    calories: '670 kcal',
    protein: '42g',
    tags: ['Pollo Crujiente', 'Coleslaw', 'BBQ Dulce'],
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=700&auto=format&fit=crop&q=80',
    description: 'Pechuga de pollo de libre pastoreo marinada 24 horas en buttermilk con 11 especias secretas, frita con rebozado ultra crujiente, queso Monterey Jack, ensalada coleslaw fresca con manzana verde y salsa barbacoa ahumada.'
  },
  {
    id: 6,
    name: 'Burger Trufa & Queso Suizo',
    category: 'Especiales',
    price: 14.20,
    stock: 30,
    available: true,
    specialtyLevel: '💎 Nivel Alta Cocina',
    badgeType: 'premium',
    rating: 4.9,
    reviewsCount: 176,
    prepTime: '12-15 min',
    calories: '740 kcal',
    protein: '46g',
    tags: ['Trufa Negra', 'Queso Suizo', 'Alta Gama'],
    image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=700&auto=format&fit=crop&q=80',
    description: 'Carne Angus seleccionada con emulsión de trufa negra de verano, queso suizo Emmental madurado fundido, rúcula selvática baby y glaseado balsámico de Módena envejecido.'
  },
  {
    id: 7,
    name: 'Burger Jalapeño Flame',
    category: 'Picantes',
    price: 11.20,
    stock: 35,
    available: true,
    specialtyLevel: '🌶️ Nivel Fuego Extremo',
    badgeType: 'spicy',
    rating: 4.6,
    reviewsCount: 164,
    prepTime: '9-11 min',
    calories: '690 kcal',
    protein: '40g',
    tags: ['Picante Intenso', 'Chipotle', 'Pepper Jack'],
    image: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?w=700&auto=format&fit=crop&q=80',
    description: 'Para los amantes de las emociones fuertes: medallón de res sazonado al cajún, queso Pepper Jack picante, rodajas de jalapeños al fuego, cebolla crujiente frita y aderezo cremoso de chipotle ahumado.'
  },
  {
    id: 8,
    name: 'Burger Bacon Master Deluxe',
    category: 'Clásicas',
    price: 12.50,
    stock: 55,
    available: true,
    specialtyLevel: '🥓 Nivel Carnívoro Oro',
    badgeType: 'signature',
    rating: 4.8,
    reviewsCount: 304,
    prepTime: '9-11 min',
    calories: '760 kcal',
    protein: '48g',
    tags: ['Extra Bacon', 'Cheddar Doble', 'Glaseado Miel'],
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=700&auto=format&fit=crop&q=80',
    description: 'Homenaje al tocino premium: cuatro gruesas tiras de tocino ahumado en madera de manzano, doble queso cheddar fundido, carne de res jugosa y relish artesanal con salsa especial de la casa.'
  },
  {
    id: 9,
    name: 'Burger Portobello Melt Veggie',
    category: 'Vegetarianas',
    price: 10.50,
    stock: 28,
    available: true,
    specialtyLevel: '🌱 Nivel Verde Gourmet',
    badgeType: 'veggie',
    rating: 4.7,
    reviewsCount: 142,
    prepTime: '10-12 min',
    calories: '510 kcal',
    protein: '22g',
    tags: ['Vegetariana', 'Portobello', 'Pesto Casero'],
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=700&auto=format&fit=crop&q=80',
    description: 'Sombrero entero de champiñón Portobello marinado en aceite de oliva y romero, asado a las brasas, queso provolone ahumado derretido, pimientos asados al carbón y pesto genovés de albahaca fresca.'
  },
  {
    id: 10,
    name: 'Burger Cuarto de Libra Supreme',
    category: 'Clásicas',
    price: 8.90,
    stock: 70,
    available: true,
    specialtyLevel: '🎯 Nivel Clásico Favorito',
    badgeType: 'classic',
    rating: 4.8,
    reviewsCount: 512,
    prepTime: '7-9 min',
    calories: '550 kcal',
    protein: '32g',
    tags: ['Insuperable', 'Rápida', 'Económica'],
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=700&auto=format&fit=crop&q=80',
    description: 'El clásico indiscutible: 115g de res premium nunca congelada, cebolla fresca finamente picada, pepinillos crujientes en vinagre, mostaza antigua, kétchup clásico y dos lonchas de queso fundido.'
  }
];

// Initial mock customers for consumption analytics
const INITIAL_CUSTOMERS = [
  {
    id: 'CUST-101',
    name: 'Sofía Montalván',
    email: 'sofia.m@example.com',
    tier: 'VIP Gold',
    totalSpent: 184.20,
    orderCount: 14,
    favoriteBurger: 'Rey de las Burgers',
    lastOrder: 'Hace 2 horas',
    avatar: '👩💼',
    status: 'Activo'
  },
  {
    id: 'CUST-102',
    name: 'Carlos Mendoza',
    email: 'carlos.m@example.com',
    tier: 'VIP Gold',
    totalSpent: 162.50,
    orderCount: 12,
    favoriteBurger: 'Burger Doble Especial',
    lastOrder: 'Ayer',
    avatar: '👨💻',
    status: 'Activo'
  },
  {
    id: 'CUST-103',
    name: 'Valeria Rivas',
    email: 'valeria.r@example.com',
    tier: 'Silver Recurrente',
    totalSpent: 89.40,
    orderCount: 7,
    favoriteBurger: 'Burger Real Clásica',
    lastOrder: 'Hace 3 días',
    avatar: '👩🎨',
    status: 'Activo'
  },
  {
    id: 'CUST-104',
    name: 'Diego Morales',
    email: 'diego.m@example.com',
    tier: 'Silver Recurrente',
    totalSpent: 74.80,
    orderCount: 6,
    favoriteBurger: 'Burger Real Doble',
    lastOrder: 'Hace 5 días',
    avatar: '👨🔬',
    status: 'Activo'
  },
  {
    id: 'CUST-105',
    name: 'Lucía Fernández',
    email: 'lucia.f@example.com',
    tier: 'Bronce Ocasional',
    totalSpent: 35.60,
    orderCount: 3,
    favoriteBurger: 'Burger Crispy Smoke BBQ',
    lastOrder: 'Hace 1 semana',
    avatar: '👩🎓',
    status: 'Inactivo'
  },
  {
    id: 'CUST-106',
    name: 'Andrés Salazar',
    email: 'andres.s@example.com',
    tier: 'Bronce Ocasional',
    totalSpent: 26.70,
    orderCount: 2,
    favoriteBurger: 'Burger Cuarto de Libra Supreme',
    lastOrder: 'Hace 2 semanas',
    avatar: '👨🏫',
    status: 'Nuevo'
  }
];

let inMemoryProducts = [...INITIAL_HAMBURGERS];
let inMemoryCustomers = [...INITIAL_CUSTOMERS];
let inMemoryOrders = [
  {
    id: 'ORD-8921',
    customerName: 'Sofía Montalván',
    items: [{ name: 'Rey de las Burgers', quantity: 2, price: 14.90 }, { name: 'Papas Rústicas', quantity: 1, price: 3.50 }],
    total: 33.30,
    status: 'Entregado',
    date: '2026-10-29 19:45',
    paymentMethod: 'Tarjeta Crédito'
  },
  {
    id: 'ORD-8922',
    customerName: 'Carlos Mendoza',
    items: [{ name: 'Burger Doble Especial', quantity: 1, price: 13.50 }, { name: 'Burger Real Doble', quantity: 1, price: 12.80 }],
    total: 26.30,
    status: 'En camino',
    date: '2026-10-29 20:15',
    paymentMethod: 'Apple Pay'
  },
  {
    id: 'ORD-8923',
    customerName: 'Simulador App PWA',
    items: [{ name: 'Burger Real Clásica', quantity: 2, price: 9.50 }],
    total: 19.00,
    status: 'Preparando',
    date: '2026-10-29 20:50',
    paymentMethod: 'RapidPay'
  }
];

let pool = null;
let isConnectedToMySQL = false;
let lastDbError = null;

async function initDB() {
  const databaseUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;
  const host = process.env.DB_HOST || process.env.MYSQL_HOST;
  const user = process.env.DB_USER || process.env.MYSQL_USER || 'root';
  const password = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '';
  const database = process.env.DB_NAME || process.env.MYSQL_DATABASE || 'demo';
  const port = parseInt(process.env.DB_PORT || '3306', 10);

  if (!databaseUrl && !host) {
    lastDbError = 'Variables DB_HOST ni DATABASE_URL configuradas en el entorno.';
    console.log(`ℹ️ [DB] ${lastDbError} Operando en modo In-Memory para Hamburger Rapid.`);
    return;
  }

  try {
    if (databaseUrl) {
      console.log(`🔄 [DB] Conectando a MySQL vía DATABASE_URL...`);
      pool = mysql.createPool(databaseUrl);
    } else {
      console.log(`🔄 [DB] Conectando a MySQL en ${host}:${port}...`);
      pool = mysql.createPool({
        host,
        user,
        password,
        database,
        port,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 8000
      });
    }

    const connection = await pool.getConnection();
    console.log(`✅ [DB] Conexión establecida con MySQL`);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        available BOOLEAN DEFAULT TRUE,
        specialty_level VARCHAR(100),
        badge_type VARCHAR(50),
        rating DECIMAL(3,1) DEFAULT 4.8,
        prep_time VARCHAR(50),
        calories VARCHAR(50),
        image VARCHAR(500),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Verify product count
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM products');
    if (rows[0].count === 0) {
      console.log('🌱 [DB] Sembrando catálogo de 10 variantes de Hamburger Rapid...');
      for (const p of INITIAL_HAMBURGERS) {
        await connection.query(
          `INSERT INTO products (name, category, price, stock, available, specialty_level, badge_type, rating, prep_time, calories, image, description)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [p.name, p.category, p.price, p.stock, p.available, p.specialtyLevel, p.badgeType, p.rating, p.prepTime, p.calories, p.image, p.description]
        );
      }
    }

    connection.release();
    isConnectedToMySQL = true;
    lastDbError = null;
  } catch (error) {
    lastDbError = error.message;
    console.warn(`⚠️ [DB] No se pudo conectar a MySQL: ${error.message}. Operando en modo In-Memory.`);
    isConnectedToMySQL = false;
  }
}

async function getProducts() {
  if (!isConnectedToMySQL && (process.env.DB_HOST || process.env.DATABASE_URL)) {
    await initDB();
  }

  if (isConnectedToMySQL && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM products ORDER BY id ASC');
      return rows.map(r => ({
        id: r.id,
        name: r.name,
        category: r.category,
        price: parseFloat(r.price),
        stock: r.stock,
        available: r.available === 1 || r.available === true,
        specialtyLevel: r.specialty_level || 'Especialidad Casa',
        badgeType: r.badge_type || 'signature',
        rating: parseFloat(r.rating) || 4.8,
        prepTime: r.prep_time || '10-12 min',
        calories: r.calories || '700 kcal',
        image: r.image,
        description: r.description
      }));
    } catch (err) {
      console.error('Error consultando MySQL, recurriendo a memoria temporal:', err.message);
      lastDbError = err.message;
    }
  }
  return inMemoryProducts;
}

async function addProduct(productData) {
  const newProduct = {
    id: Date.now(),
    name: productData.name,
    category: productData.category || 'Especiales',
    price: parseFloat(productData.price) || 9.90,
    stock: parseInt(productData.stock, 10) || 30,
    available: productData.available !== undefined ? productData.available : true,
    specialtyLevel: productData.specialtyLevel || '⭐ Nueva Especialidad',
    badgeType: productData.badgeType || 'signature',
    rating: parseFloat(productData.rating) || 4.9,
    reviewsCount: 1,
    prepTime: productData.prepTime || '10-12 min',
    calories: productData.calories || '720 kcal',
    protein: productData.protein || '40g',
    tags: ['Nueva', 'Hamburger Rapid'],
    image: productData.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&auto=format&fit=crop&q=80',
    description: productData.description || 'Hamburguesa gourmet artesanal preparada con carne fresca e ingredientes de primera calidad.'
  };

  inMemoryProducts.unshift(newProduct);
  return newProduct;
}

async function updateProduct(id, updates) {
  const numId = parseInt(id, 10);
  const index = inMemoryProducts.findIndex(p => p.id === numId);
  if (index !== -1) {
    inMemoryProducts[index] = { ...inMemoryProducts[index], ...updates };
    return inMemoryProducts[index];
  }
  return null;
}

async function deleteProduct(id) {
  const numId = parseInt(id, 10);
  inMemoryProducts = inMemoryProducts.filter(p => p.id !== numId);
  return true;
}

async function resetProducts() {
  inMemoryProducts = JSON.parse(JSON.stringify(INITIAL_HAMBURGERS));
  inMemoryCustomers = JSON.parse(JSON.stringify(INITIAL_CUSTOMERS));
}

// Orders and customer simulation
async function getOrders() {
  return inMemoryOrders;
}

async function createOrder({ customerName, items, total, paymentMethod }) {
  const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const newOrder = {
    id: orderId,
    customerName: customerName || 'Cliente Móvil PWA',
    items: items || [],
    total: parseFloat(total) || 15.00,
    status: 'Preparando',
    date: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    paymentMethod: paymentMethod || 'Tarjeta Rapid'
  };

  inMemoryOrders.unshift(newOrder);

  // Update or insert simulated customer consumption
  const existingCust = inMemoryCustomers.find(c => c.name.toLowerCase() === newOrder.customerName.toLowerCase());
  if (existingCust) {
    existingCust.totalSpent = parseFloat((existingCust.totalSpent + newOrder.total).toFixed(2));
    existingCust.orderCount += 1;
    existingCust.lastOrder = 'Hace un momento';
    if (existingCust.totalSpent > 150) existingCust.tier = 'VIP Gold';
  } else {
    inMemoryCustomers.unshift({
      id: `CUST-${Math.floor(100 + Math.random() * 900)}`,
      name: newOrder.customerName,
      email: `${newOrder.customerName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      tier: 'Bronce Ocasional',
      totalSpent: newOrder.total,
      orderCount: 1,
      favoriteBurger: items && items[0] ? items[0].name : 'Rey de las Burgers',
      lastOrder: 'Hace un momento',
      avatar: '🍔',
      status: 'Nuevo'
    });
  }

  return newOrder;
}

async function getMetrics() {
  const totalRevenue = inMemoryCustomers.reduce((acc, c) => acc + c.totalSpent, 0);
  const totalOrders = inMemoryOrders.length;
  const totalCustomers = inMemoryCustomers.length;
  const avgTicket = totalCustomers > 0 ? (totalRevenue / totalCustomers).toFixed(2) : 0;

  // Segments calculation
  const vipCount = inMemoryCustomers.filter(c => c.tier.includes('VIP')).length;
  const recurrentCount = inMemoryCustomers.filter(c => c.tier.includes('Silver')).length;
  const occasionalCount = inMemoryCustomers.filter(c => c.tier.includes('Bronce') || c.tier.includes('Nuevo')).length;

  return {
    summary: {
      totalRevenue: totalRevenue.toFixed(2),
      totalOrders,
      totalCustomers,
      avgTicket,
      satisfactionRate: '98.6%',
      activeBurgersCount: inMemoryProducts.filter(p => p.available !== false).length
    },
    segments: [
      { name: 'VIP Gold (> $100)', count: vipCount, share: `${Math.round((vipCount / totalCustomers) * 100)}%`, color: '#d97706' },
      { name: 'Recurrentes Silver ($40-$100)', count: recurrentCount, share: `${Math.round((recurrentCount / totalCustomers) * 100)}%`, color: '#64748b' },
      { name: 'Ocasionales Bronce (< $40)', count: occasionalCount, share: `${Math.round((occasionalCount / totalCustomers) * 100)}%`, color: '#ea580c' }
    ],
    topCustomers: [...inMemoryCustomers].sort((a, b) => b.totalSpent - a.totalSpent),
    popularBurgers: inMemoryProducts.slice(0, 5).map(b => ({
      name: b.name,
      orders: Math.floor(b.stock * 1.5) + b.reviewsCount,
      rating: b.rating
    }))
  };
}

function getDbStatus() {
  return {
    mode: isConnectedToMySQL ? 'mysql' : 'in-memory',
    connected: isConnectedToMySQL,
    host: process.env.DB_HOST || (process.env.DATABASE_URL ? 'via-database-url' : 'in-memory-storage'),
    database: process.env.DB_NAME || 'hamburger_rapid_db',
    user: process.env.DB_USER || 'rapid_admin',
    port: process.env.DB_PORT || 3306,
    activePoolConnections: isConnectedToMySQL ? 1 : 0,
    totalProductsLoaded: inMemoryProducts.length,
    totalSimulatedOrders: inMemoryOrders.length,
    error: lastDbError
  };
}

module.exports = {
  initDB,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  resetProducts,
  getOrders,
  createOrder,
  getMetrics,
  getDbStatus,
  INITIAL_HAMBURGERS,
  INITIAL_CUSTOMERS
};
