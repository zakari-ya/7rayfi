# 7rayfi

Full-stack MVP monorepo application with Express backend and static frontend.

## Project Structure

```
7rayfi/
├── backend/           # Express API server
│   ├── server.js     # Main server file
│   └── package.json
├── frontend/         # Static frontend assets
│   ├── public/
│   │   ├── index.html
│   │   ├── styles/
│   │   │   └── main.css
│   │   └── scripts/
│   │       └── main.js
│   └── package.json
├── .editorconfig     # Editor configuration
├── .eslintrc.js      # ESLint configuration
├── .prettierrc       # Prettier configuration
├── .nvmrc           # Node version specification
├── .env.example     # Environment variables template
└── package.json     # Root workspace configuration
```

## Prerequisites

- Node.js (v18.18.0 recommended - see `.nvmrc`)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd 7rayfi
```

### 2. Install dependencies

```bash
npm install
```

This will install dependencies for the root workspace and all child workspaces (backend and frontend).

### 3. Set up environment variables

Copy the environment variables template and update with your settings:

```bash
cp .env.example .env
```

Update the following variables in `.env`:
- `MONGODB_URI`: Your MongoDB connection string
- `PORT`: Backend server port (default: 3000)
- `FRONTEND_PORT`: Frontend server port (default: 8080)

### 4. Start development servers

```bash
npm run dev
```

This will start both:

- Backend API server on http://localhost:3000
- Frontend dev server on http://localhost:3001

## Available Scripts

### Root Level

- `npm run dev` - Start both backend and frontend in development mode
- `npm run dev:backend` - Start only the backend server
- `npm run dev:frontend` - Start only the frontend server
- `npm start` - Start backend in production mode
- `npm run lint` - Run ESLint on all JavaScript files
- `npm run lint:fix` - Run ESLint and fix auto-fixable issues
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check if files are formatted correctly

### Backend

- `npm run dev --workspace=backend` - Start backend with nodemon
- `npm start --workspace=backend` - Start backend in production mode

### Frontend

- `npm run dev --workspace=frontend` - Serve static files with http-server

## Frontend Features

### Search UI (`/search.html`)

The search interface provides comprehensive service discovery with the following features:

#### Key Components
- **Smart Search Bar**: Debounced input with autocomplete suggestions
- **Advanced Filters**: Profession, city, rating, budget, availability
- **Dual View Modes**: List view and map view (map stub)
- **Contact Modal**: Direct communication with professionals
- **Persistent Storage**: Recent searches and filter presets via LocalStorage

#### Navigation Integration
- Landing page toggle redirects to `/search.html?mode=find`
- Seamless navigation between landing and search pages
- Browser history support with URL parameters

#### Supported Languages
- Full internationalization (EN/FR/AR) with RTL support
- Dynamic translation updates across all components

#### Technical Features
- Client-side filtering and sorting
- Responsive design (mobile-first approach)
- Accessibility compliant (ARIA labels, keyboard navigation)
- Mock data integration (ready for API connection)

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Health & Status
- `GET /health` - Health check endpoint avec statut MongoDB
- `GET /api` - Informations générales sur l'API

### Categories de Services (`/services`)
- `GET /api/services` - Récupérer toutes les catégories
  - **Paramètres de requête:**
    - `active` (string): Filtrer par statut actif (`true`/`false`/`all`, défaut: `true`)
    - `sortBy` (string): Champ de tri (`order`, `name`, défaut: `order`)
    - `sortOrder` (string): Ordre de tri (`asc`/`desc`, défaut: `asc`)
- `GET /api/services/search` - Rechercher des catégories
  - **Paramètres de requête:**
    - `q` (string, requis): Terme de recherche (min. 2 caractères)
    - `limit` (number): Nombre maximum de résultats (défaut: 10)
- `GET /api/services/:id` - Récupérer une catégorie par ID

### Artisans (`/artisans`)
- `GET /api/artisans` - Récupérer tous les artisans avec filtres
  - **Paramètres de requête:**
    - `profession` (string): Filtrer par profession
    - `city` (string): Filtrer par ville
    - `category` (string): Filtrer par ID de catégorie
    - `minRating` (number): Note minimum (0-5)
    - `maxRate` (number): Taux horaire maximum
    - `availability` (string): Disponibilité (`immediate`, `sous_1_semaine`, `sous_1_mois`, `plus_1_mois`)
    - `page` (number): Numéro de page (défaut: 1)
    - `limit` (number): Nombre d'éléments par page (défaut: 20, max: 100)
    - `sortBy` (string): Critère de tri (`rating`, `createdAt`, `hourlyRate`, `experience`)
    - `sortOrder` (string): Ordre de tri (`asc`/`desc`)
- `GET /api/artisans/search` - Rechercher des artisans
  - **Paramètres de requête:**
    - `q` (string, requis): Terme de recherche (min. 2 caractères)
    - `limit` (number): Nombre maximum de résultats (défaut: 20)
- `GET /api/artisans/stats` - Statistiques des artisans
- `GET /api/artisans/:id` - Récupérer un artisan par ID
- `POST /api/artisans` - Inscrire un nouvel artisan
  - **Corps de la requête (JSON):**
    ```json
    {
      "firstName": "Ahmed",
      "lastName": "alami",
      "email": "ahmed@email.com",
      "phone": "0612345678",
      "profession": "Plombier",
      "categories": ["category_id_1", "category_id_2"],
      "city": "Casablanca",
      "experience": 5,
      "hourlyRate": 150,
      "availability": "immediate",
      "description": "Description...",
      "skills": ["Réparation", "Installation"],
      "smsVerified": false
    }
    ```
- `PUT /api/artisans/:id` - Mettre à jour un artisan

### Demandes Clients (`/demandes`)
- `GET /api/demandes` - Récupérer toutes les demandes avec filtres
  - **Paramètres de requête:**
    - `status` (string): Filtrer par statut (`pending`, `contacted`, `in_progress`, `completed`, `cancelled`)
    - `city` (string): Filtrer par ville
    - `serviceCategory` (string): Filtrer par ID de catégorie de service
    - `priority` (string): Filtrer par priorité (`low`, `medium`, `high`, `urgent`)
    - `page`, `limit`, `sortBy`, `sortOrder`: Pagination et tri
- `GET /api/demandes/stats` - Statistiques des demandes
- `GET /api/demandes/:id` - Récupérer une demande par ID
- `POST /api/demandes` - Créer une nouvelle demande client
  - **Alias:** `POST /api/demandes/create`
  - **Corps de la requête (JSON):**
    ```json
    {
      "clientName": "Hassan Benali",
      "clientEmail": "hassan@email.com",
      "clientPhone": "0612345678",
      "serviceCategory": "category_id",
      "serviceType": "Réparation",
      "description": "Description détaillée du service...",
      "city": "Casablanca",
      "address": "123 Rue Hassan II",
      "budget": {
        "min": 500,
        "max": 1000,
        "currency": "MAD"
      },
      "deadline": "2024-01-15",
      "priority": "high",
      "isUrgent": false,
      "notes": "Notes additionnelles..."
    }
    ```
- `PUT /api/demandes/:id/status` - Mettre à jour le statut d'une demande
  - **Corps de la requête:**
    ```json
    {
      "status": "in_progress",
      "notes": "Notes sur le changement de statut"
    }
    ```
- `POST /api/demandes/:id/contact` - Contacter un artisan pour une demande
  - **Corps de la requête:**
    ```json
    {
      "artisanId": "artisan_id",
      "notes": "Message pour l'artisan"
    }
    ```
- `PUT /api/demandes/:id/artisan/:artisanId/status` - Mettre à jour le statut d'un artisan contacté
  - **Statuts valides:** `pending`, `contacted`, `interested`, `not_interested`

### Codes de Réponse
- `200` - Succès
- `201` - Ressource créée avec succès
- `400` - Données invalides (avec détails des erreurs)
- `404` - Ressource non trouvée
- `409` - Conflit (ex: email déjà utilisé)
- `500` - Erreur serveur interne

### Format de Réponse Standard
```json
{
  "success": true,
  "data": { ... },
  "message": "Opération réussie",
  "pagination": {
    "current": 1,
    "pages": 5,
    "count": 100,
    "limit": 20
  },
  "filters": { ... }
}
```

### Gestion d'Erreurs
```json
{
  "success": false,
  "error": "Message d'erreur descriptif",
  "details": [
    {
      "field": "email",
      "message": "L'adresse email est requise",
      "value": ""
    }
  ]
}
```

### Exemples d'Utilisation

#### Récupérer les artisans à Casablanca avec note >= 4.0
```bash
curl "http://localhost:3000/api/artisans?city=Casablanca&minRating=4.0&limit=10"
```

#### Créer une nouvelle demande client
```bash
curl -X POST http://localhost:3000/api/demandes \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Hassan Benali",
    "clientEmail": "hassan@email.com",
    "clientPhone": "0612345678",
    "serviceCategory": "plumbing_category_id",
    "serviceType": "Réparation fuite",
    "description": "Fuite dans la salle de bain nécessitant une intervention urgente",
    "city": "Casablanca",
    "budget": {"min": 300, "max": 800, "currency": "MAD"},
    "priority": "urgent",
    "isUrgent": true
  }'
```

#### Rechercher des électriciens à Rabat
```bash
curl "http://localhost:3000/api/artisans?profession=électricien&city=Rabat&availability=immediate"
```

## Technology Stack

### Backend

- **Express** - Web framework
- **MongoDB/Mongoose** - Database and ODM
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **nodemon** - Development auto-reload

### Frontend

- **HTML5** - Markup with mobile-first meta tags
- **CSS3** - Modern CSS with custom properties
- **Vanilla JavaScript** - ES6+ features
- **http-server** - Static file serving for development

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **EditorConfig** - Consistent coding styles
- **Concurrently** - Run multiple commands simultaneously

## Development Guidelines

### Code Style

- Follow the ESLint and Prettier configurations
- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Maximum line length: 100 characters

### Environment Variables

Never commit `.env` files. Always use `.env.example` as a template and document any new environment variables.

## MongoDB Setup

### Local MongoDB

Install MongoDB locally and ensure it's running:

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu
sudo systemctl start mongod
```

### MongoDB Atlas (Cloud)

1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file

## Troubleshooting

### Port already in use

If you see `EADDRINUSE` errors, change the port numbers in your `.env` file.

### MongoDB connection failed

- Ensure MongoDB is running locally or your Atlas connection string is correct
- Check your firewall settings
- Verify network connectivity

## License

ISC
