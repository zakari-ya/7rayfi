// Middleware de logging
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const { method, url, ip } = req;
  
  console.log(`[${timestamp}] ${method} ${url} - ${ip}`);
  next();
};

// Middleware pour les routes non trouvées
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} non trouvée`,
  });
};

// Gestionnaire d'erreurs global
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  
  console.error(err);
  
  // Erreur de Cast (ID invalide)
  if (err.name === 'CastError') {
    const message = 'Ressource non trouvée';
    error = { message, statusCode: 404 };
  }
  
  // Erreur de validation Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }
  
  // Erreur de duplication (email, etc.)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} déjà utilisé`;
    error = { message, statusCode: 409 };
  }
  
  // Erreur de connexion MongoDB
  if (err.name === 'MongoNetworkError' || err.name === 'MongooseServerSelectionError') {
    const message = 'Erreur de connexion à la base de données';
    error = { message, statusCode: 503 };
  }
  
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Erreur serveur interne',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// Middleware pour limiter le taux de requêtes (optionnel)
const rateLimiter = (req, res, next) => {
  // Implémentation basique - en production, utilisez une solution plus robuste
  req.requestTime = Date.now();
  next();
};

module.exports = {
  logger,
  notFound,
  errorHandler,
  rateLimiter,
};