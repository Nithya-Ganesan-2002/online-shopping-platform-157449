require('dotenv').config();
const app = require('./app');
const { healthCheck } = require('./config/db');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, async () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
  try {
    await healthCheck();
    console.log('Database connectivity check passed');
  } catch (err) {
    console.error('Database connectivity check failed:', err.message);
  }
});

// Graceful shutdown
function shutdown(signal) {
  console.log(`${signal} signal received: closing HTTP server`);
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = server;
