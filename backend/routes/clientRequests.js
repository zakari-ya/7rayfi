const express = require('express');
const {
  createClientRequest,
  getAllClientRequests,
  getClientRequestById,
  updateClientRequestStatus,
  contactArtisan,
  updateArtisanContactStatus,
  getClientRequestStats,
} = require('../controllers/clientRequestController');
const {
  validateClientRequest,
  validateObjectId,
} = require('../middleware/validation');

const router = express.Router();

// Routes pour les demandes clients
router.get('/', getAllClientRequests);
router.get('/stats', getClientRequestStats);
router.get('/:id', validateObjectId('id'), getClientRequestById);
router.post('/', validateClientRequest, createClientRequest);
router.put('/:id/status', validateObjectId('id'), updateClientRequestStatus);

// Routes pour la gestion des contacts avec les artisans
router.post('/:id/contact', validateObjectId('id'), contactArtisan);
router.put('/:id/artisan/:artisanId/status', validateObjectId('id'), validateObjectId('artisanId'), updateArtisanContactStatus);

// Alias pour la route POST /demandes (comme mentionné dans le ticket)
router.post('/create', validateClientRequest, createClientRequest);

module.exports = router;