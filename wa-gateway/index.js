'use strict';

const express = require('express');
const makeWASocket = require('@whiskeysockets/baileys').default;
const {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  Browsers,
} = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

// ─── State ───────────────────────────────────────────────────────────────────
let sock = null;
let isConnected = false;
let currentQrBase64 = null;          // Latest QR code as base64 PNG
const messageQueue = [];             // Pending messages when disconnected

const AUTH_DIR = path.join(__dirname, 'auth_info');
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.WA_GATEWAY_API_KEY || 'meals-bowls-secret';

// ─── Logger ──────────────────────────────────────────────────────────────────
const logger = pino({ level: 'silent' });

// ─── API Key Middleware ───────────────────────────────────────────────────────
function requireApiKey(req, res, next) {
  const key = req.headers['x-api-key'] || req.query.apiKey;
  if (key !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

function clearAuthFolder() {
  try {
    if (fs.existsSync(AUTH_DIR)) {
      fs.rmSync(AUTH_DIR, { recursive: true, force: true });
      console.log('[WA-Gateway] Cleared stale auth_info session directory.');
    }
  } catch (err) {
    console.error('[WA-Gateway] Error clearing auth_info:', err.message);
  }
}

// ─── WhatsApp Connection ──────────────────────────────────────────────────────
async function connectToWhatsApp() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
    const { version, isLatest } = await fetchLatestBaileysVersion().catch(() => ({
      version: [2, 3000, 1015901307],
      isLatest: false,
    }));

    console.log(`[WA-Gateway] Initializing socket with WA version: ${version.join('.')} (isLatest: ${isLatest})`);

    sock = makeWASocket({
      version,
      logger,
      auth: state,
      browser: ['Mac OS', 'Chrome', '124.0.0'],
      syncFullHistory: false,
      markOnlineOnConnect: false,
      generateHighQualityLinkPreview: false,
      qrTimeout: 45000,
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: 60000,
      getMessage: async () => ({ conversation: 'Hello' }),
    });

    // Save credentials whenever updated
    sock.ev.on('creds.update', saveCreds);

    // QR Code & Connection Status Event
    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log('[WA-Gateway] New QR code generated successfully.');
        try {
          currentQrBase64 = await QRCode.toDataURL(qr);
          isConnected = false;
        } catch (err) {
          console.error('[WA-Gateway] QRCode generation error:', err.message);
        }
      }

      if (connection === 'close') {
        isConnected = false;
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const reason = lastDisconnect?.error?.message || 'unknown';
        // Only wipe auth session if explicitly logged out from mobile phone
        const isLoggedOut = statusCode === DisconnectReason.loggedOut;
        const shouldReconnect = !isLoggedOut;

        console.log(`[WA-Gateway] Connection closed. Status: ${statusCode}, Reason: ${reason}. Reconnecting: ${shouldReconnect}`);

        if (shouldReconnect) {
          setTimeout(() => connectToWhatsApp(), 3000);
        } else {
          console.log('[WA-Gateway] Explicitly logged out from WhatsApp. Resetting auth_info folder...');
          clearAuthFolder();
          currentQrBase64 = null;
          setTimeout(() => connectToWhatsApp(), 2000);
        }
      }

      if (connection === 'open') {
        isConnected = true;
        currentQrBase64 = null;
        console.log('[WA-Gateway] WhatsApp connected successfully!');

        // Flush queued messages
        if (messageQueue.length > 0) {
          console.log(`[WA-Gateway] Flushing ${messageQueue.length} queued messages...`);
          await flushQueue();
        }
      }
    });

  } catch (err) {
    console.error('[WA-Gateway] Socket initialization error:', err.message);
    clearAuthFolder();
    setTimeout(() => connectToWhatsApp(), 4000);
  }
}

// ─── Queue Flush ──────────────────────────────────────────────────────────────
async function flushQueue() {
  const toSend = [...messageQueue];
  messageQueue.length = 0;

  for (const item of toSend) {
    try {
      await sendWhatsApp(item.to, item.message);
      console.log(`[WA-Gateway] Queued message sent to ${item.to}`);
    } catch (err) {
      console.error(`[WA-Gateway] Failed to send queued msg to ${item.to}:`, err.message);
      messageQueue.push(item); // re-queue on failure
    }
  }
}

// ─── Core Send ────────────────────────────────────────────────────────────────
async function sendWhatsApp(toPhone, message) {
  if (!sock) throw new Error('WhatsApp socket not initialized');
  let num = toPhone.replace(/[^0-9]/g, '');
  if (num.length === 10) num = '91' + num;
  const jid = num + '@s.whatsapp.net';
  await sock.sendMessage(jid, { text: message });
}

// ─── REST API ─────────────────────────────────────────────────────────────────

// GET /status — Returns connection status + QR code if disconnected
app.get('/status', requireApiKey, (req, res) => {
  res.json({
    connected: isConnected,
    qrCode: isConnected ? null : currentQrBase64,
    queueLength: messageQueue.length,
  });
});

// GET /health — Public health check (no API key needed)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', connected: isConnected });
});

// POST /send — Send a WhatsApp message or queue it
app.post('/send', requireApiKey, async (req, res) => {
  const { to, message } = req.body;
  if (!to || !message) {
    return res.status(400).json({ error: 'to and message are required' });
  }

  if (!isConnected) {
    // Queue the message for later
    messageQueue.push({ to, message, queuedAt: new Date().toISOString() });
    console.log(`[WA-Gateway] WA disconnected. Queued message for ${to}. Queue size: ${messageQueue.length}`);
    return res.status(202).json({
      status: 'QUEUED',
      message: 'WhatsApp disconnected. Message queued and will be sent on reconnect.',
      queueLength: messageQueue.length,
    });
  }

  try {
    await sendWhatsApp(to, message);
    console.log(`[WA-Gateway] Message sent to ${to}`);
    res.json({ status: 'SENT', to });
  } catch (err) {
    console.error(`[WA-Gateway] Send error for ${to}:`, err.message);
    // Queue on error too
    messageQueue.push({ to, message, queuedAt: new Date().toISOString() });
    res.status(500).json({
      status: 'QUEUED_ON_ERROR',
      error: err.message,
      queueLength: messageQueue.length,
    });
  }
});

// GET /queue — View queued messages
app.get('/queue', requireApiKey, (req, res) => {
  res.json({ queueLength: messageQueue.length, queue: messageQueue });
});

// POST /flush-queue — Manually trigger queue flush (after reconnect)
app.post('/flush-queue', requireApiKey, async (req, res) => {
  if (!isConnected) {
    return res.status(400).json({ error: 'WhatsApp is not connected. Cannot flush queue.' });
  }
  const count = messageQueue.length;
  await flushQueue();
  res.json({ status: 'FLUSHED', messagesFlushed: count });
});

// POST /reconnect — Clear session and generate fresh QR Code immediately
app.post('/reconnect', requireApiKey, async (req, res) => {
  try {
    if (sock) {
      try { await sock.logout(); } catch (_) {}
      try { sock.end(); } catch (_) {}
    }
  } catch (_) {}

  isConnected = false;
  currentQrBase64 = null;
  clearAuthFolder();

  setTimeout(() => connectToWhatsApp(), 1000);
  res.json({ status: 'RECONNECTING', message: 'Session cleared. Fresh QR code is being generated...' });
});

// POST /logout — Log out and clear session (Admin use only)
app.post('/logout', requireApiKey, async (req, res) => {
  try {
    if (sock) await sock.logout();
  } catch (_) {}
  isConnected = false;
  currentQrBase64 = null;
  clearAuthFolder();
  res.json({ status: 'LOGGED_OUT' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[WA-Gateway] Server running on port ${PORT}`);
  connectToWhatsApp();
});
