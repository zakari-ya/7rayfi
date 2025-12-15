const ServiceCategory = require('../models/ServiceCategory');

// Récupérer toutes les catégories de services
const getAllCategories = async (req, res) => {
  try {
    const { active = 'true', sortBy = 'order', sortOrder = 'asc' } = req.query;
    
    const filter = {};
    if (active !== 'all') {
      filter.isActive = active === 'true';
    }
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const categories = await ServiceCategory.find(filter)
      .sort(sortOptions)
      .lean();
    
    res.json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des catégories de services',
    });
  }
};

// Récupérer une catégorie par ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await ServiceCategory.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Catégorie de service non trouvée',
      });
    }
    
    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'ID de catégorie invalide',
      });
    }
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération de la catégorie',
    });
  }
};

// Rechercher des catégories
const searchCategories = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Le terme de recherche doit contenir au moins 2 caractères',
      });
    }
    
    const searchQuery = {
      $text: { $search: q.trim() },
      isActive: true,
    };
    
    const categories = await ServiceCategory.find(searchQuery)
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit))
      .lean();
    
    res.json({
      success: true,
      data: categories,
      count: categories.length,
      query: q.trim(),
    });
  } catch (error) {
    console.error('Erreur lors de la recherche de catégories:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la recherche de catégories',
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  searchCategories,
};