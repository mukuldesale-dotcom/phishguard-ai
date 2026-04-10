# 🏋️ GymPro — Premium Full-Stack 3D Gym Website

A modern, premium full-stack gym website with cutting-edge 3D animations, smooth UI, and comprehensive fitness tracking features.

![GymPro Screenshot](https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=400&fit=crop)

---

## ✨ Features

### 🎯 Frontend (Next.js 14 + React)
- **3D Animated Hero** — Gym equipment rendered with Three.js + React Three Fiber
- **Smooth Animations** — Framer Motion page transitions and scroll animations
- **Dark Theme** — Premium black + gold color scheme
- **Fully Responsive** — Mobile, tablet, and desktop optimized
- **7 Complete Pages** — Home, Workouts, Diet, Calculator, Dashboard, Progress, Auth

### 💪 Workout Plans
- Weekly workout schedules (Monday–Sunday)
- Filter by difficulty: Beginner / Intermediate / Advanced
- Exercise cards with sets, reps, muscle groups
- Expandable exercise details
- Save favorite workouts (authenticated)

### 🥗 Diet Plans
- Three goal-based programs: Weight Loss, Muscle Gain, Maintenance
- Detailed meal breakdowns (Breakfast, Lunch, Dinner, Snacks)
- Macro nutrient visualization with progress bars
- Calorie and protein breakdowns per food item

### 🧮 Smart Fitness Calculator
- TDEE calculator (Mifflin-St Jeor equation)
- BMI calculator with health category
- Macro nutrient breakdown (Protein, Carbs, Fats)
- Daily water intake recommendation
- Supports metric and imperial units

### 🔐 Authentication System
- JWT-based login/signup
- Multi-step registration form
- Protected routes
- Persistent auth state (Zustand)
- Token auto-refresh

### 📈 Progress Tracking
- Weight progress chart (Area Chart)
- Body measurements tracking
- Mood tracking per entry
- Recharts visualization
- Local entry logging

### 🖥️ Backend (Express.js + MongoDB)
- RESTful API with JWT authentication
- MongoDB models with Mongoose
- Bcryptjs password hashing
- Socket.io real-time notifications
- Helmet security headers
- CORS configuration
- Input validation (express-validator)
- Centralized error handling

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | Next.js 14 (App Router) |
| **UI Library** | React 18 |
| **Styling** | Tailwind CSS 3 |
| **3D Graphics** | Three.js + React Three Fiber + Drei |
| **Animations** | Framer Motion |
| **State Management** | Zustand |
| **Data Fetching** | Axios + React Query |
| **Forms** | React Hook Form |
| **Charts** | Recharts |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT (jsonwebtoken) |
| **Password Hashing** | bcryptjs |
| **Real-time** | Socket.io |
| **Language** | TypeScript (full stack) |

---

## 📁 Project Structure

```
gym-website/
├── frontend/                    # Next.js 14 frontend
│   ├── app/
│   │   ├── layout.tsx           # Root layout with navigation
│   │   ├── page.tsx             # Home page with 3D hero
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx   # Login page
│   │   │   └── signup/page.tsx  # Multi-step signup
│   │   ├── workouts/page.tsx    # Workout plans with filters
│   │   ├── diet/page.tsx        # Diet plans by goal
│   │   ├── calculator/page.tsx  # TDEE/BMI calculator
│   │   ├── dashboard/page.tsx   # User dashboard
│   │   └── progress/page.tsx    # Progress tracking charts
│   ├── components/
│   │   ├── Navigation.tsx       # Responsive navbar with auth
│   │   └── Hero3D.tsx           # Three.js 3D hero section
│   ├── lib/
│   │   ├── api.ts               # Axios API client
│   │   ├── auth.ts              # Zustand auth + theme store
│   │   └── calculations.ts      # Fitness calculation utilities
│   ├── styles/globals.css       # Global styles + Tailwind
│   ├── tailwind.config.ts       # Tailwind configuration
│   ├── next.config.js           # Next.js configuration
│   ├── .env.example             # Environment variables template
│   └── package.json
│
└── backend/                     # Express.js backend API
    ├── src/
    │   ├── server.ts            # Express app + Socket.io
    │   ├── seed.ts              # Database seeder
    │   ├── config/
    │   │   └── database.ts      # MongoDB connection
    │   ├── models/
    │   │   ├── User.ts          # User schema + bcrypt
    │   │   ├── Workout.ts       # Workout + exercise schemas
    │   │   ├── Diet.ts          # Diet plan + meal schemas
    │   │   ├── Progress.ts      # Progress tracking schema
    │   │   └── Notification.ts  # Notification schema
    │   ├── controllers/
    │   │   ├── authController.ts
    │   │   ├── workoutController.ts
    │   │   ├── dietController.ts
    │   │   ├── calculatorController.ts
    │   │   ├── progressController.ts
    │   │   └── userController.ts
    │   ├── routes/
    │   │   ├── auth.ts          # /api/auth/*
    │   │   ├── workouts.ts      # /api/workouts/*
    │   │   ├── diet.ts          # /api/diet/*
    │   │   ├── calculator.ts    # /api/calculator/*
    │   │   ├── progress.ts      # /api/progress/*
    │   │   └── user.ts          # /api/user/*
    │   └── middleware/
    │       ├── auth.ts          # JWT authentication
    │       └── errorHandler.ts  # Centralized error handling
    ├── .env.example
    ├── tsconfig.json
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone and navigate

```bash
cd gym-website
```

### 2. Set up the Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your values
# At minimum, set MONGODB_URI and JWT_SECRET

# Seed the database with sample workouts and diets
npm run seed

# Start development server
npm run dev
```

Backend will run at: **http://localhost:5000**

### 3. Set up the Frontend

```bash
# Navigate to frontend (new terminal)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

Frontend will run at: **http://localhost:3000**

---

## 🔧 Environment Variables

### Backend (.env)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/gym-website` |
| `JWT_SECRET` | JWT signing secret (change in production!) | `your_super_secret_key` |
| `JWT_EXPIRES_IN` | Access token expiry | `7d` |
| `JWT_REFRESH_SECRET` | Refresh token secret | `your_refresh_secret` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | `30d` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

### Frontend (.env.local)

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.io URL | `http://localhost:5000` |

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/signup          Register new user
POST   /api/auth/login           Login user
POST   /api/auth/refresh         Refresh access token
POST   /api/auth/logout          Logout (requires auth)
GET    /api/auth/me              Get current user (requires auth)
```

### Workouts
```
GET    /api/workouts             Get all workouts (filters: difficulty, day, category, search)
GET    /api/workouts/weekly-plan Get complete weekly plan (filter: difficulty)
GET    /api/workouts/:id         Get single workout
POST   /api/workouts/:id/save    Toggle save workout (requires auth)
GET    /api/workouts/user/saved  Get saved workouts (requires auth)
```

### Diet Plans
```
GET    /api/diet                 Get all diet plans (filters: goal, difficulty, search)
GET    /api/diet/goal/:goal      Get plans by goal (weight_loss/muscle_gain/maintenance)
GET    /api/diet/:id             Get single diet plan
```

### Calculator
```
POST   /api/calculator/tdee      Calculate TDEE + macros
POST   /api/calculator/bmi       Calculate BMI
```

### Progress Tracking
```
POST   /api/progress             Log progress entry (requires auth)
GET    /api/progress             Get progress history (requires auth)
DELETE /api/progress/:id         Delete entry (requires auth)
```

### User Management
```
PUT    /api/user/profile         Update profile (requires auth)
PUT    /api/user/password        Change password (requires auth)
DELETE /api/user                 Deactivate account (requires auth)
```

---

## 🗄️ Database Models

### User
```typescript
{
  name: string,
  email: string (unique),
  password: string (hashed),
  age?: number,
  height?: number,        // cm
  weight?: number,        // kg
  gender?: string,
  activityLevel?: string,
  goal?: string,
  savedWorkouts: ObjectId[],
  dietPreferences?: {...},
  refreshToken?: string,
  isActive: boolean
}
```

### Workout
```typescript
{
  name: string,
  description: string,
  day: string,            // Monday-Sunday
  exercises: Exercise[],
  difficulty: string,     // beginner/intermediate/advanced
  duration: number,       // minutes
  caloriesBurned?: number,
  muscleGroups: string[],
  category: string,       // strength/cardio/hiit/yoga
  isPublic: boolean,
  likes: number
}
```

### Diet
```typescript
{
  name: string,
  goal: string,           // weight_loss/muscle_gain/maintenance
  dailyCalories: number,
  macros: { protein, carbs, fats }, // percentages
  meals: Meal[],          // Breakfast/Lunch/Dinner/Snacks
  difficulty: string      // easy/moderate/strict
}
```

---

## 🎨 Design System

### Colors
- **Background**: `#000000` / `#0a0a0a`
- **Cards**: `#141414`
- **Gold Primary**: `#f59e0b`
- **Gold Dark**: `#d97706`
- **Text**: `#ffffff` / `#9ca3af`

### Typography
- **Headings**: Rajdhani (bold, uppercase)
- **Body**: Inter (regular, smooth)

### Components
- `.btn-gold` — Primary gold button
- `.btn-outline-gold` — Gold outline button
- `.card-premium` — Premium dark card
- `.input-gold` — Input with gold focus
- `.badge-beginner/intermediate/advanced` — Difficulty badges
- `.text-gradient-gold` — Gold gradient text

---

## ⚡ Performance

- Next.js Image optimization with lazy loading
- Dynamic import for 3D components (prevents SSR issues)
- Code splitting per page
- Tailwind CSS purging for minimal CSS
- MongoDB indexes for efficient queries

---

## 🔒 Security

- bcryptjs password hashing (salt rounds: 12)
- JWT access + refresh token rotation
- Helmet.js security headers
- CORS whitelist configuration
- Input validation (express-validator)
- Rate limiting (express-rate-limit)
- No sensitive data in JWT payload

---

## 📦 Sample Data

The `npm run seed` command populates the database with:

**Workouts (8 plans):**
- Monday: Chest & Triceps Power / Beginner Upper Body
- Tuesday: Back & Biceps Strength
- Wednesday: Leg Day Domination
- Thursday: Shoulders & Core Circuit
- Friday: Full Body HIIT Blast
- Saturday: Yoga & Flexibility Flow
- Sunday: Light Cardio & Core

**Diet Plans (3 programs):**
- Fat Shredding Plan (1,800 cal — Weight Loss)
- Muscle Builder Plan (3,200 cal — Muscle Gain)
- Balanced Maintenance Plan (2,400 cal — Maintenance)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ for fitness enthusiasts everywhere. **GymPro** — Forge Your Ultimate Body.
