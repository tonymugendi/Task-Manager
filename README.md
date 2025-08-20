# Task Management API

A robust, production-ready REST API for task management built with Node.js, TypeScript, and modern development practices. This backend powers a full-stack task management application with comprehensive authentication, CRUD operations, and professional-grade error handling.

## 🚀 Live Demo

- **API**: [Deployed on Railway](https://your-railway-url.railway.app)
- **Frontend**: [Next.js App on Vercel](https://your-vercel-url.vercel.app)

## 🛠 Tech Stack

### Core Technologies
- **Node.js** - Runtime environment
- **TypeScript** - Type-safe JavaScript
- **Fastify** - High-performance web framework
- **Prisma ORM** - Type-safe database toolkit
- **PostgreSQL** - Production database
- **JWT** - Authentication & authorization

### Development & Quality
- **Zod** - Runtime type validation
- **Jest** - Testing framework with 70%+ coverage
- **Docker** - Containerization
- **ESLint & Prettier** - Code quality tools

### Deployment
- **Railway** - Backend hosting with automatic deployments
- **Vercel** - Frontend hosting
- **GitHub Actions** - CI/CD pipeline

## ✨ Features

### 🔐 Authentication System
- User registration with email validation
- Secure login with JWT tokens
- Password hashing with bcrypt
- Input validation and sanitization

### 📋 Task Management
- **Boards**: Create and manage project boards
- **Lists**: Organize tasks in customizable lists (To Do, In Progress, Review, Done)
- **Tasks**: Full CRUD operations with due dates, descriptions, and assignments
- **Comments**: Collaborative task discussions

### 🛡 Security & Validation
- Comprehensive input validation with Zod schemas
- Global error handling with standardized responses
- SQL injection protection via Prisma ORM
- Type-safe API endpoints

### 🧪 Testing
- Unit tests for utilities and business logic
- Integration tests for API endpoints
- Validation schema testing
- 70%+ test coverage with Jest

## 🏗 Architecture

### Database Schema
```
User (1:N) Board (1:N) List (1:N) Task (1:N) Comment
     └─────────────────────┘
           BoardUser (M:N)
```

### API Structure
```
/auth
  POST /register    - User registration
  POST /login       - User authentication

/boards
  GET    /          - List user's boards
  POST   /          - Create new board
  GET    /:id       - Get board with lists and tasks
  PUT    /:id       - Update board
  DELETE /:id       - Delete board

/boards/:boardId/lists
  POST   /          - Create list
  PUT    /:id       - Update list
  DELETE /:id       - Delete list

/boards/:boardId/lists/:listId/tasks
  POST   /          - Create task
  PUT    /:id       - Update task
  DELETE /:id       - Delete task

/boards/:boardId/lists/:listId/tasks/:taskId/comments
  POST   /          - Add comment
  PUT    /:id       - Update comment
  DELETE /:id       - Delete comment
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tonymugendi/Task-Manager.git
   cd Task-Manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/taskmanager"
   JWT_SECRET="your-super-secure-jwt-secret"
   NODE_ENV="development"
   PORT=3004
   ```

4. **Database setup**
   ```bash
   # Create database
   createdb taskmanager
   
   # Run migrations
   npx prisma migrate dev
   
   # Generate Prisma client
   npx prisma generate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3004`

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests with verbose output
npm run test:verbose
```

### Test Structure
```
tests/
├── controllers/     # Integration tests
├── utils/          # Unit tests
├── schemas/        # Validation tests
└── setup.ts        # Test configuration
```

## 📦 Deployment

### Using Docker
```bash
# Build image
docker build -t task-manager-api .

# Run container
docker run -p 3004:3004 --env-file .env task-manager-api
```

### Using Railway (Recommended)
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Railway automatically builds and deploys on push to main

### Environment Variables (Production)
```env
DATABASE_URL=postgresql://...  # Railway provides this
JWT_SECRET=your-production-secret
NODE_ENV=production
PORT=3004
```

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "error": "ValidationError",
  "message": "Invalid input data",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/auth/register"
}
```

## 🔧 Development

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Airbnb configuration with custom rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality checks

### Database Management
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# View database
npx prisma studio
```

### Debugging
```bash
# View logs
npm run dev

# Database queries (development)
DEBUG=prisma:query npm run dev
```

## 📈 Performance

- **Response Time**: < 100ms average
- **Database**: Optimized queries with Prisma
- **Caching**: HTTP caching headers
- **Validation**: Early request validation
- **Error Handling**: Graceful error responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Write tests for new features
- Follow TypeScript strict mode
- Use conventional commit messages
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Tony Mugendi**
- Frontend-focused Fullstack Engineer
- 6+ years experience with React, Next.js, and TypeScript
- Specializes in UI architecture and developer experience

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://linkedin.com/in/tonymugendi)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black)](https://github.com/tonymugendi)

## 🙏 Acknowledgments

- Built with modern TypeScript and Node.js best practices
- Deployed on Railway and Vercel for production reliability
- Comprehensive testing with Jest for code quality assurance

---

*This project demonstrates production-ready backend development with TypeScript, comprehensive testing, and modern deployment practices.*
