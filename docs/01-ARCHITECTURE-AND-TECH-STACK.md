# 🏗️ System Architecture & Tech Stack

## System Overview

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

## Technical Specifications

### 1. Frontend Layer
- **Framework**: React 19, Vite 8
- **Styling**: Tailwind CSS (with `darkMode: 'class'`), framer-motion animations
- **State & Data Fetching**: TanStack React Query v5, Axios
- **Routing**: React Router v7 (Protected Routes for `/admin/*` and `/customer/*`)
- **Theme**: Light & Dark mode support with persistent state (`useTheme` & `ThemeContext`)

### 2. Backend API Layer
- **Language & Runtime**: Java 17 OpenJDK
- **Framework**: Spring Boot 3.3.1, Spring Security (Stateless JWT)
- **Database**: MongoDB (Spring Data MongoDB)
- **Authentication**: JWT tokens (Roles: `ROLE_ADMIN`, `ROLE_CUSTOMER`)
- **Containerization**: Multi-stage `Dockerfile`

### 3. WhatsApp Gateway Layer
- **Runtime**: Node.js 18+
- **Protocol Library**: `@whiskeysockets/baileys` (v6.7+)
- **Session Auth**: `useMultiFileAuthState` (saved in `./auth_info`)
- **Security**: Secret Header Key authentication (`x-api-key`)
- **Containerization**: Single-stage Node `Dockerfile`
