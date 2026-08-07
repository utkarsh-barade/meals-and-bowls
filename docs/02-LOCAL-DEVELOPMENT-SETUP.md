# 💻 Local Development Setup Guide

## Prerequisites

Make sure you have the following installed on your development machine:
- **Node.js**: v18.0.0 or higher
- **JDK**: Java 17 OpenJDK
- **MongoDB**: Local MongoDB community server (port 27017) or MongoDB Atlas URI
- **Git**: Latest version

---

## 🚀 Running Services Locally

### Step 1: Start WhatsApp Gateway (Port 3001)

```bash
cd wa-gateway
npm install
npm start
```
- Gateway starts on `http://localhost:3001`.
- Automatically initializes Baileys socket and generates QR Code.

---

### Step 2: Start Backend API (Port 8080)

1. Verify `backend/src/main/resources/application.yml` has your local database configuration:
```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/meals_bowls
```

2. Run the Spring Boot backend:
```bash
cd backend
# Using JDK 17 java executable:
"C:\Program Files\Java\jdk-17\bin\java.exe" -jar target/meals-bowls-0.0.1-SNAPSHOT.jar
```
- Backend starts on `http://localhost:8080`.

---

### Step 3: Start Frontend SPA (Port 5173)

1. Create `frontend/.env.local`:
```env
VITE_API_BASE_URL=http://localhost:8080
```

2. Install dependencies and start Vite dev server:
```bash
cd frontend
npm install
npm run dev
```
- App opens on `http://localhost:5173`.

---

## 🔐 Default Admin Credentials

- **Mobile**: `9999999999`
- **Password**: `utkarsh13`
- **Admin Login Route**: `http://localhost:5173/admin/login`
