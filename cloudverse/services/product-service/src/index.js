const express = require('express');
const cors    = require('cors');
const jwt     = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'cloudverse-super-secret-key-2024';

const products = [
  {id:1, name:'Kubernetes Mastery Course', price:99,  category:'Education',    icon:'☸️', rating:4.9, stock:100},
  {id:2, name:'Docker Deep Dive',          price:79,  category:'Education',    icon:'🐳', rating:4.8, stock:85},
  {id:3, name:'AWS Solutions Architect',   price:149, category:'Certification',icon:'☁️', rating:4.9, stock:200},
  {id:4, name:'Terraform Bootcamp',        price:89,  category:'DevOps',       icon:'🏗️', rating:4.7, stock:60},
  {id:5, name:'CI/CD Pipeline Setup',      price:59,  category:'DevOps',       icon:'🔄', rating:4.6, stock:120},
  {id:6, name:'Microservices Design',      price:119, category:'Architecture', icon:'🔗', rating:4.8, stock:75},
  {id:7, name:'Prometheus & Grafana',      price:69,  category:'Monitoring',   icon:'📊', rating:4.7, stock:90},
  {id:8, name:'Helm Charts Guide',         price:49,  category:'Kubernetes',   icon:'⛵', rating:4.5, stock:110},
];

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ message: 'Invalid token' }); }
};

app.get('/api/products', authenticate, (req, res) => {
  const { category, search } = req.query;
  let result = products;
  if (category) result = result.filter(p => p.category === category);
  if (search)   result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  res.json({ products: result, total: result.length });
});

app.get('/api/products/:id', authenticate, (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'product-service' }));
app.listen(4003, () => console.log('Product Service running on port 4003'));
