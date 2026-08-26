# Walkthrough — Google Sheets Daily Backup & Admin UI

This walkthrough documents the implementation of the **Automated Daily 12:00 AM Google Sheets Backup System** and the **Admin Management UI** for the Meals & Bowls application.

---

## 🚀 Key Features Implemented

### 1. Backend (Spring Boot + MongoDB + Google Sheets API)
- **Google Sheets API & Auth Dependencies ([pom.xml](file:///e:/Downloads/meals-bowls/backend/pom.xml))**:
  - Integrated `google-api-services-sheets` and `google-auth-library-oauth2-http`.
- **Database Entities & Repositories**:
  - `BackupLog.java`: Stores backup execution timestamp, status (`SUCCESS` / `FAILED`), record counts, trigger type (`AUTOMATIC` / `MANUAL`), and error details.
  - `BackupConfig.java`: Stores Google Sheet ID, auto-backup toggle status, and cron configuration.
- **Data Export & Sync Service ([GoogleSheetsService.java](file:///e:/Downloads/meals-bowls/backend/src/main/java/com/mealsbowls/backup/GoogleSheetsService.java))**:
  - Exports MongoDB data into organized tabular Google Sheet tabs:
    - 📄 **Customers**: Customer ID, Name, Mobile, Status, Created Date
    - 📄 **Subscriptions**: Sub ID, Customer ID, Plan Name, Price, Dates, Total/Consumed/Remaining Meals, Status
    - 📄 **Payments**: Payment ID, Customer ID, Customer Name, Plan Name, Amount, Date, Status
- **Daily 12:00 AM Midnight Scheduler ([BackupScheduler.java](file:///e:/Downloads/meals-bowls/backend/src/main/java/com/mealsbowls/backup/BackupScheduler.java))**:
  - Automatically runs every night at **12:00 AM Midnight IST** (`@Scheduled(cron = "0 0 0 * * ?")`).
- **Admin REST API ([BackupController.java](file:///e:/Downloads/meals-bowls/backend/src/main/java/com/mealsbowls/backup/BackupController.java))**:
  - `GET /api/admin/backup/status` - Backup health stats & latest log
  - `GET /api/admin/backup/logs` - Recent 20 execution logs
  - `POST /api/admin/backup/trigger` - Instant 1-click manual backup trigger
  - `POST /api/admin/backup/config` - Update Google Sheet ID and auto-backup toggle

---

### 2. Frontend Admin UI (React + Tailwind CSS)
- **API Client ([backupService.js](file:///e:/Downloads/meals-bowls/frontend/src/services/backupService.js))**:
  - Functions for status polling, triggering instant backups, and saving configurations.
- **Admin Management Page ([BackupManagement.jsx](file:///e:/Downloads/meals-bowls/frontend/src/pages/admin/backup/BackupManagement.jsx))**:
  - **Overview Stats Cards**: Auto-schedule status, Last Backup result badge, Total records count, and direct 📊 **"Open Google Sheet"** button.
  - **Instant Backup Action**: ⚡ **"Backup Now"** button with live spinner and feedback notification.
  - **Configuration Form**: Google Sheet ID input with setup instructions for Service Account sharing.
  - **Execution History Table**: Detailed list of past backup attempts with timestamps, mode (Automatic/Manual), status badges, and error diagnostics.
- **Sidebar & Routes Integration**:
  - Registered route `/admin/backup` in `routes/index.jsx`.
  - Added **"Data Backup"** (with `Database` icon) in `Sidebar.jsx`.

---

## 📌 Setup Instructions for Admin

1. **Create Google Cloud Service Account**:
   - Go to Google Cloud Console -> Create Service Account -> Download JSON Key as `credentials.json`.
   - Place `credentials.json` in project root directory (`e:\Downloads\meals-bowls\backend\credentials.json`).
2. **Share Google Sheet**:
   - Create a Google Sheet in your Google Drive.
   - Click **Share** and add the Service Account email address as an **Editor**.
3. **Configure Sheet ID**:
   - Copy the Sheet ID from the browser URL: `docs.google.com/spreadsheets/d/`**`[SHEET_ID]`**`/edit`.
   - Open Admin Panel -> **Data Backup** tab -> Paste Sheet ID -> Click **Save Configuration**.
4. **Trigger Backup**:
   - Click **"Backup Now"** to test live sync immediately, or let the automated scheduler run at **12:00 AM Midnight** daily.
