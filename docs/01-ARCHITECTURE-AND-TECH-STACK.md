# 🏗️ System Architecture & Database Structure

## 1. System Overview

**Meals & Bowls** is a subscription-based Indian Thali mess management system. It comprises three decoupled microservices:

1. **Frontend SPA** (React 19 + Vite + Tailwind CSS) — Deployed on **Vercel**
2. **Backend REST API** (Java 17 + Spring Boot 3 + Spring Security + MongoDB) — Deployed on **Render / Railway**
3. **WhatsApp Gateway** (Node.js + Baileys Multi-Device Protocol) — Deployed on **Render / Railway**

```
┌───────────────────────────────┐
│       Frontend (Vercel)       │
│  React + Vite + Tailwind CSS  │
└──────────────┬────────────────┘
               │ HTTP REST APIs
               ▼
┌───────────────────────────────┐        HTTP API         ┌──────────────────────────────┐
│     Backend (Render/Railway)  │ ──────────────────────> │    WhatsApp Gateway Service  │
│   Java 17 / Spring Boot 3     │                         │   Node.js + Baileys v6.7+    │
└──────────────┬────────────────┘                         └──────────────┬───────────────┘
               │ MongoDB Driver                                          │ WebSockets
               ▼                                                         ▼
┌───────────────────────────────┐                         ┌──────────────────────────────┐
│      MongoDB Atlas Cloud      │                         │     WhatsApp Web Servers     │
└───────────────────────────────┘                         └──────────────────────────────┘
```

---

## 2. Technical Specifications

### A. Frontend Layer
- **Framework**: React 19, Vite 8
- **Styling**: Tailwind CSS (with `darkMode: 'class'`), framer-motion animations
- **State & Data Fetching**: TanStack React Query v5, Axios
- **Routing**: React Router v7 (Protected Routes for `/admin/*` and `/customer/*`)
- **Theme**: Light & Dark mode support with persistent state (`useTheme` & `ThemeContext`)

### B. Backend API Layer
- **Language & Runtime**: Java 17 OpenJDK
- **Framework**: Spring Boot 3.3.1, Spring Security (Stateless JWT)
- **Database**: MongoDB (Spring Data MongoDB)
- **Authentication**: JWT tokens (Roles: `ROLE_ADMIN`, `ROLE_CUSTOMER`)
- **Containerization**: Multi-stage `Dockerfile` (`maven:3.9.7-eclipse-temurin-17` builder & `eclipse-temurin:17-jre-alpine` runtime)

### C. WhatsApp Gateway Layer
- **Runtime**: Node.js 18+
- **Protocol Library**: `@whiskeysockets/baileys` (v6.7+)
- **Session Auth**: `useMultiFileAuthState` (saved in `./auth_info`)
- **Security**: Secret Header Key authentication (`x-api-key`)
- **Containerization**: Dockerfile (`node:20-alpine` with `git python3 make g++` toolchain)

---

## 3. Database Schemas & Data Structures (MongoDB Atlas)

**Database Name**: `meals_bowls`

### Collection 1: `customers`
Stores user profile information for admins and subscribers.

```json
{
  "_id": 1001,
  "fullName": "Rahul Sharma",
  "mobileNumber": "9876543210",
  "password": "$2a$10$e8Z... (BCrypt Hashed)",
  "photoUrl": "https://images.unsplash.com/...",
  "status": "ACTIVE",
  "createdAt": "2026-08-01T10:00:00.000Z",
  "updatedAt": "2026-08-01T10:00:00.000Z"
}
```

---

### Collection 2: `plans`
Stores thali subscription plan definitions.

```json
{
  "_id": 1,
  "name": "Plan 1",
  "mealsTotal": 30,
  "price": 2700.0,
  "validityDays": 35,
  "description": "30 Meals Valid for 35 Days (Lunch or Dinner)"
}
```

---

### Collection 3: `subscriptions`
Stores customer subscription assignments and remaining meal balances.

```json
{
  "_id": 5001,
  "customerId": 1001,
  "planId": 1,
  "planName": "Plan 1",
  "planPrice": 2700.0,
  "startDate": "2026-08-01",
  "expiryDate": "2026-09-05",
  "mealsTotal": 30,
  "mealsConsumed": 12,
  "status": "ACTIVE",
  "createdAt": "2026-08-01T10:30:00.000Z",
  "updatedAt": "2026-08-07T13:15:00.000Z"
}
```

---

### Collection 4: `meal_audit_logs`
Logs every meal serving, correction, or status change for auditability.

```json
{
  "_id": 9001,
  "customerId": 1001,
  "subscriptionId": 5001,
  "mealDate": "2026-08-07",
  "mealType": "LUNCH",
  "action": "SERVED",
  "createdAt": "2026-08-07T13:15:00.000Z"
}
```

---

### Collection 5: `payments`
Tracks customer payment transactions and receipt statuses.

```json
{
  "_id": 7001,
  "customerId": 1001,
  "customerName": "Rahul Sharma",
  "customerMobile": "9876543210",
  "subscriptionId": 5001,
  "planName": "Plan 1",
  "amount": 2700.0,
  "paymentDate": "2026-08-01",
  "status": "PAID",
  "createdAt": "2026-08-01T10:30:00.000Z",
  "updatedAt": "2026-08-01T10:30:00.000Z"
}
```

---

### Collection 6: `database_sequences`
Tracks auto-incrementing numerical IDs for collections.

```json
{
  "_id": "customer_sequence",
  "seq": 1015
}
```
