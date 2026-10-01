const express = require('express');
const cors    = require('cors');
const jwt     = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'cloudverse-super-secret-key-2024';
const carts      = {};

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ message: 'Invalid token' }); }
};

app.get('/api/cart', authenticate, (req, res) => {
  const items = carts[req.user.id] || [];
  res.json({ items, total: items.reduce((s,i)=>s+i.price*i.quantity, 0) });
});

app.post('/api/cart/add', authenticate, (req, res) => {
  const { productId, name, price, quantity } = req.body;
  if (!carts[req.user.id]) carts[req.user.id] = [];
  const existing = carts[req.user.id].find(i => i.productId === productId);
  if (existing) { existing.quantity += quantity || 1; }
  else { carts[req.user.id].push({ productId, name, price, quantity: quantity||1 }); }
  res.json({ message: 'Item added', items: carts[req.user.id] });
});

app.delete('/api/cart/:productId', authenticate, (req, res) => {
  if (carts[req.user.id])
    carts[req.user.id] = carts[req.user.id].filter(i => i.productId !== parseInt(req.params.productId));
  res.json({ message: 'Item removed', items: carts[req.user.id]||[] });
});

app.delete('/api/cart', authenticate, (req, res) => {
  carts[req.user.id] = [];
  res.json({ message: 'Cart cleared' });
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'cart-service' }));
app.listen(4005, () => console.log('Cart Service running on port 4005'));
