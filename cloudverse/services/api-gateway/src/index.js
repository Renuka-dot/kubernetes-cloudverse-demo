const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors    = require('cors');
const morgan  = require('morgan');

const app = express();
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

const services = {
  auth:         process.env.AUTH_SERVICE_URL         || 'http://auth-service:4001',
  user:         process.env.USER_SERVICE_URL         || 'http://user-service:4002',
  product:      process.env.PRODUCT_SERVICE_URL      || 'http://product-service:4003',
  order:        process.env.ORDER_SERVICE_URL        || 'http://order-service:4004',
  cart:         process.env.CART_SERVICE_URL         || 'http://cart-service:4005',
  notification: process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:4006',
  analytics:    process.env.ANALYTICS_SERVICE_URL    || 'http://analytics-service:4007',
  search:       process.env.SEARCH_SERVICE_URL       || 'http://search-service:4008',
};

app.use('/api/auth',      createProxyMiddleware({ target: services.auth,         changeOrigin: true }));
app.use('/api/user',      createProxyMiddleware({ target: services.user,         changeOrigin: true }));
app.use('/api/products',  createProxyMiddleware({ target: services.product,      changeOrigin: true }));
app.use('/api/orders',    createProxyMiddleware({ target: services.order,        changeOrigin: true }));
app.use('/api/cart',      createProxyMiddleware({ target: services.cart,         changeOrigin: true }));
app.use('/api/notify',    createProxyMiddleware({ target: services.notification, changeOrigin: true }));
app.use('/api/analytics', createProxyMiddleware({ target: services.analytics,    changeOrigin: true }));
app.use('/api/search',    createProxyMiddleware({ target: services.search,       changeOrigin: true }));

app.get('/api/gateway/health', (req, res) => {
  res.json({
    status: 'healthy', service: 'api-gateway',
    timestamp: new Date().toISOString(),
    services: Object.keys(services).map(name => ({ name, url: services[name], status: 'routed' }))
  });
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'api-gateway' }));
app.listen(4000, () => console.log('API Gateway running on port 4000'));
