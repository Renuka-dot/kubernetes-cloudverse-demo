const express = require('express');
const cors    = require('cors');
const jwt     = require('jsonwebtoken');
const axios   = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET         = process.env.JWT_SECRET || 'cloudverse-super-secret-key-2024';
const NOTIFICATION_URL   = process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:4006';

const orders = [];

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ message: 'Invalid token' }); }
};

app.post('/api/orders', authenticate, async (req, res) => {
  const { items } = req.body;
  if (!items || items.length === 0) return res.status(400).json({ message: 'No items in order' });
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const order = {
    id: `ORD-${Date.now()}`,
    userId: req.user.id, username: req.user.username,
    items, total, status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  orders.push(order);

  // Pod-to-Pod: calls notification-service via ClusterIP DNS
  try {
    await axios.post(`${NOTIFICATION_URL}/api/notify/order`, {
      orderId: order.id, username: req.user.username, total
    });
    console.log(`[ORDER] Notification sent for order ${order.id}`);
  } catch (err) {
    console.log('[ORDER] Notification service call failed (non-critical):', err.message);
  }

  res.status(201).json(order);
});

app.get('/api/orders', authenticate, (req, res) => {
  const userOrders = orders.filter(o => o.userId === req.user.id);
  res.json({ orders: userOrders, total: userOrders.length });
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'order-service' }));
app.listen(4004, () => console.log('Order Service running on port 4004'));
