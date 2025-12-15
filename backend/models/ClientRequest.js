const mongoose = require('mongoose');

const clientRequestSchema = new mongoose.Schema(
  {
    // Informations du client
    clientName: {
      type: String,
      required: [true, 'Le nom du client est requis'],
      trim: true,
      minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
      maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères'],
    },
    clientEmail: {
      type: String,
      required: [true, 'L\'adresse email du client est requise'],
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez saisir une adresse email valide'],
    },
    clientPhone: {
      type: String,
      required: [true, 'Le numéro de téléphone du client est requis'],
      trim: true,
      match: [/^(\+212|0)[5-7][0-9]{8}$/, 'Veuillez saisir un numéro de téléphone marocain valide'],
    },
    
    // Détails de la demande
    serviceCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceCategory',
      required: [true, 'La catégorie de service est requise'],
    },
    serviceType: {
      type: String,
      required: [true, 'Le type de service est requis'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'La description du service est requise'],
      trim: true,
      minlength: [10, 'La description doit contenir au moins 10 caractères'],
      maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères'],
    },
    
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
    
    // Budget et délai
    budget: {
      min: {
        type: Number,
        min: [0, 'Le budget minimum ne peut pas être négatif'],
      },
      max: {
        type: Number,
        min: [0, 'Le budget maximum ne peut pas être négatif'],
      },
      currency: {
        type: String,
        default: 'MAD',
        enum: ['MAD', 'EUR', 'USD'],
      },
    },
    deadline: {
      type: Date,
    },
    
    // Statut de la demande
    status: {
      type: String,
      enum: ['pending', 'contacted', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    
    // Artisans contactés
    contactedArtisans: [{
      artisan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artisan',
      },
      contactedAt: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ['pending', 'contacted', 'interested', 'not_interested'],
        default: 'pending',
      },
      notes: {
        type: String,
        trim: true,
      },
    }],
    
    // Priorité et urgence
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    isUrgent: {
      type: Boolean,
      default: false,
    },
    
    // Métadonnées
    source: {
      type: String,
      default: 'website',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Les notes ne peuvent pas dépasser 500 caractères'],
    },
  },
  {
    timestamps: true,
  }
);

// Index pour la recherche et les filtres
clientRequestSchema.index({ clientEmail: 1 });
clientRequestSchema.index({ serviceCategory: 1 });
clientRequestSchema.index({ city: 1 });
clientRequestSchema.index({ status: 1 });
clientRequestSchema.index({ createdAt: -1 });

// Méthode pour ajouter un artisan contacté
clientRequestSchema.methods.addContactedArtisan = function (artisanId, notes) {
  const existingContact = this.contactedArtisans.find(
    contact => contact.artisan.toString() === artisanId.toString()
  );
  
  if (existingContact) {
    existingContact.status = 'contacted';
    if (notes) existingContact.notes = notes;
  } else {
    this.contactedArtisans.push({
      artisan: artisanId,
      status: 'contacted',
      notes,
    });
  }
  
  return this.save();
};

// Méthode pour mettre à jour le statut d'un artisan
clientRequestSchema.methods.updateArtisanStatus = function (artisanId, status, notes) {
  const contact = this.contactedArtisans.find(
    contact => contact.artisan.toString() === artisanId.toString()
  );
  
  if (contact) {
    contact.status = status;
    if (notes) contact.notes = notes;
    return this.save();
  }
  
  throw new Error('Artisan non trouvé dans les contacts');
};

module.exports = mongoose.model('ClientRequest', clientRequestSchema);