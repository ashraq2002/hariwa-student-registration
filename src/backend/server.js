import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

// Security and Protection Middlewares
import { securityHeaders, sanitizeInputs, apiRateLimiter } from './middleware/securityMiddleware.js';

// MVC backend routes
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { getStats } from './controllers/studentController.js';
import { authenticateUser, requireAdmin, requireVerifiedEmail } from './middleware/authMiddleware.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // 1. Global Security Headers (anti-sniff, clickjacking protection, cache-control)
  app.use(securityHeaders);

  // 2. Custom middleware to handle base64 documents and larger metadata packages safely
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // 3. Payload sanitization
  app.use(sanitizeInputs);

  // 4. Rate limiting on all /api routes
  app.use('/api', apiRateLimiter);

  // --- MVC ROUTE REGISTERING ---
  app.use('/api/auth', authRoutes);
  app.use('/api/students', studentRoutes);
  app.use('/api/notifications', notificationRoutes);
  
  // Stats route mapped for administrative portal analytics
  app.get('/api/stats', authenticateUser, requireVerifiedEmail, requireAdmin, getStats);

  // --- VITE DEVELOPMENT OR PRODUCTION STATIC SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        watch: {
          ignored: ['**/db_store.json', '**/db_store*'],
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[ASU MVC Server] active and listening on port :${PORT}`);
  });
}

startServer();
