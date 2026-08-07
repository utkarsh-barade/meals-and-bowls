# 🛠️ Troubleshooting & Frequently Asked Questions

## 1. Render Free Tier Sleep Mode (Cold Start Delay)

### Problem
After 15 minutes of inactivity, the Render API goes to sleep, causing the next request to take 30–50 seconds to respond.

### Solution
Configure a free uptime monitor (such as [UptimeRobot](https://uptimerobot.com) or [cron-job.org](https://cron-job.org)):
- Target URL: `https://your-backend-api.onrender.com/api/public/health`
- Interval: `Every 5 minutes`
- This ensures the Render web service stays **Always Active 24/7** without sleeping.

---

## 2. WhatsApp Scan "Couldn't Connect" / "Couldn't Link Device"

### Problem
Scanning QR Code on mobile phone results in "Couldn't link device" error.

### Solution
1. In Admin Dashboard (`/admin/whatsapp`), click **Generate New QR** to clear stale session files.
2. Ensure mobile phone has active internet connection when tapping "Link a Device".
3. Scan the newly generated QR code.

---

## 3. CORS Error on Deployed Frontend

### Problem
Frontend on Vercel shows `CORS header 'Access-Control-Allow-Origin' missing`.

### Solution
Set environment variable `FRONTEND_URL` in your Render Backend environment settings:
```env
FRONTEND_URL=https://your-meals-bowls-domain.vercel.app
```

---

## 4. Admin Login Failure (`Invalid Credentials`)

### Solution
Ensure `ADMIN_PASSWORD` in Render Backend environment settings matches your login password (e.g., `utkarsh13`).
Default login mobile is `9999999999`.
