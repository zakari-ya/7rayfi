require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const ServiceCategory = require('../models/ServiceCategory');
const Artisan = require('../models/Artisan');
const ClientRequest = require('../models/ClientRequest');

// Données de test pour les catégories de services
const serviceCategoriesData = [
  {
    name: 'Plomberie',
    description: 'Services de plomberie pour tous vos besoins en canalisation et sanitaire',
    icon: '🔧',
    order: 1,
  },
  {
    name: 'Électricité',
    description: 'Installation et réparation électrique par des professionnels certifiés',
    icon: '⚡',
    order: 2,
  },
  {
    name: 'Menuiserie',
    description: 'Fabrication et réparation de meubles en bois sur mesure',
    icon: '🪚',
    order: 3,
  },
  {
    name: 'Peinture',
    description: 'Peinture intérieure et extérieure avec des finitions parfaites',
    icon: '🎨',
    order: 4,
  },
  {
    name: 'Jardinage',
    description: 'Entretien de jardins, espaces verts et aménagement paysager',
    icon: '🌱',
    order: 5,
  },
  {
    name: 'Ménage',
    description: 'Services de nettoyage et d\'entretien pour votre domicile',
    icon: '🧹',
    order: 6,
  },
  {
    name: 'Réfrigération',
    description: 'Installation et réparation de systèmes de climatisation et refrigeración',
    icon: '❄️',
    order: 7,
  },
  {
    name: 'Maçonnerie',
    description: 'Travaux de maçonnerie, construction et rénovation',
    icon: '🏗️',
    order: 8,
  },
];

// Données de test pour les artisans
const artisansData = [
  {
    firstName: 'Ahmed',
    lastName: 'Alami',
    email: 'ahmed.alami@email.com',
    phone: '0612345678',
    profession: 'Plombier',
    categories: [], // Sera rempli après création des catégories
    city: 'Casablanca',
    address: '123 Rue Hassan II, Casablanca',
    experience: 8,
    hourlyRate: 150,
    availability: 'immediate',
    description: 'Plombier expérimenté avec 8 ans d\'expérience. Spécialisé dans la réparation de fuites et l\'installation de sanitaires.',
    skills: ['Réparation de fuites', 'Installation sanitaire', 'Débouchage', 'Chauffage'],
    rating: 4.5,
    reviewCount: 23,
    isVerified: true,
    smsVerified: true,
    emailVerified: true,
    isAvailable: true,
  },
  {
    firstName: 'Fatima',
    lastName: 'Benali',
    email: 'fatima.benali@email.com',
    phone: '0623456789',
    profession: 'Électricienne',
    categories: [],
    city: 'Rabat',
    address: '45 Avenue Mohammed V, Rabat',
    experience: 12,
    hourlyRate: 180,
    availability: 'sous_1_semaine',
    description: 'Électricienne certifiée avec plus de 12 ans d\'expérience. Expert en installations électriques résidentielles et commerciales.',
    skills: ['Installation électrique', 'Dépannage', 'Domotique', 'Sécurité électrique'],
    rating: 4.8,
    reviewCount: 45,
    isVerified: true,
    smsVerified: true,
    emailVerified: true,
    isAvailable: true,
  },
  {
    firstName: 'Mohamed',
    lastName: 'Chakir',
    email: 'mohamed.chakir@email.com',
    phone: '0634567890',
    profession: 'Menuisier',
    categories: [],
    city: 'Marrakech',
    address: '78 Rue Kennaria, Marrakech',
    experience: 15,
    hourlyRate: 200,
    availability: 'immediate',
    description: 'Menuisier artisan spécialisé dans la fabrication de meubles sur mesure et la restauration.',
    skills: ['Meubles sur mesure', 'Restauration', 'Escaliers', 'Cuisines'],
    rating: 4.7,
    reviewCount: 31,
    isVerified: true,
    smsVerified: true,
    emailVerified: false,
    isAvailable: true,
  },
  {
    firstName: 'Aicha',
    lastName: 'Tazi',
    email: 'aicha.tazi@email.com',
    phone: '0645678901',
    profession: 'Peintre',
    categories: [],
    city: 'Casablanca',
    address: '12 Boulevard Zerktouni, Casablanca',
    experience: 6,
    hourlyRate: 120,
    availability: 'immediate',
    description: 'Peintre professionnelle spécialisée dans la décoration intérieure et les finitions artistiques.',
    skills: ['Peinture intérieure', 'Décoration', 'Papier peint', 'Finitions'],
    rating: 4.3,
    reviewCount: 18,
    isVerified: true,
    smsVerified: false,
    emailVerified: true,
    isAvailable: true,
  },
  {
    firstName: 'Youssef',
    lastName: 'Idrissi',
    email: 'youssef.idrissi@email.com',
    phone: '0656789012',
    profession: 'Jardinier',
    categories: [],
    city: 'Fès',
    address: '34 Rue Talaa Seghira, Fès',
    experience: 10,
    hourlyRate: 100,
    availability: 'sous_1_semaine',
    description: 'Jardinier expert en aménagement paysager et entretien d\'espaces verts.',
    skills: ['Aménagement paysager', 'Entretien espaces verts', 'Élagage', 'Irrigation'],
    rating: 4.6,
    reviewCount: 27,
    isVerified: true,
    smsVerified: true,
    emailVerified: true,
    isAvailable: false,
  },
];

// Données de test pour les demandes clients
const clientRequestsData = [
  {
    clientName: 'Hassan Benali',
    clientEmail: 'hassan.benali@email.com',
    clientPhone: '0667890123',
    serviceCategory: '', // Sera rempli après création des catégories
    serviceType: 'Réparation urgence',
    description: 'Fuite importante dans la salle de bain, besoin d\'intervention rapide',
    city: 'Casablanca',
    address: '89 Rue Princesse Lalla Fatima, Casablanca',
    budget: {
      min: 500,
      max: 1000,
      currency: 'MAD',
    },
    priority: 'urgent',
    isUrgent: true,
    status: 'pending',
  },
  {
    clientName: 'Salma Alami',
    clientEmail: 'salma.alami@email.com',
    clientPhone: '0678901234',
    serviceCategory: '',
    serviceType: 'Installation électrique',
    description: 'Rénovation complète de l\'installation électrique d\'un appartement de 80m²',
    city: 'Rabat',
    address: '23 Rue Amir Moulay Abdallah, Rabat',
    budget: {
      min: 8000,
      max: 12000,
      currency: 'MAD',
    },
    deadline: new Date('2024-01-15'),
    priority: 'high',
    isUrgent: false,
    status: 'contacted',
  },
  {
    clientName: 'Omar Chakir',
    clientEmail: 'omar.chakir@email.com',
    clientPhone: '0689012345',
    serviceCategory: '',
    serviceType: 'Meuble sur mesure',
    description: 'Fabrication d\'une bibliothèque sur mesure pour salon de 4m de largeur',
    city: 'Marrakech',
    address: '56 Rue Kennaria, Marrakech',
    budget: {
      min: 3000,
      max: 5000,
      currency: 'MAD',
    },
    priority: 'medium',
    isUrgent: false,
    status: 'pending',
  },
  {
    clientName: 'Khadija Tazi',
    clientEmail: 'khadija.tazi@email.com',
    clientPhone: '0690123456',
    serviceCategory: '',
    serviceType: 'Peinture décoration',
    description: 'Peinture et décoration d\'une chambre d\'enfant de 12m² avec thème espace',
    city: 'Casablanca',
    address: '34 Boulevard Gauthier, Casablanca',
    budget: {
      min: 800,
      max: 1500,
      currency: 'MAD',
    },
    priority: 'low',
    isUrgent: false,
    status: 'completed',
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Début de l\'insertion des données de test...');

    // Connexion à MongoDB
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/7rayfi');
      console.log('✅ Connecté à MongoDB');
    }

    // Nettoyer les données existantes
    console.log('🧹 Nettoyage des données existantes...');
    await Promise.all([
      ServiceCategory.deleteMany({}),
      Artisan.deleteMany({}),
      ClientRequest.deleteMany({}),
    ]);
    console.log('✅ Données existantes supprimées');

    // Insérer les catégories de services
    console.log('📂 Insertion des catégories de services...');
    const categories = [];
    for (const catData of serviceCategoriesData) {
      const category = new ServiceCategory(catData);
      await category.save();
      categories.push(category);
    }
    console.log(`✅ ${categories.length} catégories créées`);

    // Associer les catégories aux artisans
    console.log('👷 Association des catégories aux artisans...');
    const plumbingCategory = categories.find(cat => cat.name === 'Plomberie');
    const electricityCategory = categories.find(cat => cat.name === 'Électricité');
    const carpentryCategory = categories.find(cat => cat.name === 'Menuiserie');
    const paintingCategory = categories.find(cat => cat.name === 'Peinture');
    const gardeningCategory = categories.find(cat => cat.name === 'Jardinage');

    artisansData[0].categories = [plumbingCategory._id]; // Ahmed - Plomberie
    artisansData[1].categories = [electricityCategory._id]; // Fatima - Électricité
    artisansData[2].categories = [carpentryCategory._id]; // Mohamed - Menuiserie
    artisansData[3].categories = [paintingCategory._id]; // Aicha - Peinture
    artisansData[4].categories = [gardeningCategory._id]; // Youssef - Jardinage

    // Insérer les artisans
    console.log('👨‍🔧 Insertion des artisans...');
    const artisans = await Artisan.insertMany(artisansData);
    console.log(`✅ ${artisans.length} artisans créés`);

    // Associer les catégories aux demandes clients
    console.log('📋 Association des catégories aux demandes...');
    clientRequestsData[0].serviceCategory = plumbingCategory._id; // Plomberie
    clientRequestsData[1].serviceCategory = electricityCategory._id; // Électricité
    clientRequestsData[2].serviceCategory = carpentryCategory._id; // Menuiserie
    clientRequestsData[3].serviceCategory = paintingCategory._id; // Peinture

    // Insérer les demandes clients
    console.log('📝 Insertion des demandes clients...');
    const clientRequests = await ClientRequest.insertMany(clientRequestsData);
    console.log(`✅ ${clientRequests.length} demandes clients créées`);

    // Ajouter quelques contacts d'artisans aux demandes
    console.log('🤝 Ajout des contacts d\'artisans...');
    
    // Pour la première demande (plomberie), contacter Ahmed
    await ClientRequest.findByIdAndUpdate(clientRequests[0]._id, {
      $push: {
        contactedArtisans: {
          artisan: artisans[0]._id, // Ahmed
          status: 'contacted',
          notes: 'Artisan contacté pour intervention urgente',
        },
      },
      status: 'contacted',
    });

    // Pour la troisième demande (menuiserie), contacter Mohamed
    await ClientRequest.findByIdAndUpdate(clientRequests[2]._id, {
      $push: {
        contactedArtisans: {
          artisan: artisans[2]._id, // Mohamed
          status: 'interested',
          notes: 'Artisan intéressé par le projet',
        },
      },
      status: 'contacted',
    });

    console.log('✅ Contacts d\'artisans ajoutés');

    // Afficher un résumé
    console.log('\n📊 Résumé des données insérées:');
    console.log(`- Catégories de services: ${categories.length}`);
    console.log(`- Artisans: ${artisans.length}`);
    console.log(`- Demandes clients: ${clientRequests.length}`);

    console.log('\n🎉 Base de données populée avec succès!');
    console.log('\n📋 Catégories disponibles:');
    categories.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.slug})`);
    });

    console.log('\n👨‍🔧 Artisans disponibles:');
    artisans.forEach(artisan => {
      console.log(`  - ${artisan.fullName} - ${artisan.profession} (${artisan.city})`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion des données:', error);
    throw error;
  } finally {
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('🔌 Connexion MongoDB fermée');
  }
}

// Fonction pour réinitialiser uniquement les données de test
async function resetTestData() {
  try {
    console.log('🔄 Réinitialisation des données de test...');
    
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/7rayfi');
    }

    // Supprimer seulement les données de test (basées sur les emails)
    const testEmails = artisansData.map(artisan => artisan.email);
    const testClientEmails = clientRequestsData.map(request => request.clientEmail);

    await Promise.all([
      Artisan.deleteMany({ email: { $in: testEmails } }),
      ClientRequest.deleteMany({ clientEmail: { $in: testClientEmails } }),
    ]);

    console.log('✅ Données de test supprimées');
    
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
  }
}

// Exporter les fonctions
module.exports = {
  seedDatabase,
  resetTestData,
  serviceCategoriesData,
  artisansData,
  clientRequestsData,
};

// Si le script est exécuté directement
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'reset':
      resetTestData()
        .then(() => {
          console.log('🎯 Réinitialisation terminée');
          process.exit(0);
        })
        .catch(err => {
          console.error('💥 Erreur:', err);
          process.exit(1);
        });
      break;
    
    default:
      seedDatabase()
        .then(() => {
          console.log('🎯 Peuplement terminé');
          process.exit(0);
        })
        .catch(err => {
          console.error('💥 Erreur:', err);
          process.exit(1);
        });
  }
}