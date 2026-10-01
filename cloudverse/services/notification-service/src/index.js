const express = require('express');
const cors    = require('cors');

const app           = express();
const notifications = [];

app.use(cors());
app.use(express.json());

// Called by order-service via pod-to-pod (ClusterIP)
app.post('/api/notify/order', (req, res) => {
  const { orderId, username, total } = req.body;
  const notification = {
    id: Date.now(), type: 'order_confirmed',
    message: `Order ${orderId} confirmed for ${username} — $${total}`,
    timestamp: new Date().toISOString(), read: false
  };
  notifications.push(notification);
  console.log(`[NOTIFICATION] ${notification.message}`);
  res.json({ success: true, notification });
});

app.get('/api/notify', (req, res) => {
  res.json({ notifications, unread: notifications.filter(n=>!n.read).length });
});

app.put('/api/notify/:id/read', (req, res) => {
  const n = notifications.find(n => n.id === parseInt(req.params.id));
  if (n) n.read = true;
  res.json({ success: true });
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'notification-service' }));
app.listen(4006, () => console.log('Notification Service running on port 4006'));
