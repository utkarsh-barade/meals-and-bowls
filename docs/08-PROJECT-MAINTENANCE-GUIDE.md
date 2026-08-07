# 🛠️ Future Maintenance & Operations Manual

This guide explains how to maintain, update, debug, and manage the **Meals & Bowls** project in the future.

---

## 1. Making Code Updates & Deploying Changes

Whenever you or a developer need to make bug fixes or add new features:

### Step-by-Step Workflow:

1. **Make changes locally** on your machine.
2. **Test locally**:
   - Frontend: `cd frontend && npm run dev`
   - WA Gateway: `cd wa-gateway && npm start`
3. **Commit & Push to GitHub**:
   ```bash
   git add .
   git commit -m "feat/fix: describe your changes"
   git push origin main
   ```
4. **Automated Deployments**:
   - **Vercel** will automatically build & deploy the frontend within ~30 seconds.
   - **Render / Railway** will automatically build & deploy the backend & wa-gateway within ~1-2 minutes.

---

## 2. Managing WhatsApp Connection in Future

If WhatsApp ever disconnects or the phone gets un-paired in the future:

1. Go to Admin Panel → **WhatsApp Status** (`/admin/whatsapp`).
2. Click the **Generate New QR** button.
3. Open **WhatsApp Business App** on your phone → **Settings** → **Linked Devices** → **Link a Device** → Scan the new QR code.
4. If session files ever get corrupted on the server:
   - The `/reconnect` endpoint automatically clears the `./auth_info` session folder and restarts fresh pairing.

---

## 3. Changing Pricing Plans or Admin Passwords

### Changing Admin Password:
- Go to **Render Dashboard** → Select **`meals-bowls-api`** service → **Environment**.
- Update the `ADMIN_PASSWORD` variable (e.g. `ADMIN_PASSWORD=newpassword123`).
- Click **Save Changes**. The backend will restart with the new password.

### Changing Plan Prices or Details:
- **Frontend Display**: Edit `frontend/src/components/landing/sections/MealPlans.jsx`.
- **Backend Data**: Edit `backend/src/main/java/com/mealsbowls/config/DataSeeder.java` or update database via MongoDB Atlas.

---

## 4. Database Maintenance & Backups (MongoDB Atlas)

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com).
2. Go to **Clusters** → **Database Triggers / Backups**.
3. MongoDB Atlas automatically handles daily snapshots.
4. To export a manual JSON backup, use MongoDB Compass or Atlas UI → **Export Collection**.

---

## 5. Security & Dependency Updates

To keep Node.js dependencies up-to-date:

### WhatsApp Gateway (`wa-gateway/`):
```bash
cd wa-gateway
npm update @whiskeysockets/baileys
```

### Frontend (`frontend/`):
```bash
cd frontend
npm update
```
