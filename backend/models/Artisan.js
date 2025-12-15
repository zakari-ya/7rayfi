const mongoose = require('mongoose');

const artisanSchema = new mongoose.Schema(
  {
    // Informations personnelles
    firstName: {
      type: String,
      required: [true, 'Le prénom est requis'],
      trim: true,
      minlength: [2, 'Le prénom doit contenir au moins 2 caractères'],
      maxlength: [30, 'Le prénom ne peut pas dépasser 30 caractères'],
    },
    lastName: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
      minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
      maxlength: [30, 'Le nom ne peut pas dépasser 30 caractères'],
    },
    email: {
      type: String,
      required: [true, 'L\'adresse email est requise'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez saisir une adresse email valide'],
    },
    phone: {
      type: String,
      required: [true, 'Le numéro de téléphone est requis'],
      trim: true,
      match: [/^(\+212|0)[5-7][0-9]{8}$/, 'Veuillez saisir un numéro de téléphone marocain valide'],
    },
    
    // Informations professionnelles
    profession: {
      type: String,
      required: [true, 'La profession est requise'],
      trim: true,
    },
    categories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceCategory',
      required: true,
    }],
    experience: {
      type: Number,
      min: [0, 'L\'expérience ne peut pas être négative'],
      max: [50, 'L\'expérience ne peut pas dépasser 50 ans'],
    },
    skills: [{
      type: String,
      trim: true,
    }],
    
    // Localisation
    city: {
      type: String,
      required: [true, 'La ville est requise'],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90,
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180,
      },
    },
    
    // Tarification et disponibilité
    hourlyRate: {
      type: Number,
      min: [0, 'Le taux horaire ne peut pas être négatif'],
    },
    availability: {
      type: String,
      enum: ['immediate', 'sous_1_semaine', 'sous_1_mois', 'plus_1_mois'],
      default: 'immediate',
    },
    
    // Évaluation
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    
    // Vérification
    isVerified: {
      type: Boolean,
      default: false,
    },
    smsVerified: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    
    // Portfolio et description
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères'],
    },
    portfolio: [{
      title: {
        type: String,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
      imageUrl: {
        type: String,
        trim: true,
      },
      completedAt: {
        type: Date,
      },
    }],
    
    // Statut
    isActive: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour la recherche et les filtres
artisanSchema.index({ profession: 'text', description: 'text' });
artisanSchema.index({ city: 1, profession: 1 });
artisanSchema.index({ categories: 1 });
artisanSchema.index({ rating: -1 });
artisanSchema.index({ hourlyRate: 1 });
artisanSchema.index({ availability: 1 });

// Virtual pour le nom complet
artisanSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Méthode pour calculer le taux moyen
artisanSchema.methods.updateRating = function (newRating, reviewCount) {
  if (reviewCount > 0) {
    this.rating = newRating;
    this.reviewCount = reviewCount;
  }
};

module.exports = mongoose.model('Artisan', artisanSchema);