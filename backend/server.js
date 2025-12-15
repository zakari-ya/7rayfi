require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import des middlewares
const { logger, notFound, errorHandler, rateLimiter } = require('./middleware/errorHandler');

// Import des routes
const serviceCategoriesRoutes = require('./routes/serviceCategories');
const artisansRoutes = require('./routes/artisans');
const clientRequestsRoutes = require('./routes/clientRequests');

const app = express();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/7rayfi';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

// Middlewares globaux
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(logger);
app.use(rateLimiter);

// Connexion à MongoDB
if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI, {
      // Options de connexion pour une meilleure stabilité
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    .then(() => {
      console.log('✅ Connected to MongoDB');
      
      // Écouter les événements de connexion
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });
      
      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
      });
    })
    .catch(err => {
      console.error('❌ MongoDB connection error:', err);
      process.exit(1);
    });
}

// Routes de base
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: dbStatus,
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API 7rayfi',
    version: '1.0.0',
    endpoints: {
      categories: '/api/services',
      artisans: '/api/artisans',
      requests: '/api/demandes',
    },
    documentation: 'Consultez le README.md pour la documentation complète de l\'API',
  });
});

// Routes API
app.use('/api/services', serviceCategoriesRoutes);
app.use('/api/artisans', artisansRoutes);
app.use('/api/demandes', clientRequestsRoutes);

// Route pour la compatibilité avec l'ancienne structure
app.use('/api/client-requests', clientRequestsRoutes);

// Middlewares de gestion d'erreurs (doivent être après les routes)
app.use(notFound);
app.use(errorHandler);

// Démarrage du serveur
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API base: http://localhost:${PORT}/api`);
});

// Gestion gracieuse de l'arrêt
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;
