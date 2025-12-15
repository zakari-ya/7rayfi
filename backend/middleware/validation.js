const { body, param, query, validationResult } = require('express-validator');

// Middleware pour gérer les erreurs de validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value,
    }));
    
    console.log('⚠️ Erreur de validation:', errorDetails);
    
    return res.status(400).json({
      success: false,
      error: 'Données invalides',
      details: errorDetails,
    });
  }
  next();
};

// Validation pour l'inscription des artisans
const validateArtisanRegistration = [
  body('firstName')
    .notEmpty()
    .withMessage('Le prénom est requis')
    .isLength({ min: 2, max: 30 })
    .withMessage('Le prénom doit contenir entre 2 et 30 caractères')
    .trim(),
  
  body('lastName')
    .notEmpty()
    .withMessage('Le nom est requis')
    .isLength({ min: 2, max: 30 })
    .withMessage('Le nom doit contenir entre 2 et 30 caractères')
    .trim(),
  
  body('email')
    .isEmail()
    .withMessage('Adresse email invalide')
    .normalizeEmail(),
  
  body('phone')
    .matches(/^(\+212|0)[5-7][0-9]{8}$/)
    .withMessage('Numéro de téléphone marocain invalide')
    .trim(),
  
  body('profession')
    .notEmpty()
    .withMessage('La profession est requise')
    .trim(),
  
  body('categories')
    .isArray({ min: 1 })
    .withMessage('Au moins une catégorie doit être sélectionnée'),
  
  body('categories.*')
    .isMongoId()
    .withMessage('ID de catégorie invalide'),
  
  body('city')
    .notEmpty()
    .withMessage('La ville est requise')
    .trim(),
  
  body('serviceAreas')
    .optional()
    .isArray()
    .withMessage('Les zones de service doivent être un tableau'),
  
  body('experience')
    .optional()
    .isInt({ min: 0, max: 50 })
    .withMessage('L\'expérience doit être entre 0 et 50 ans'),
  
  body('hourlyRate')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le taux horaire doit être un nombre positif'),
  
  body('pricingNote')
    .optional()
    .isLength({ max: 200 })
    .withMessage('La note de tarification ne peut pas dépasser 200 caractères')
    .trim(),
  
  body('availability')
    .optional()
    .isIn(['immediate', 'sous_1_semaine', 'sous_1_mois', 'plus_1_mois'])
    .withMessage('Disponibilité invalide'),
  
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('La description ne peut pas dépasser 1000 caractères')
    .trim(),
  
  body('portfolioLinks')
    .optional()
    .isArray()
    .withMessage('Les liens portfolio doivent être un tableau'),
  
  body('skills')
    .optional()
    .isArray()
    .withMessage('Les compétences doivent être un tableau'),
  
  body('smsVerified')
    .optional()
    .isBoolean()
    .withMessage('Le flag de vérification SMS doit être un booléen'),
  
  handleValidationErrors,
];

// Validation pour les demandes clients
const validateClientRequest = [
  body('clientName')
    .notEmpty()
    .withMessage('Le nom du client est requis')
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères')
    .trim(),
  
  body('clientEmail')
    .isEmail()
    .withMessage('Adresse email invalide')
    .normalizeEmail(),
  
  body('clientPhone')
    .matches(/^(\+212|0)[5-7][0-9]{8}$/)
    .withMessage('Numéro de téléphone marocain invalide')
    .trim(),
  
  body('serviceCategory')
    .isMongoId()
    .withMessage('ID de catégorie de service invalide'),
  
  body('serviceType')
    .notEmpty()
    .withMessage('Le type de service est requis')
    .trim(),
  
  body('description')
    .notEmpty()
    .withMessage('La description est requise')
    .isLength({ min: 10, max: 1000 })
    .withMessage('La description doit contenir entre 10 et 1000 caractères')
    .trim(),
  
  body('city')
    .notEmpty()
    .withMessage('La ville est requise')
    .trim(),
  
  body('address')
    .optional()
    .trim(),
  
  body('budget.min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le budget minimum doit être un nombre positif'),
  
  body('budget.max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le budget maximum doit être un nombre positif'),
  
  body('budget.currency')
    .optional()
    .isIn(['MAD', 'EUR', 'USD'])
    .withMessage('Devise invalide'),
  
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Date limite invalide')
    .toDate(),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Priorité invalide'),
  
  body('isUrgent')
    .optional()
    .isBoolean()
    .withMessage('Le flag d\'urgence doit être un booléen'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Les notes ne peuvent pas dépasser 500 caractères')
    .trim(),
  
  handleValidationErrors,
];

// Validation pour la recherche d'artisans
const validateArtisanSearch = [
  query('profession')
    .optional()
    .trim(),
  
  query('city')
    .optional()
    .trim(),
  
  query('category')
    .optional()
    .isMongoId()
    .withMessage('ID de catégorie invalide'),
  
  query('minRating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('La note minimum doit être entre 0 et 5'),
  
  query('maxRate')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le taux maximum doit être un nombre positif'),
  
  query('availability')
    .optional()
    .isIn(['immediate', 'sous_1_semaine', 'sous_1_mois', 'plus_1_mois'])
    .withMessage('Disponibilité invalide'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Le numéro de page doit être un entier positif'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('La limite doit être entre 1 et 100'),
  
  query('sortBy')
    .optional()
    .isIn(['rating', 'createdAt', 'hourlyRate', 'experience'])
    .withMessage('Critère de tri invalide'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Ordre de tri invalide'),
  
  handleValidationErrors,
];

// Validation pour les paramètres MongoDB
const validateObjectId = (paramName = 'id') => [
  param(paramName)
    .isMongoId()
    .withMessage(`ID ${paramName} invalide`),
  
  handleValidationErrors,
];

module.exports = {
  validateArtisanRegistration,
  validateClientRequest,
  validateArtisanSearch,
  validateObjectId,
  handleValidationErrors,
};