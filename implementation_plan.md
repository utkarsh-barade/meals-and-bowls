# Implementation Plan: Google Sheets Daily Backup & Admin UI

Set up an automated **Daily 12:00 AM Data Backup** from MongoDB to Google Sheets with an interactive **Admin UI** to view backup history, trigger instant manual backups, and configure Google Sheets settings.

---

## Architecture & Flow

```
[MongoDB Database] 
       │
       ▼
 [Spring Boot Backend] ──(Raat 12:00 AM Cron @Scheduled / Manual UI Trigger)──► [Google Sheets API]
       │                                                                               │
       ▼                                                                               ▼
 [Backup History DB Collection]                                                [Google Sheet Dashboard]
       │
       ▼
 [Admin React UI (/admin/backup)] ◄── Status, Instant "Backup Now", Direct Sheet Link
```

---

## User Review Required

> [!IMPORTANT]
> **Google Cloud Service Account Key Needed**: To write data to Google Sheets automatically, a Google Cloud Service Account JSON key is required. The bot email from the credentials must be added as an **Editor** to your Google Sheet.

> [!NOTE]
> Backup runs automatically every night at **12:00 AM Midnight IST** (`0 0 0 * * ?` cron). Admin can also click **"Backup Now"** anytime from the UI.

---

## Proposed Changes

### Backend (`/backend`)

#### [MODIFY] `pom.xml`
- Add Google Sheets API & Google Drive API client dependencies (`google-api-services-sheets`, `google-auth-library-oauth2-http`).

#### [MODIFY] `application.yml`
- Add backup configuration properties:
  ```yaml
  app:
    backup:
      google-sheet-id: ${GOOGLE_SHEET_ID:}
      credentials-path: ${GOOGLE_CREDENTIALS_PATH:credentials.json}
      enabled: ${BACKUP_ENABLED:true}
      cron: "0 0 0 * * ?"
  ```

#### [NEW] `BackupLog.java` (Entity)
- MongoDB collection to record backup history:
  - `id`, `timestamp`, `triggerType` (AUTOMATIC / MANUAL), `status` (SUCCESS / FAILED), `totalRecords`, `details`, `sheetUrl`.

#### [NEW] `GoogleSheetsService.java`
- Handles authentication with Google Sheets API using Service Account.
- Exports MongoDB collections (`Users`, `Subscriptions`, `MealLogs`, `Payments`) into structured tabular sheets:
  - Sheet Tab 1: `Customers & Subscriptions`
  - Sheet Tab 2: `Meal History`
  - Sheet Tab 3: `Payments & Transactions`

#### [NEW] `BackupScheduler.java`
- Spring `@Scheduled(cron = "0 0 0 * * ?")` trigger to run backup automatically every night at 12:00 AM.

#### [NEW] `BackupController.java`
- `GET /api/admin/backup/status` - Get last backup status and stats.
- `GET /api/admin/backup/history` - Get list of past backup logs.
- `POST /api/admin/backup/trigger` - Instant manual backup trigger.
- `POST /api/admin/backup/settings` - Update Google Sheet ID and auto-backup toggles.

---

### Frontend (`/frontend`)

#### [NEW] `backupService.js`
- API calls to backend endpoints: `getBackupStatus()`, `getBackupHistory()`, `triggerManualBackup()`, `updateBackupSettings()`.

#### [NEW] `BackupManagement.jsx` (`frontend/src/pages/admin/backup/BackupManagement.jsx`)
- **Admin UI Page**:
  - **Overview Banner**: Status indicator (Active/Inactive), Next scheduled backup time (12:00 AM), Last backup result badge.
  - **Action Bar**: Instant ⚡ **"Backup Now"** button with loading spinner & toast notification.
  - **Google Sheet Link**: Direct button 📊 **"Open Google Sheet"**.
  - **Config Panel**: Input field for Google Sheet ID & Auto-backup toggle.
  - **History Table**: List of past backups with timestamp, trigger mode (Auto/Manual), record counts, and status.

#### [MODIFY] `AdminLayout.jsx` & `routes/index.jsx`
- Add "Data Backup" menu item in Admin Sidebar navigation.
- Add route `/admin/backup` rendering `BackupManagement.jsx`.

---

## Verification Plan

### Automated / Backend Tests
- Unit tests for `GoogleSheetsService` formatting and row generation.
- Integration test for `BackupController` API endpoints.

### Manual Verification
1. **Manual Backup Trigger**: Open Admin UI -> Click **"Backup Now"** -> Verify data appears immediately in Google Sheet tabs.
2. **Scheduled Backup Verification**: Verify log entry created at 12:00 AM.
3. **UI Feedback**: Verify error alerts if Google Sheet ID is invalid or access permission is missing.
