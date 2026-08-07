# 🌐 Deployment & Docker Containerization Guide

This project is fully containerized using **Docker** and optimized for seamless deployment on **Vercel** (Frontend) and **Render / Railway / GCP / AWS** (Backend & WhatsApp Gateway).

---

## 🐳 1. Docker Containerization Specifications

### A. Backend API Docker Container (`backend/Dockerfile`)

The backend uses a **Multi-Stage Docker Build** to keep final image sizes minimal (<180MB) and secure:

- **Stage 1 (Builder)**: `maven:3.9.7-eclipse-temurin-17` compiles `src/` into `app.jar` skipping test suites.
- **Stage 2 (Runtime)**: `eclipse-temurin:17-jre-alpine` lightweight JRE container.
- **Dynamic Port Binding**: Passes `-Dserver.port=${PORT}` dynamically to support Render/Railway environment variables.

```dockerfile
# Stage 1: Build Java Jar
FROM maven:3.9.7-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create Slim Alpine JRE Runtime Image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/meals-bowls-0.0.1-SNAPSHOT.jar app.jar
ENV PORT=8080
EXPOSE ${PORT}
ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-jar", "app.jar"]
```

---

### B. WhatsApp Gateway Docker Container (`wa-gateway/Dockerfile`)

The WhatsApp gateway runs inside a lightweight **Node 20 Alpine** container with native build toolchains:

- **Base Image**: `node:20-alpine`
- **Native Build Tools**: `git python3 make g++` (required by `@whiskeysockets/baileys` socket compilation)
- **Session Volume Directory**: `/app/auth_info` created for local session state
- **Exposed Port**: `3001`

```dockerfile
FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache git python3 make g++
COPY package*.json ./
RUN npm install --production
COPY . .
RUN mkdir -p auth_info
EXPOSE 3001
CMD ["npm", "start"]
```

---

## 🛠️ 2. Building & Running Docker Containers Locally

### Build & Run Backend Container:
```bash
# 1. Build Image
docker build -t meals-bowls-backend ./backend

# 2. Run Container
docker run -p 8080:8080 \
  -e MONGODB_URI="mongodb+srv://..." \
  -e JWT_SECRET="secret" \
  -e ADMIN_PASSWORD="utkarsh13" \
  -e WA_GATEWAY_URL="http://host.docker.internal:3001" \
  meals-bowls-backend
```

### Build & Run WhatsApp Gateway Container:
```bash
# 1. Build Image
docker build -t meals-bowls-wa-gateway ./wa-gateway

# 2. Run Container
docker run -p 3001:3001 \
  -e WA_GATEWAY_API_KEY="meals-bowls-secret" \
  meals-bowls-wa-gateway
```

---

## 🚀 3. Cloud Deployment Procedures

### Frontend Deployment (Vercel)
1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend/`.
3. Set Environment Variable:
   - `VITE_API_BASE_URL` = `https://your-backend-api.onrender.com`
4. Click **Deploy**. Vercel handles SPA routing via `vercel.json`.

---

### Backend Deployment (Render / Railway)
1. Create a new **Web Service** on Render/Railway connected to your repository.
2. Set **Root Directory** to `backend/`.
3. Select **Dockerfile** environment (`backend/Dockerfile`).
4. Set Environment Variables:
   - `SPRING_PROFILES_ACTIVE` = `prod`
   - `MONGODB_URI` = `mongodb+srv://user:pass@cluster.mongodb.net/meals_bowls`
   - `JWT_SECRET` = `[Your-Random-256-Bit-Secret-Key]`
   - `ADMIN_PASSWORD` = `utkarsh13`
   - `WA_GATEWAY_URL` = `https://your-wa-gateway.onrender.com`
   - `WA_GATEWAY_API_KEY` = `meals-bowls-secret`
   - `FRONTEND_URL` = `https://your-domain.vercel.app`

---

### WhatsApp Gateway Deployment (Render / Railway)
1. Create a separate **Web Service** on Render/Railway.
2. Set **Root Directory** to `wa-gateway/`.
3. Select **Dockerfile** environment (`wa-gateway/Dockerfile`).
4. Set Environment Variables:
   - `PORT` = `3001`
   - `WA_GATEWAY_API_KEY` = `meals-bowls-secret`

---

## ⚡ 4. 24/7 Always-On Setup (UptimeRobot)

Render free instances go to sleep after 15 minutes of inactivity. To keep the backend **Always Active 24/7**:

1. Go to [UptimeRobot.com](https://uptimerobot.com) and create a free account.
2. Click **Add New Monitor**:
   - **Type**: `HTTP(s)`
   - **Name**: `Meals & Bowls API`
   - **URL**: `https://your-backend-api.onrender.com/api/public/health`
   - **Interval**: `Every 5 minutes`
3. Save. UptimeRobot pings the health endpoint every 5 minutes, keeping the Render service active 24/7.
