# 🚢 Battleships Online - 2-Player Naval Strategy Game

A full-stack, real-time multiplayer Battleships game built with modern web technologies. Players can create games, place ships strategically, and engage in turn-based naval combat with beautiful animations and real-time notifications.

![Game Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Frontend](https://img.shields.io/badge/Frontend-Next.js%2014-blue)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)
![Database](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20Prisma-purple)

## 🎮 Live Demo

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## ✨ Features

### 🎯 Core Gameplay
- **Game Creation & Joining** - Seamless multiplayer game setup with unique game IDs
- **Interactive Ship Placement** - Drag-and-drop ship positioning with collision detection and validation
- **Turn-Based Battle System** - Strategic attack gameplay with dual-grid interface
- **Real-Time Game State** - Live synchronization between players with automatic polling
- **Ship Destruction Notifications** - Instant alerts when ships are hit, sunk, or missed
- **Winner Celebration** - Animated victory/defeat screens with detailed battle statistics

### 🎨 User Experience
- **Beautiful Ocean-Themed UI** - Responsive design with smooth animations and effects
- **Visual Ship Placement** - Interactive grid with rotation controls and placement validation
- **Attack Feedback System** - Immediate hit/miss notifications with emoji indicators (💥💧💀)
- **Game Statistics** - Real-time hit rates, remaining ships, and battle progress
- **Error Handling** - Comprehensive error messages and user guidance

### 🔧 Technical Features
- **RESTful API** - Well-structured endpoints for all game operations
- **Database Persistence** - Full game state storage with PostgreSQL
- **Type Safety** - End-to-end TypeScript implementation
- **Docker Support** - Complete containerization setup
- **Health Monitoring** - API health checks and status endpoints
- **Development Tools** - Hot reloading, linting, and debugging support

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (React 18, TypeScript, App Router)
- **Styling**: TailwindCSS with custom ocean theme
- **UI Components**: Custom-built interactive game components
- **HTTP Client**: Axios with request/response interceptors
- **Icons**: Lucide React for consistent iconography
- **Utilities**: clsx for conditional styling

### Backend
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with strict type checking
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: Socket.IO for multiplayer communication
- **Authentication**: JWT tokens for session management
- **Security**: Helmet, CORS, input validation with Joi
- **Logging**: Morgan HTTP request logger
- **Development**: Nodemon with ts-node and path mapping

### Infrastructure
- **Database**: PostgreSQL 15 with Docker
- **Containerization**: Docker Compose for full stack
- **Process Management**: Concurrently for development
- **Package Management**: NPM workspaces for monorepo

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker and Docker Compose
- Git

### 1. Clone and Setup
```bash
git clone <repository-url>
cd battleships-online
npm install
```

### 2. Environment Configuration
```bash
# Backend environment
cp backend/env.example backend/.env
# Edit backend/.env with your database credentials

# Frontend environment  
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > frontend/.env.local
```

### 3. Database Setup
```bash
# Start PostgreSQL with Docker
npm run db:up

# Run database migrations
cd backend && npx prisma migrate deploy && npx prisma generate
```

### 4. Start Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend  # Port 3000
npm run dev:backend   # Port 3001
```

### 5. Play the Game!
1. Open http://localhost:3000
2. Create a new game or join an existing one
3. Place your ships strategically
4. Take turns attacking and sink all enemy ships!

## 📁 Project Structure

```
battleships-online/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── page.tsx     # Home page
│   │   │   ├── game/
│   │   │   │   ├── create/  # Game creation
│   │   │   │   ├── join/    # Game joining
│   │   │   │   └── [id]/    # Dynamic game page
│   │   │   └── layout.tsx   # Root layout
│   │   ├── components/      # Reusable UI components
│   │   │   ├── GameBoard.tsx        # 10x10 game grid
│   │   │   ├── ShipPlacement.tsx    # Ship placement interface
│   │   │   ├── BattleInterface.tsx  # Battle gameplay UI
│   │   │   ├── GameNotifications.tsx # Toast notifications
│   │   │   └── WinnerCelebration.tsx # Victory screen
│   │   ├── lib/             # Utilities and API client
│   │   └── types/           # TypeScript definitions
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── services/        # Business logic layer
│   │   ├── routes/          # API route definitions
│   │   ├── middleware/      # Custom middleware
│   │   ├── socket/          # Socket.IO handlers
│   │   ├── types/           # TypeScript interfaces
│   │   ├── config/          # Configuration files
│   │   └── index.ts         # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── migrations/      # Database migrations
│   └── package.json         # Backend dependencies
├── docker-compose.yml       # Docker services
├── package.json            # Root workspace config
└── README.md              # This file
```

## 🎮 Game Flow

1. **Game Creation**: Player 1 creates a new game → Gets unique game ID
2. **Game Joining**: Player 2 joins using the game ID → Game status updates
3. **Ship Placement**: Both players place their fleet (1 Battleship, 2 Destroyers)
4. **Battle Phase**: Players take turns attacking opponent's grid
5. **Victory**: First player to sink all enemy ships wins with celebration!

## 🔌 API Endpoints

### Game Management
- `POST /api/v1/games` - Create new game
- `POST /api/v1/games/:id/join` - Join existing game  
- `GET /api/v1/games/:id` - Get game state
- `POST /api/v1/games/:id/ships` - Place ships
- `POST /api/v1/games/:id/attack` - Attack coordinate

### Player Management
- `GET /api/v1/players/:id` - Get player info

### System
- `GET /health` - API health check

## 🐳 Docker Setup

```bash
# Start all services (database, backend, frontend)
npm run docker:up

# Start only database
npm run db:up

# Stop all services
npm run docker:down
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run backend tests only
npm run test:backend

# Run frontend tests only  
npm run test:frontend
```

## 🛠️ Development Commands

```bash
# Install all dependencies
npm run install:all

# Clean node_modules
npm run clean

# Build for production
npm run build

# Start production servers
npm run start
```

## 🎯 Game Rules

### Ship Fleet
- **1 Battleship** (4 cells)
- **2 Destroyers** (3 cells each)

### Placement Rules
- Ships can be placed horizontally or vertically
- Ships cannot overlap or go out of bounds
- Ships cannot be adjacent to each other

### Battle Rules
- Players take turns attacking grid coordinates
- Hit results: **Hit** 💥, **Miss** 💧, **Sunk** 💀
- First player to sink entire enemy fleet wins!

## 🌊 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/battleships"
NODE_ENV="development"
PORT=3001
JWT_SECRET="your-super-secret-jwt-key"
SESSION_SECRET="your-session-secret-key"
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🚨 Troubleshooting

### Common Issues

**Port Conflicts**
```bash
# Kill processes on specific ports
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:3001 | xargs kill -9  # Backend
```

**Database Connection**
```bash
# Reset database
cd backend && npx prisma migrate reset --force

# Regenerate Prisma client
npx prisma generate
```

**TypeScript Errors**
```bash
# Clean and reinstall dependencies
npm run clean && npm run install:all
```

## 🎖️ Performance Features

- **Optimized Database Queries** - Prisma with connection pooling
- **Efficient State Management** - Smart polling with caching
- **Responsive Design** - Mobile-first approach with Tailwind
- **Code Splitting** - Next.js automatic optimization
- **Type Safety** - Full TypeScript coverage

## 🔐 Security Features

- **Input Validation** - Joi schema validation
- **CORS Protection** - Configured for development/production
- **Helmet Security** - HTTP security headers
- **Rate Limiting** - API endpoint protection
- **Error Handling** - Secure error messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Classic Battleships game rules and design
- Modern web development best practices
- Open source community tools and libraries

---

**Built with ❤️ for strategic naval combat enthusiasts!** ⚓
