const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Endpoints
app.use('/api', apiRoutes);

// Define paths for the 3 compiled frontends
const pwaPath = path.join(__dirname, '../public/pwa');
const adminPath = path.join(__dirname, '../public/admin');
const ecommercePath = path.join(__dirname, '../public/ecommerce');

function hasBuild(dir) {
  return fs.existsSync(path.join(dir, 'index.html'));
}

// 1. Mobile PWA under /app
if (hasBuild(pwaPath)) {
  app.use('/app', express.static(pwaPath));
  app.get('/app/*', (req, res) => {
    res.sendFile(path.join(pwaPath, 'index.html'));
  });
} else {
  app.get('/app*', (req, res) => {
    res.send(`
      <div style="font-family:sans-serif;text-align:center;padding:50px;background:#faf9f6;min-height:100vh;">
        <h2>📱 Hamburger Rapid PWA Mobile</h2>
        <p>Ejecuta <code>npm run build:all</code> o <code>npm run build:pwa</code> para compilar la app móvil.</p>
        <p><a href="/" style="color:#c2410c;">Volver al E-commerce</a> | <a href="/admin" style="color:#c2410c;">Panel Admin</a></p>
      </div>
    `);
  });
}

// 2. Control Panel under /admin
if (hasBuild(adminPath)) {
  app.use('/admin', express.static(adminPath));
  app.get('/admin/*', (req, res) => {
    res.sendFile(path.join(adminPath, 'index.html'));
  });
} else {
  app.get('/admin*', (req, res) => {
    res.send(`
      <div style="font-family:sans-serif;text-align:center;padding:50px;background:#faf9f6;min-height:100vh;">
        <h2>⚙️ Hamburger Rapid Admin Dashboard</h2>
        <p>Ejecuta <code>npm run build:all</code> o <code>npm run build:admin</code> para compilar el panel administrativo.</p>
        <p><a href="/" style="color:#c2410c;">Volver al E-commerce</a> | <a href="/app" style="color:#c2410c;">PWA Mobile</a></p>
      </div>
    `);
  });
}

// 3. E-commerce Portal on Root /
if (hasBuild(ecommercePath)) {
  app.use(express.static(ecommercePath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(ecommercePath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>Hamburger Rapid - Plataforma Comercial</title>
        <style>
          body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background: #faf9f6; color: #1c1917; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
          .card { background: #ffffff; padding: 2.5rem; border-radius: 1.5rem; max-width: 650px; text-align: center; border: 1px solid #e7e2d9; box-shadow: 0 20px 40px -10px rgba(28,25,23,0.1); }
          h1 { color: #c2410c; margin-bottom: 0.5rem; }
          .badge { display: inline-block; background: #ffedd5; color: #c2410c; padding: 0.35rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 700; margin-bottom: 1.5rem; }
          .links { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; flex-wrap: wrap; }
          .btn { background: #c2410c; color: white; text-decoration: none; padding: 0.75rem 1.25rem; border-radius: 0.75rem; font-weight: 700; transition: transform 0.2s; }
          .btn:hover { transform: translateY(-2px); }
          .status { text-align: left; background: #faf7f2; padding: 1rem; border-radius: 0.75rem; font-family: monospace; font-size: 0.85rem; margin-top: 1.5rem; border: 1px solid #e7e2d9; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🍔 Hamburger Rapid Commercial v1.0</h1>
          <div class="badge">Primera Versión Comercial Lista</div>
          <p>Servidor backend activo. Si estás viendo esta pantalla, ejecuta <code>npm run build:all</code> para sincronizar los artefactos estáticos compilados en <code>server/public</code>.</p>
          <div class="links">
            <a class="btn" href="/app">📱 PWA Mobile</a>
            <a class="btn" href="/admin" style="background:#1c1917;">⚙️ Panel Admin</a>
            <a class="btn" style="background:#059669;" href="/api/health">🩺 Health Check</a>
            <a class="btn" style="background:#d97706;" href="/api/products">📦 API Catálogo</a>
          </div>
          <div class="status">
            <div>• Puerto: ${PORT}</div>
            <div>• Estado DB: ${db.getDbStatus().mode}</div>
            <div>• Entorno: ${process.env.NODE_ENV || 'development'}</div>
          </div>
        </div>
      </body>
      </html>
    `);
  });
}

// Start server and initialize DB
async function start() {
  await db.initDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🍔 Hamburger Rapid Platform ejecutándose en puerto ${PORT}`);
    console.log(`   - E-commerce:  http://localhost:${PORT}/`);
    console.log(`   - PWA Mobile:  http://localhost:${PORT}/app`);
    console.log(`   - Panel Admin: http://localhost:${PORT}/admin`);
    console.log(`   - API Health:  http://localhost:${PORT}/api/health`);
    console.log(`   - API Metrics: http://localhost:${PORT}/api/metrics`);
    console.log(`=======================================================`);
  });
}

start();
