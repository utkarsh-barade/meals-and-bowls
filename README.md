# 🍽️ Meals & Bowls

Subscription-based thali mess management system.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite, Tailwind CSS, shadcn/ui, React Router, TanStack Query, Axios |
| Backend | Java 17, Spring Boot 3, Spring Security, Spring Data JPA, Hibernate, Lombok, MapStruct |
| Database | MySQL |
| Auth | JWT (role-based: ADMIN, CUSTOMER) |
| Build | Maven (backend), npm (frontend) |

---

## Prerequisites

- **Java 17+** — [Download](https://www.oracle.com/java/technologies/downloads/)
- **Maven 3.9+** — [Download](https://maven.apache.org/download.cgi)
- **Node.js 18+** — [Download](https://nodejs.org/)
- **MySQL 8+** — [Download](https://dev.mysql.com/downloads/)

---

## Backend Setup

### 1. Create MySQL Database

```sql
CREATE DATABASE meals_bowls CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp backend/.env.example backend/.env
```

Set these in your terminal (or use a `.env` loader):

```bash
export DB_URL=jdbc:mysql://localhost:3306/meals_bowls?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
export DB_USERNAME=root
export DB_PASSWORD=your_password
export JWT_SECRET=your-256-bit-secret
export JWT_EXPIRY_MS=86400000
export CORS_ORIGINS=http://localhost:5173
```

### 3. Start Backend

```bash
cd backend
mvn spring-boot:run
```

Server starts on **http://localhost:8080**

---

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

```bash
cp frontend/.env.example frontend/.env.local
# Edit VITE_API_BASE_URL if needed
```

### 3. Start Frontend

```bash
npm run dev
```

App opens on **http://localhost:5173**

---

## Routes

| Path | Description | Access |
|---|---|---|
| `/login` | Customer Login | Public |
| `/signup` | Customer Sign Up | Public |
| `/admin/login` | Admin Login | Public |
| `/admin/dashboard` | Admin Dashboard | ADMIN only |
| `/admin/customers` | Customer Management | ADMIN only |
| `/admin/meal-management` | Meal Serving | ADMIN only |
| `/admin/meal-history` | Meal History | ADMIN only |
| `/admin/payments` | Payments | ADMIN only |
| `/admin/reports` | Reports | ADMIN only |
| `/dashboard` | Customer Dashboard | CUSTOMER only |
| `/meal-history` | Customer Meal History | CUSTOMER only |
| `/profile` | Customer Profile | CUSTOMER only |

---

## API Endpoints (Auth)

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/admin/login` | Public |
| POST | `/api/auth/customer/login` | Public |
| POST | `/api/auth/customer/register` | Public |

---

## Project Structure

```
meals-bowls/
├── backend/          # Spring Boot API
│   └── src/main/java/com/mealsbowls/
│       ├── config/       # Security, JWT, CORS
│       ├── auth/         # Auth controller, service, JWT filter
│       ├── common/       # ApiResponse, Role enum
│       ├── exception/    # GlobalExceptionHandler, AppException
│       ├── customer/     # (stub)
│       ├── plan/         # (stub)
│       ├── subscription/ # (stub)
│       ├── meal/         # (stub)
│       ├── payment/      # (stub)
│       ├── report/       # (stub)
│       └── notification/ # (stub)
│
└── frontend/         # React + Vite SPA
    └── src/
        ├── components/layout/   # Header, Sidebar, AdminLayout, CustomerLayout
        ├── components/ui/       # Button, Card, Input, Table, Badge
        ├── context/             # AuthContext
        ├── hooks/               # useAuth
        ├── pages/admin/         # Auth + placeholder admin pages
        ├── pages/customer/      # Auth + placeholder customer pages
        ├── routes/              # Router, ProtectedRoute
        ├── services/            # axios.js, authService.js
        └── utils/               # cn.js
```

---

## Design System

Colors from DESIGN.md:
- **Primary**: Emerald `#16A34A`
- **Secondary**: Amber `#F59E0B`
- **Danger**: Red `#DC2626`
- **Info**: Blue `#2563EB`
- **Background**: `#F8FAFC`

Font: **Inter** (Google Fonts)

---

## Deployment (Free Tier Stack)

This project is configured to run securely on a free-tier stack using **Vercel** for the frontend, **Render** for the backend, and **Render PostgreSQL** for the database.

### 1. Database Setup (Render)
1. Go to your [Render Dashboard](https://dashboard.render.com/) and create a new **PostgreSQL** instance.
2. Once provisioned, copy the **Internal Database URL** (or External if required).
3. The connection string looks like: `postgres://user:pass@host/dbname`.

### 2. Backend Deployment (Render)
The backend uses a multi-stage `Dockerfile` and strict environment variables for production.

1. In Render, create a new **Web Service** connected to your repository.
2. Set the **Root Directory** to `backend/`.
3. Set the **Build Command** to `docker build` (Render will automatically detect the Dockerfile in the `backend/` directory).
4. In the **Environment Variables** section, add the following:
   - `SPRING_PROFILES_ACTIVE=prod`
   - `DATABASE_URL` = `jdbc:postgresql://<your_host>/<your_db>` (Change the `postgres://` from step 1 to `jdbc:postgresql://`)
   - `DB_USERNAME` = Your database username
   - `DB_PASSWORD` = Your database password
   - `JWT_SECRET` = A strong, random 256-bit string
   - `ADMIN_PASSWORD` = Your desired admin panel password
   - `WHATSAPP_API_TOKEN` = (Optional) Meta Developer API Token
   - `WHATSAPP_PHONE_NUMBER_ID` = (Optional) Meta Phone Number ID
   - `FRONTEND_URL` = The exact URL where you will deploy your frontend (e.g., `https://meals-bowls.vercel.app`)

### 3. Frontend Deployment (Vercel)
The frontend uses Vite and React Router, utilizing `vercel.json` for seamless client-side routing.

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and import your repository.
2. During the import configuration, set the **Root Directory** to `frontend`.
3. In the **Environment Variables** section, add:
   - `VITE_API_BASE_URL` = The Render URL of your backend (e.g., `https://meals-bowls-api.onrender.com`)
4. Click **Deploy**. Vercel will build the frontend and serve it globally.
