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
- **Styling**: Vanilla CSS for layouts and custom design tokens (custom variables, CSS animations, etc.)
- **Routing**: React Router DOM (v7) with centralized route constants
- **State & Data Fetching**: TanStack Query (v5) + Axios
- **Form Management & Validation**: React Hook Form + Zod
- **Icons & UI Utilities**: Lucide React, Framer Motion, React Hot Toast

### Backend
- **Framework**: Node.js + Express (TypeScript)
- **Database**: MongoDB + Mongoose ODM
- **Architecture**: Domain-driven modular design using the Repository Pattern and SOLID principles.
- **AI Integration**: OpenRouter API (Google Gemini 2.5 Flash)
- **Image Hosting**: Cloudinary (Multipart form data with Multer)
- **Authentication**: JWT Access & Refresh Tokens + bcrypt + secure HTTP-only cookies
- **Validation**: Zod (Input validation schemas)

### Workspace
- **Monorepo Manager**: pnpm (v10) workspace

---

## 📁 Architecture & Refactoring Details

NutriLens backend follows strict **SOLID** principles, utilizing the **Repository Pattern** to decouple business logic from the database layer.

```
HTTP Request ──> Express Router ──> Controller ──> Service ──> Repository ──> Mongoose ──> DB
                                        │             │             │
                                  (Validation)  (Logic/Math)  (DB Queries)
```

### Centralized Application Constants (Refactor Phase)
To ensure high maintainability and prevent magic strings or hardcoded paths across layers, the following refactoring has been performed:

1. **Backend Route Constants**: All REST routes are mapped to a central config object in [routes.constants.ts](file:///e:/Projects/Nutrition-Tracking-App/Backend/src/shared/routes.constants.ts). Base routing and sub-routers reference these values directly.
2. **Backend Success & Error Messaging**: Success messages are centralised in [successMessages.constants.ts](file:///e:/Projects/Nutrition-Tracking-App/Backend/src/shared/successMessages.constants.ts) and error exceptions/Zod validation constraints are mapped to [errorMessages.constants.ts](file:///e:/Projects/Nutrition-Tracking-App/Backend/src/shared/errorMessages.constants.ts). Middlewares, validators, services, repositories, and controllers consume these constants.
3. **Frontend Routes Configuration**: All client routes are unified in [routes.constants.ts](file:///e:/Projects/Nutrition-Tracking-App/Frontend/src/app/router/routes.constants.ts) and referenced globally in the navigation layout, pages, and router definitions.
4. **TypeScript Strictness**: Zero `any` types allowed on both ends. Custom Recharts custom tooltips, Axios middleware queues, and catch blocks are strictly typed (e.g. `catch (err: unknown)`).

---

## ⚙️ Environment Configuration

You must create environment configuration files to run the application locally.

### 1. Frontend Configuration
Create a `.env` file in the `Frontend` folder:
```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Backend Configuration
Create a `.env` file in the `Backend` folder:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/nutrilens
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
CLIENT_URL=http://localhost:5173

# AI & Media Credentials
OPENROUTER_API_KEY=your_openrouter_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## 🚀 Installation & Running Locally

Follow these steps to run the complete stack locally:

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or a remote MongoDB Atlas connection URI
- pnpm installed globally (`npm install -g pnpm`)

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Muhammed-Shan-M/NutriLens.git
   cd NutriLens
   ```

2. **Install Dependencies**
   Run the following command in the root folder to automatically install dependencies for both the frontend and backend using pnpm workspaces:
   ```bash
   pnpm install
   ```

3. **Provide Environment Configurations**
   Create the `.env` files as described in the **Environment Configuration** section.

4. **Start Development Servers**
   To launch the Vite development server (port 5173) and backend Express server (port 5000) concurrently:
   ```bash
   pnpm dev
   ```

5. **Production Build**
   To compile TypeScript and bundle the frontend/backend for production deployment:
   ```bash
   pnpm build
   ```

---

## 🔒 Quality & Maintainability

- **TypeScript Strict Mode**: Zero `any` types allowed. Complete interface mapping from DB models up to Frontend UI components.
- **Graceful Error Handling**: Global Error boundaries, custom error fallback middleware, customized 404 pages, and unauthorized states.
- **Network Resiliency**: TanStack Query configuration for automatic cache eviction, stale-while-revalidate fetching, and network failure recovery.
