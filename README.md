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

### 3. Configure environment variables

Copy the `.env.example` file to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/7rayfi
FRONTEND_URL=http://localhost:3001
API_BASE_URL=http://localhost:3000
```

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

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api` - Basic API endpoint

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
