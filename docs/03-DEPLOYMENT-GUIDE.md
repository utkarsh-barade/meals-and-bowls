# 🌐 Deployment Guide (Vercel & Render / Railway)

This project is optimized for deployment on **Vercel** (Frontend) and **Render / Railway** (Backend & WhatsApp Gateway).

---

## 1. Frontend Deployment (Vercel)

1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend/`.
3. Set Environment Variable:
   - `VITE_API_BASE_URL` = `https://your-backend-api.onrender.com`
4. Click **Deploy**. Vercel handles SPA routing via `vercel.json`.

---

## 2. Backend Deployment (Render / Railway)

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

## 3. WhatsApp Gateway Deployment (Render / Railway)

1. Create a separate **Web Service** on Render/Railway.
2. Set **Root Directory** to `wa-gateway/`.
3. Select **Dockerfile** environment (`wa-gateway/Dockerfile`).
4. Set Environment Variables:
   - `PORT` = `3001`
   - `WA_GATEWAY_API_KEY` = `meals-bowls-secret`

---

## 4. 24/7 Always-On Setup (UptimeRobot)

Render free instances go to sleep after 15 minutes of inactivity. To keep the backend **Always Active 24/7**:

1. Go to [UptimeRobot.com](https://uptimerobot.com) and create a free account.
2. Click **Add New Monitor**:
   - **Type**: `HTTP(s)`
   - **Name**: `Meals & Bowls API`
   - **URL**: `https://your-backend-api.onrender.com/api/public/health`
   - **Interval**: `Every 5 minutes`
3. Save. UptimeRobot pings the health endpoint every 5 minutes, keeping the Render service active 24/7.
