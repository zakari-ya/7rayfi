const Artisan = require('../models/Artisan');
const ServiceCategory = require('../models/ServiceCategory');

// Récupérer tous les artisans avec filtres et pagination
const getAllArtisans = async (req, res) => {
  try {
    const {
      profession,
      city,
      category,
      minRating,
      maxRate,
      availability,
      page = 1,
      limit = 20,
      sortBy = 'rating',
      sortOrder = 'desc',
    } = req.query;
    
    // Construction du filtre
    const filter = { isActive: true };
    
    if (profession) {
      filter.profession = { $regex: profession, $options: 'i' };
    }
    
    if (city) {
      filter.city = { $regex: city, $options: 'i' };
    }
    
    if (category) {
      filter.categories = category;
    }
    
    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }
    
    if (maxRate) {
      filter.hourlyRate = { $lte: parseFloat(maxRate) };
    }
    
    if (availability) {
      filter.availability = availability;
    }
    
    // Options de tri
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Exécution de la requête
    const [artisans, total] = await Promise.all([
      Artisan.find(filter)
        .populate('categories', 'name slug')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Artisan.countDocuments(filter),
    ]);
    
    res.json({
      success: true,
      data: artisans,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        count: total,
        limit: parseInt(limit),
      },
      filters: {
        profession,
        city,
        category,
        minRating,
        maxRate,
        availability,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des artisans:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des artisans',
    });
  }
};

// Récupérer un artisan par ID
const getArtisanById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const artisan = await Artisan.findById(id)
      .populate('categories', 'name slug description')
      .lean();
    
    if (!artisan) {
      return res.status(404).json({
        success: false,
        error: 'Artisan non trouvé',
      });
    }
    
    res.json({
      success: true,
      data: artisan,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'artisan:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'ID artisan invalide',
      });
    }
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération de l\'artisan',
    });
  }
};

// Rechercher des artisans
const searchArtisans = async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    
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
    
    const artisans = await Artisan.find(searchQuery)
      .populate('categories', 'name slug')
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit))
      .lean();
    
    res.json({
      success: true,
      data: artisans,
      count: artisans.length,
      query: q.trim(),
    });
  } catch (error) {
    console.error('Erreur lors de la recherche d\'artisans:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la recherche d\'artisans',
    });
  }
};

// Inscrire un nouvel artisan
const registerArtisan = async (req, res) => {
  try {
    console.log('📝 Nouvelle inscription artisan - Données reçues:', {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      profession: req.body.profession,
      categoriesCount: req.body.categories?.length,
      city: req.body.city,
    });
    
    const {
      firstName,
      lastName,
      email,
      phone,
      profession,
      categories,
      city,
      serviceAreas,
      experience,
      hourlyRate,
      pricingNote,
      availability,
      description,
      portfolioLinks,
      skills,
      smsVerified,
    } = req.body;
    
    // Vérifier si l'email existe déjà
    const existingArtisan = await Artisan.findOne({ email: email.toLowerCase() });
    if (existingArtisan) {
      console.log('⚠️ Email déjà existant:', email);
      return res.status(409).json({
        success: false,
        error: 'Un artisan avec cette adresse email existe déjà',
      });
    }
    
    // Vérifier si les catégories existent
    console.log('🔍 Vérification des catégories:', categories);
    const validCategories = await ServiceCategory.find({
      _id: { $in: categories },
      isActive: true,
    });
    console.log('✅ Catégories valides trouvées:', validCategories.length);
    
    if (validCategories.length !== categories.length) {
      console.log('⚠️ Catégories invalides - attendues:', categories.length, 'trouvées:', validCategories.length);
      return res.status(400).json({
        success: false,
        error: 'Une ou plusieurs catégories sont invalides',
      });
    }
    
    // Créer le nouvel artisan
    const artisanData = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      profession,
      categories,
      city,
      serviceAreas: serviceAreas || [],
      experience: experience ? parseInt(experience) : undefined,
      hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
      pricingNote,
      availability: availability || 'immediate',
      description,
      portfolioLinks: portfolioLinks || [],
      skills: skills || [],
      smsVerified: smsVerified || false,
      isActive: true,
      isAvailable: true,
    };
    
    const artisan = new Artisan(artisanData);
    await artisan.save();
    
    // Populate les catégories pour la réponse
    await artisan.populate('categories', 'name slug');
    
    console.log('✅ Artisan créé avec succès:', artisan._id);
    
    res.status(201).json({
      success: true,
      data: artisan,
      message: 'Artisan enregistré avec succès',
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement de l\'artisan:', error);
    console.error('Stack trace:', error.stack);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
      }));
      
      return res.status(400).json({
        success: false,
        error: 'Données invalides',
        details: validationErrors,
      });
    }
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'Un artisan avec cet email ou ce numéro de téléphone existe déjà',
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'enregistrement de l\'artisan',
    });
  }
};

// Mettre à jour un artisan
const updateArtisan = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const artisan = await Artisan.findById(id);
    if (!artisan) {
      return res.status(404).json({
        success: false,
        error: 'Artisan non trouvé',
      });
    }
    
    // Si des catégories sont mises à jour, les valider
    if (updateData.categories) {
      const validCategories = await ServiceCategory.find({
        _id: { $in: updateData.categories },
        isActive: true,
      });
      
      if (validCategories.length !== updateData.categories.length) {
        return res.status(400).json({
          success: false,
          error: 'Une ou plusieurs catégories sont invalides',
        });
      }
    }
    
    // Mettre à jour les champs autorisés
    const allowedFields = [
      'firstName', 'lastName', 'phone', 'profession', 'categories',
      'city', 'address', 'experience', 'hourlyRate', 'availability',
      'description', 'skills', 'portfolio', 'isAvailable'
    ];
    
    const filteredUpdateData = {};
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        filteredUpdateData[field] = updateData[field];
      }
    });
    
    const updatedArtisan = await Artisan.findByIdAndUpdate(
      id,
      filteredUpdateData,
      { new: true, runValidators: true }
    ).populate('categories', 'name slug');
    
    res.json({
      success: true,
      data: updatedArtisan,
      message: 'Artisan mis à jour avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'artisan:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
      }));
      
      return res.status(400).json({
        success: false,
        error: 'Données invalides',
        details: validationErrors,
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'ID artisan invalide',
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour de l\'artisan',
    });
  }
};

// Statistiques des artisans
const getArtisanStats = async (req, res) => {
  try {
    const stats = await Artisan.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalArtisans: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          averageHourlyRate: { $avg: '$hourlyRate' },
          citiesCount: { $addToSet: '$city' },
          professionsCount: { $addToSet: '$profession' },
        },
      },
      {
        $project: {
          _id: 0,
          totalArtisans: 1,
          averageRating: { $round: ['$averageRating', 1] },
          averageHourlyRate: { $round: ['$averageHourlyRate', 2] },
          citiesCount: { $size: '$citiesCount' },
          professionsCount: { $size: '$professionsCount' },
        },
      },
    ]);
    
    const distribution = await Artisan.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$city',
          count: { $sum: 1 },
          averageRating: { $avg: '$rating' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    
    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalArtisans: 0,
          averageRating: 0,
          averageHourlyRate: 0,
          citiesCount: 0,
          professionsCount: 0,
        },
        topCities: distribution,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques',
    });
  }
};

module.exports = {
  getAllArtisans,
  getArtisanById,
  searchArtisans,
  registerArtisan,
  updateArtisan,
  getArtisanStats,
};