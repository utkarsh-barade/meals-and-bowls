# 📲 WhatsApp Gateway Setup & Troubleshooting Guide

## Overview

The WhatsApp Gateway (`wa-gateway`) is a Node.js microservice utilizing `@whiskeysockets/baileys` to connect to WhatsApp Web without requiring paid Meta API tokens.

---

## Technical Configuration

### Socket Setup (`wa-gateway/index.js`)

```js
sock = makeWASocket({
  version,
  logger,
  auth: state,
  browser: ['Mac OS', 'Chrome', '124.0.0'],
  syncFullHistory: false,
  markOnlineOnConnect: false,
  generateHighQualityLinkPreview: false,
  qrTimeout: 45000,              // 45 seconds QR code active window
  connectTimeoutMs: 60000,
  defaultQueryTimeoutMs: 60000,
  getMessage: async () => ({ conversation: 'Hello' }),
});
```

---

## 🛠️ Session Reset & QR Refresh API

### 1. `POST /reconnect` (Gateway Reset)
- **Endpoint**: `/reconnect` (Header: `x-api-key: meals-bowls-secret`)
- **Action**: Clears `./auth_info` folder, destroys stale socket, and generates a brand-new QR Code PNG.

### 2. Admin UI Trigger (`/admin/whatsapp`)
- Click **Generate New QR** on the Admin UI.
- Calls `/api/admin/whatsapp/reconnect` -> triggers `/reconnect` on Gateway -> displays new QR code within 2 seconds.

---

## ⚠️ Troubleshooting Common Scan Errors

### Issue: "Couldn't Connect" or "Couldn't Link Device" on Mobile Phone

- **Cause**: Browser agent array mismatch or signal key cache collision.
- **Fix Applied**:
  1. `browser: ['Mac OS', 'Chrome', '124.0.0']` signature applied.
  2. `auth: state` (Direct Disk Multi-File Auth) used to prevent key write lag.
  3. `syncFullHistory: false` applied to prevent handshake timeout.

### Issue: "Waiting for QR code from gateway..."

- **Cause**: Stale credentials stuck in `./auth_info`.
- **Fix**: Click **Generate New QR** on `/admin/whatsapp` page to trigger automatic session wipe and QR regeneration.
