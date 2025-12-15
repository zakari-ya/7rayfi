const express = require('express');
const {
  getAllCategories,
  getCategoryById,
  searchCategories,
} = require('../controllers/serviceCategoryController');
const { validateObjectId } = require('../middleware/validation');

const router = express.Router();

// Routes pour les catégories de services
router.get('/', getAllCategories);
router.get('/search', searchCategories);
router.get('/:id', validateObjectId('id'), getCategoryById);

module.exports = router;