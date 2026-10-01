const express  = require('express');
const { Pool } = require('pg');
const jwt      = require('jsonwebtoken');
const cors     = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'cloudverse-super-secret-key-2024';

const pool = new Pool({
  host:     process.env.DB_HOST           || 'postgres-service',
  port:     parseInt(process.env.DB_PORT  || '5432'),
  database: process.env.POSTGRES_DB       || 'cloudverse',
  user:     process.env.POSTGRES_USER     || 'cloudverse',
  password: process.env.POSTGRES_PASSWORD || 'cloudverse123',
});

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ message: 'Invalid token' }); }
};

app.get('/api/user/profile', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id,username,email,created_at FROM users WHERE id = $1', [req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ message: 'Internal server error' }); }
});

app.get('/api/user/all', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT id,username,email,created_at FROM users ORDER BY created_at DESC');
    res.json({ users: result.rows, total: result.rows.length });
  } catch (err) { res.status(500).json({ message: 'Internal server error' }); }
});

app.get('/health',          (req, res) => res.json({ status: 'ok', service: 'user-service' }));
app.get('/api/user/health', (req, res) => res.json({ status: 'ok', service: 'user-service' }));
app.listen(4002, () => console.log('User Service running on port 4002'));
