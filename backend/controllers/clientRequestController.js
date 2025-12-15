const ClientRequest = require('../models/ClientRequest');
const ServiceCategory = require('../models/ServiceCategory');
const Artisan = require('../models/Artisan');

// Créer une nouvelle demande client
const createClientRequest = async (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      clientPhone,
      serviceCategory,
      serviceType,
      description,
      city,
      address,
      budget,
      deadline,
      priority,
      isUrgent,
      notes,
    } = req.body;
    
    // Vérifier si la catégorie de service existe
    const category = await ServiceCategory.findById(serviceCategory);
    if (!category) {
      return res.status(400).json({
        success: false,
        error: 'Catégorie de service invalide',
      });
    }
    
    // Vérifier le budget
    if (budget && budget.min && budget.max && budget.min > budget.max) {
      return res.status(400).json({
        success: false,
        error: 'Le budget minimum ne peut pas être supérieur au budget maximum',
      });
    }
    
    // Vérifier la date limite
    if (deadline && new Date(deadline) < new Date()) {
      return res.status(400).json({
        success: false,
        error: 'La date limite ne peut pas être dans le passé',
      });
    }
    
    // Créer la demande
    const clientRequestData = {
      clientName,
      clientEmail: clientEmail.toLowerCase(),
      clientPhone,
      serviceCategory,
      serviceType,
      description,
      city,
      address,
      budget: budget || {},
      deadline: deadline ? new Date(deadline) : undefined,
      priority: priority || 'medium',
      isUrgent: isUrgent || false,
      notes,
      status: 'pending',
    };
    
    const request = new ClientRequest(clientRequestData);
    await request.save();
    
    // Populate les données pour la réponse
    await request.populate('serviceCategory', 'name slug');
    
    res.status(201).json({
      success: true,
      data: request,
      message: 'Demande créée avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la création de la demande:', error);
    
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
    
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création de la demande',
    });
  }
};

// Récupérer toutes les demandes avec filtres
const getAllClientRequests = async (req, res) => {
  try {
    const {
      status,
      city,
      serviceCategory,
      priority,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;
    
    // Construction du filtre
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (city) {
      filter.city = { $regex: city, $options: 'i' };
    }
    
    if (serviceCategory) {
      filter.serviceCategory = serviceCategory;
    }
    
    if (priority) {
      filter.priority = priority;
    }
    
    // Options de tri
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Exécution de la requête
    const [requests, total] = await Promise.all([
      ClientRequest.find(filter)
        .populate('serviceCategory', 'name slug')
        .populate('contactedArtisans.artisan', 'firstName lastName profession city rating')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      ClientRequest.countDocuments(filter),
    ]);
    
    res.json({
      success: true,
      data: requests,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        count: total,
        limit: parseInt(limit),
      },
      filters: {
        status,
        city,
        serviceCategory,
        priority,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des demandes',
    });
  }
};

// Récupérer une demande par ID
const getClientRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const request = await ClientRequest.findById(id)
      .populate('serviceCategory', 'name slug description')
      .populate('contactedArtisans.artisan', 'firstName lastName email phone profession city rating hourlyRate')
      .lean();
    
    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Demande non trouvée',
      });
    }
    
    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la demande:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'ID demande invalide',
      });
    }
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération de la demande',
    });
  }
};

// Mettre à jour le statut d'une demande
const updateClientRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const validStatuses = ['pending', 'contacted', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Statut invalide',
      });
    }
    
    const request = await ClientRequest.findByIdAndUpdate(
      id,
      { 
        status,
        ...(notes && { notes })
      },
      { new: true, runValidators: true }
    )
      .populate('serviceCategory', 'name slug')
      .populate('contactedArtisans.artisan', 'firstName lastName profession city rating');
    
    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Demande non trouvée',
      });
    }
    
    res.json({
      success: true,
      data: request,
      message: 'Statut de la demande mis à jour avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    
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
        error: 'ID demande invalide',
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour du statut',
    });
  }
};

// Contacter un artisan pour une demande
const contactArtisan = async (req, res) => {
  try {
    const { id } = req.params; // ID de la demande
    const { artisanId, notes } = req.body;
    
    // Vérifier si la demande existe
    const request = await ClientRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Demande non trouvée',
      });
    }
    
    // Vérifier si l'artisan existe
    const artisan = await Artisan.findById(artisanId);
    if (!artisan) {
      return res.status(404).json({
        success: false,
        error: 'Artisan non trouvé',
      });
    }
    
    // Vérifier si l'artisan a déjà été contacté
    const existingContact = request.contactedArtisans.find(
      contact => contact.artisan.toString() === artisanId
    );
    
    if (existingContact) {
      // Mettre à jour le contact existant
      existingContact.status = 'contacted';
      if (notes) existingContact.notes = notes;
    } else {
      // Ajouter un nouveau contact
      request.contactedArtisans.push({
        artisan: artisanId,
        status: 'contacted',
        notes,
      });
    }
    
    await request.save();
    
    // Mettre à jour le statut de la demande si nécessaire
    if (request.status === 'pending') {
      request.status = 'contacted';
      await request.save();
    }
    
    // Populate les données pour la réponse
    await request.populate('serviceCategory', 'name slug');
    await request.populate('contactedArtisans.artisan', 'firstName lastName profession city rating');
    
    res.json({
      success: true,
      data: request,
      message: 'Artisan contacté avec succès',
    });
  } catch (error) {
    console.error('Erreur lors du contact de l\'artisan:', error);
    
    if (error.message === 'Artisan non trouvé dans les contacts') {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Erreur lors du contact de l\'artisan',
    });
  }
};

// Mettre à jour le statut d'un artisan contacté
const updateArtisanContactStatus = async (req, res) => {
  try {
    const { id, artisanId } = req.params; // ID de la demande et ID de l'artisan
    const { status, notes } = req.body;
    
    const validStatuses = ['pending', 'contacted', 'interested', 'not_interested'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Statut invalide',
      });
    }
    
    const request = await ClientRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Demande non trouvée',
      });
    }
    
    // Mettre à jour le statut de l'artisan
    await request.updateArtisanStatus(artisanId, status, notes);
    
    // Populate les données pour la réponse
    await request.populate('serviceCategory', 'name slug');
    await request.populate('contactedArtisans.artisan', 'firstName lastName profession city rating');
    
    res.json({
      success: true,
      data: request,
      message: 'Statut de l\'artisan mis à jour avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de l\'artisan:', error);
    
    if (error.message === 'Artisan non trouvé dans les contacts') {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'ID invalide',
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour du statut de l\'artisan',
    });
  }
};

// Statistiques des demandes
const getClientRequestStats = async (req, res) => {
  try {
    const stats = await ClientRequest.aggregate([
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          pendingRequests: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
          },
          contactedRequests: {
            $sum: { $cond: [{ $eq: ['$status', 'contacted'] }, 1, 0] },
          },
          completedRequests: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
          urgentRequests: {
            $sum: { $cond: ['$isUrgent', 1, 0] },
          },
          averageBudget: { $avg: { $avg: ['$budget.min', '$budget.max'] } },
        },
      },
      {
        $project: {
          _id: 0,
          totalRequests: 1,
          pendingRequests: 1,
          contactedRequests: 1,
          completedRequests: 1,
          urgentRequests: 1,
          averageBudget: { $round: ['$averageBudget', 2] },
        },
      },
    ]);
    
    const distributionByCity = await ClientRequest.aggregate([
      {
        $group: {
          _id: '$city',
          count: { $sum: 1 },
          urgentCount: { $sum: { $cond: ['$isUrgent', 1, 0] } },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    
    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalRequests: 0,
          pendingRequests: 0,
          contactedRequests: 0,
          completedRequests: 0,
          urgentRequests: 0,
          averageBudget: 0,
        },
        topCities: distributionByCity,
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
  createClientRequest,
  getAllClientRequests,
  getClientRequestById,
  updateClientRequestStatus,
  contactArtisan,
  updateArtisanContactStatus,
  getClientRequestStats,
};