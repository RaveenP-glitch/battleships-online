# 🚢 Battleships Online - 2-Player Naval Strategy Game

A full-stack, real-time multiplayer Battleships game built with modern web technologies. Players can create games, place ships strategically, and engage in turn-based naval combat with beautiful animations and real-time notifications.

![Game Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Frontend](https://img.shields.io/badge/Frontend-NextJS-red)
![Backend](https://img.shields.io/badge/Backend-Nodejs%20%2B%20Express-green)
![Database](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20Prisma-purple)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED)
![AWS](https://img.shields.io/badge/AWS-Deployment%20Ready-orange)

## 🎮 Live Demo

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **API Documentation**: [Postman Collection](./Battleships_API_Collection.postman_collection.json)

## ✨ Features

### 🎯 Core Gameplay
- **Game Creation & Joining** - Seamless multiplayer game setup with unique game IDs
- **Interactive Ship Placement** - Drag-and-drop ship positioning with collision detection and validation
- **Turn-Based Battle System** - Strategic attack gameplay with dual-grid interface
- **Real-Time Game State** - Live synchronization between players with automatic polling
- **Ship Destruction Notifications** - Instant alerts when ships are hit, sunk, or missed
- **Winner Celebration** - Animated victory/defeat screens with detailed battle statistics
- **Game Rules Page** - Interactive tutorial with embedded YouTube video guide

### 🎨 User Experience
- **Beautiful Ocean-Themed UI** - Responsive design with smooth animations and effects
- **Visual Ship Placement** - Interactive grid with rotation controls and placement validation
- **Attack Feedback System** - Immediate hit/miss notifications with emoji indicators (💥💧💀)
- **Game Statistics** - Real-time hit rates, remaining ships, and battle progress
- **Toast Notifications** - Auto-dismissing alerts for game events
- **Error Handling** - Comprehensive error messages and user guidance
- **Mobile Responsive** - Optimized for all device sizes

### 🔧 Technical Features
- **RESTful API** - Well-structured endpoints for all game operations
- **Database Persistence** - Full game state storage with PostgreSQL
- **Type Safety** - End-to-end TypeScript implementation
- **Docker Support** - Complete containerization setup with health checks
- **Health Monitoring** - API health checks and status endpoints
- **Development Tools** - Hot reloading, linting, and debugging support
- **Production Ready** - Optimized builds and deployment configurations
- **Real-time Updates** - HTTP polling for game state synchronization (2-second intervals)

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (React 18, TypeScript, App Router)
- **Styling**: TailwindCSS v4 with custom ocean theme and animations
- **UI Components**: Custom-built interactive game components
- **HTTP Client**: Axios with request/response interceptors
- **Icons**: Lucide React for consistent iconography
- **Utilities**: clsx for conditional styling
- **Fonts**: Inter, JetBrains Mono, Orbitron via Google Fonts

### Backend
- **Runtime**: Node.js 18+ with Express.js framework
- **Language**: TypeScript with strict type checking
- **Database**: PostgreSQL 15 with Prisma ORM
- **Real-time**: Socket.IO server implemented (client not connected)
- **Authentication**: JWT infrastructure ready (not implemented)
- **Security**: Helmet, CORS, basic input validation
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
npm run install:all
```

### 2. Environment Configuration
```bash
# Backend environment
cp backend/env.example backend/.env.local
# Edit backend/.env.local with your database credentials

# Frontend environment  
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > frontend/.env.local
```

### 3. Database Setup
```bash
# Start PostgreSQL with Docker
npm run db:up

# Run database migrations and seed
cd backend
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
cd ..
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
5. Do the same on a new tab

## 📁 Project Structure

```
battleships-online/
├── frontend/                    # Next.js 15 application
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   │   ├── page.tsx        # Home page with ocean theme
│   │   │   ├── rules/          # Game rules with video tutorial
│   │   │   ├── game/
│   │   │   │   ├── create/     # Game creation page
│   │   │   │   ├── join/       # Game joining page
│   │   │   │   └── [id]/       # Dynamic game page
│   │   │   ├── layout.tsx      # Root layout with fonts
│   │   │   └── globals.css     # Global styles and animations
│   │   ├── components/         # Reusable UI components
│   │   │   ├── GameBoard.tsx           # 10x10 game grid
│   │   │   ├── ShipPlacement.tsx       # Ship placement interface
│   │   │   ├── BattleInterface.tsx     # Battle gameplay UI
│   │   │   ├── GameNotifications.tsx   # Toast notifications system
│   │   │   └── WinnerCelebration.tsx   # Victory celebration screen
│   │   ├── lib/                # Utilities and API client
│   │   │   ├── api.ts          # Axios API client
│   │   │   └── utils.ts        # Utility functions
│   │   └── types/              # TypeScript definitions
│   ├── public/                 # Static assets
│   ├── tailwind.config.ts      # Custom Tailwind configuration
│   ├── next.config.js          # Next.js configuration
│   ├── Dockerfile              # Frontend container
│   └── package.json            # Frontend dependencies
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── controllers/        # HTTP request handlers
│   │   ├── services/           # Business logic layer
│   │   ├── routes/             # API route definitions
│   │   ├── middleware/         # Custom middleware
│   │   ├── socket/             # Socket.IO handlers
│   │   ├── types/              # TypeScript interfaces
│   │   ├── config/             # Configuration files
│   │   └── index.ts            # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   ├── migrations/         # Database migrations
│   │   └── seed.ts             # Database seeding
│   ├── Dockerfile              # Backend container
│   ├── nodemon.json            # Development configuration
│   ├── env.local               # Environment variables
│   └── package.json            # Backend dependencies
├── scripts/                    # Deployment automation
│   ├── deploy-ec2.sh           # Automated EC2 deployment
│   └── deploy-ecs.sh           # Automated ECS deployment
├── docker-compose.yml          # Docker services configuration
├── package.json                # Root workspace config
├── DEPLOYMENT_GUIDE.md         # Complete AWS deployment guide
├── TECHNICAL_DOCUMENTATION.md  # Technical deep-dive documentation
├── INTERVIEW_QUESTIONS_AND_ANSWERS.md # Interview preparation Q&A
├── Battleships_API_Collection.postman_collection.json # API testing
└── README.md                   # This file
```

## 🎮 Game Flow

1. **Game Creation**: Player 1 creates a new game → Gets unique game ID
2. **Game Joining**: Player 2 joins using the game ID → Game status updates to "PLACING_SHIPS"
3. **Ship Placement**: Both players place their fleet (1 Battleship, 2 Destroyers)
4. **Battle Phase**: Players take turns attacking opponent's grid → Status becomes "IN_PROGRESS"
5. **Victory**: First player to sink all enemy ships wins → Status becomes "COMPLETED"
6. **Celebration**: Winner celebration screen with battle statistics

## 🔌 API Endpoints

### Game Management
- `POST /api/v1/games` - Create new game
- `POST /api/v1/games/:id/join` - Join existing game  
- `GET /api/v1/games/:id` - Get complete game state
- `POST /api/v1/games/:id/ships` - Place ships on grid
- `POST /api/v1/games/:id/attack` - Attack coordinate

### Player Management
- `GET /api/v1/players/:id` - Get player information

### System
- `GET /health` - API health check with uptime

## 🐳 Docker Setup

### Development Environment
```bash
# Start all services (database, backend, frontend)
npm run docker:up

# Start only database for local development
npm run db:up

# Stop all services
npm run docker:down

# View service logs
docker-compose logs -f

# Check service status
docker-compose ps
```

<!-- ### Production Environment
```bash
# Build and start production containers
docker-compose -f docker-compose.yml up -d --build

# Scale services
docker-compose up -d --scale backend=2 --scale frontend=2

# Update services
docker-compose pull && docker-compose up -d
``` -->

## 🧪 Testing

### API Testing
```bash
# Import Postman collection for comprehensive API testing
# File: Battleships_API_Collection.postman_collection.json

# Run all tests
npm test

# Run backend tests only
npm run test:backend

# Run frontend tests only  
npm run test:frontend
```

### Manual Testing
1. **Game Creation Flow**: Create → Join → Place Ships → Battle
2. **Ship Placement Validation**: Test overlap, boundaries, adjacency rules
3. **Attack System**: Test hit/miss/sunk detection and turn switching
4. **Win Conditions**: Test game completion and winner celebration
5. **Error Handling**: Test invalid inputs and network issues

## 🛠️ Development Commands


### Database Management
```bash
# Navigate to backend directory for Prisma commands
cd backend

# Database migrations
npx prisma migrate dev --name description
npx prisma migrate deploy
npx prisma migrate reset --force

# Generate Prisma client
npx prisma generate

# Seed database with test data
npx prisma db seed

# Open Prisma Studio (database GUI)
npx prisma studio

# Database introspection
npx prisma db pull
```

## 🎯 Game Rules

### Ship Fleet
- **1 Battleship** (4 cells) - The flagship of your fleet
- **2 Destroyers** (3 cells each) - Fast attack vessels

### Placement Rules
- Ships can be placed horizontally or vertically
- Ships cannot overlap or extend beyond the 10×10 grid
- Ships cannot be adjacent to each other (must have 1 empty cell gap)
- All ships must be placed before battle can begin

### Battle Rules
- Players alternate turns attacking opponent's grid
- Attack results: **Hit** 💥, **Miss** 💧, **Sunk** 💀
- When all cells of a ship are hit, the ship is sunk
- First player to sink the entire enemy fleet wins!
- Real-time notifications keep both players informed

## 🌊 Environment Variables

### Backend (.env.local)
```env
# Database Configuration
DATABASE_URL="postgresql://battleships_user:battleships_password@localhost:5432/battleships"

# Server Configuration
NODE_ENV="development"
PORT=3001

# Security Keys (generate with: openssl rand -hex 64)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
SESSION_SECRET="your-session-secret-key-change-this-in-production"
```

### Frontend (.env.local)
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Development Configuration
NODE_ENV=development
```

### Docker Environment
```env
# For Docker Compose (optional override)
JWT_SECRET=your-production-jwt-secret
SESSION_SECRET=your-production-session-secret
```

## 🚨 Troubleshooting

### Common Issues

**Port Conflicts**
```bash
# Kill processes on specific ports
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:3001 | xargs kill -9  # Backend
lsof -ti:5432 | xargs kill -9  # PostgreSQL

# Or use different ports in environment variables
```

**Database Connection Issues**
```bash
# Reset database completely
cd backend && npx prisma migrate reset --force

# Regenerate Prisma client
npx prisma generate

# Check database status
docker-compose ps postgres
docker-compose logs postgres
```

**Docker Issues**
```bash
# Rebuild containers from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d

# Clear Docker cache
docker system prune -a
```

**Frontend Build Issues**
```bash
# Clear Next.js cache
cd frontend && rm -rf .next

# Reinstall dependencies
npm run clean && npm run install:all

# Check TypeScript errors
cd frontend && npx tsc --noEmit
```

**Backend TypeScript Errors**
```bash
# Check backend TypeScript
cd backend && npx tsc --noEmit

# Rebuild backend
npm run build:backend
```

### Health Checks
```bash
# Check API health
curl http://localhost:3001/health

# Check database connection
cd backend && npx prisma db seed

# Check all services status
docker-compose ps
```

## 📊 Performance Features

- **Optimized Database Queries** - Prisma with connection pooling and selective field loading
- **Efficient State Management** - Smart polling with client-side caching
- **Responsive Design** - Mobile-first approach with TailwindCSS optimizations
- **Code Splitting** - Next.js automatic optimization and lazy loading
- **Type Safety** - Full TypeScript coverage preventing runtime errors
- **Bundle Analysis** - Webpack bundle analyzer for size optimization

## 🔐 Security Features

- **CORS Protection** - Configured for development and production environments
- **Helmet Security** - HTTP security headers (XSS, CSP, etc.)
- **Error Handling** - Secure error messages without sensitive data exposure
- **Environment Isolation** - Separate configurations for dev/prod
- **SQL Injection Prevention** - Prisma ORM parameterized queries
- **Authentication Ready** - JWT token infrastructure in place

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Raveen Panditha**
- GitHub: https://github.com/RaveenP-glitch
- LinkedIn: https://linkedin.com/in/raveen-panditha

---

⭐ **Star this repository if you found it helpful!**

