const express = require('express');
const {
  getAllArtisans,
  getArtisanById,
  searchArtisans,
  registerArtisan,
  updateArtisan,
  getArtisanStats,
} = require('../controllers/artisanController');
const {
  validateArtisanRegistration,
  validateArtisanSearch,
  validateObjectId,
} = require('../middleware/validation');

const router = express.Router();

// Routes pour les artisans
router.get('/', validateArtisanSearch, getAllArtisans);
router.get('/search', searchArtisans);
router.get('/stats', getArtisanStats);
router.get('/:id', validateObjectId('id'), getArtisanById);
router.post('/', validateArtisanRegistration, registerArtisan);
router.put('/:id', validateObjectId('id'), updateArtisan);

module.exports = router;