# NutriLens - AI Nutrition Tracking Application

NutriLens is a production-ready, enterprise-grade SaaS application designed to revolutionize how users track their daily nutrition. By utilizing advanced AI vision models via OpenRouter (Gemini), NutriLens can analyze photos of meals to automatically estimate portion sizes, detect food types, and calculate precise macronutrient and calorie values.

The application combines a sleek, modern, mobile-first frontend with a scalable, SOLID-compliant Node.js backend.

---

## 🌟 Key Features

- **AI Food Recognition**: Upload a photo of any meal, and NutriLens will instantly identify the ingredients and estimate the total calories, protein, carbohydrates, and fat.
- **Comprehensive Dashboard**: View your daily nutritional targets, macronutrient split, and remaining allowances in real-time.
- **Detailed Analytics**: Track your progress over 7, 30, or 90 days with interactive charts, pie graphs, and AI-generated insights into your eating habits.
- **Meal History Logging**: A complete searchable and filterable database of every meal you've ever tracked.
- **Dynamic User Profiles**: Set your activity level, physical metrics, and fitness goals to let NutriLens automatically calculate your daily metabolic targets.
- **Production UI/UX**: Dark mode by default, glassmorphism design, loading skeletons, responsive layouts, and robust error handling.

---

## 🛠 Technical Stack

### Frontend
- **Framework**: React (v19) + Vite (v8) + TypeScript
- **Styling**: Tailwind CSS (v4) with a custom design system
- **Routing**: React Router DOM (v7)
- **State & Data Fetching**: TanStack Query (v5) + Axios
- **Form Management & Validation**: React Hook Form + Zod
- **Icons & UI Utilities**: Lucide React, Framer Motion, React Hot Toast

### Backend
- **Framework**: Node.js + Express (TypeScript)
- **Database**: MongoDB + Mongoose ODM
- **Architecture**: Domain-driven modular design using the Repository Pattern and SOLID principles.
- **AI Integration**: OpenRouter API (Google Gemini 2.0 Flash)
- **Image Hosting**: Cloudinary (Multipart form data with Multer)
- **Authentication**: JWT Access & Refresh Tokens + bcrypt
- **Validation**: Zod (Input validation schemas)

### Workspace
- **Monorepo Manager**: pnpm (v10)

---

## 📁 Architecture Overview

NutriLens backend follows strict **SOLID** principles, utilizing the **Repository Pattern** to decouple business logic from the database layer.

```
HTTP Request ──> Express Router ──> Controller ──> Service ──> Repository ──> Mongoose ──> DB
                                        │             │             │
                                  (Validation)  (Logic/Math)  (DB Queries)
```

1. **Controller**: Handles HTTP boundaries, input extraction, and response formatting.
2. **Service**: Contains pure business rules (e.g., BMR calculations, AI API orchestration).
3. **Repository**: Isolates Mongoose queries and data persistence.

---

## ⚙️ Environment Configuration

### Frontend (`Frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (`Backend/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/nutrilens
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
CLIENT_URL=http://localhost:5173

# AI & Media
OPENROUTER_API_KEY=your_openrouter_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## 🚀 Installation & Running Locally

1. **Install Dependencies**
   Run the following from the root directory to install all monorepo dependencies:
   ```bash
   pnpm install
   ```

2. **Start Development Servers**
   To launch both the frontend (Vite) and backend (Express) concurrently:
   ```bash
   pnpm dev
   ```

3. **Production Build**
   To compile TypeScript and bundle the frontend for production:
   ```bash
   pnpm build
   ```

---

## 🔒 Quality & Maintainability

- **TypeScript Strict Mode**: Zero `any` types allowed. Complete interface mapping from DB models up to Frontend UI components.
- **Graceful Error Handling**: Global Error Boundaries, customized 404 pages, and 403 Unauthorized states.
- **Responsive Empty States**: Dedicated illustration states for users without data (e.g., fresh accounts).
- **Network Resiliency**: TanStack Query configuration for automatic retries, caching, and background refetching.

---

*NutriLens is actively maintained and designed as a scalable foundation for advanced health tracking SaaS products.*
