const express = require('express');
const cors    = require('cors');

const app       = express();
const startTime = Date.now();

app.use(cors());
app.use(express.json());

app.get('/api/analytics/stats', (req, res) => {
  res.json({
    totalUsers: 1247, totalOrders: 8563, totalRevenue: 945230,
    activeServices: 10, uptimeSeconds: Math.floor((Date.now()-startTime)/1000),
    uptimePercent: '99.9%', avgResponseTime: '48ms', requestsPerMinute: 1420,
    topProducts: [
      { name: 'AWS Solutions Architect', sales: 412 },
      { name: 'Kubernetes Mastery',      sales: 389 },
      { name: 'Docker Deep Dive',        sales: 301 },
    ]
  });
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'analytics-service', uptime: process.uptime() }));
app.listen(4007, () => console.log('Analytics Service running on port 4007'));
