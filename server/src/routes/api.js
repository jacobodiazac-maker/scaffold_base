const express = require('express');
const router = express.Router();
const db = require('../db');

// Health Check Endpoint (For Dokploy Health Checks & Admin DB Status)
router.get('/health', (req, res) => {
  const dbStatus = db.getDbStatus();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    platform: 'Hamburger Rapid Commercial v1.0',
    database: dbStatus
  });
});

// List all hamburgers/products
router.get('/products', async (req, res) => {
  try {
    const products = await db.getProducts();
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new burger
router.post('/products', async (req, res) => {
  try {
    const { name, category, price, stock, image, description, specialtyLevel, badgeType } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ success: false, error: 'Nombre y precio son requeridos.' });
    }
    const product = await db.addProduct({ name, category, price, stock, image, description, specialtyLevel, badgeType });
    res.status(201).json({ success: true, message: 'Hamburguesa agregada exitosamente', data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update burger (e.g. toggle availability, stock, price)
router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await db.updateProduct(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Hamburguesa no encontrada' });
    }
    res.json({ success: true, message: 'Hamburguesa actualizada', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete burger
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteProduct(id);
    res.json({ success: true, message: `Hamburguesa ${id} eliminada.` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Orders API (for PWA simulation)
router.get('/orders', async (req, res) => {
  try {
    const orders = await db.getOrders();
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/orders', async (req, res) => {
  try {
    const { customerName, items, total, paymentMethod } = req.body;
    const order = await db.createOrder({ customerName, items, total, paymentMethod });
    res.status(201).json({ success: true, message: 'Orden creada exitosamente', data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Metrics API (Consumers, consumption levels, business health)
router.get('/metrics', async (req, res) => {
  try {
    const metrics = await db.getMetrics();
    res.json({ success: true, data: metrics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reset initial products
router.post('/reset', async (req, res) => {
  try {
    await db.resetProducts();
    res.json({ success: true, message: 'Menú y datos demo de Hamburger Rapid restablecidos.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
