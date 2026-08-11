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
let isInitializing = false;
let reconnectTimer = null;
let currentQrBase64 = null;
const messageQueue = [];

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

// ─── Auth Folder Cleanup ─────────────────────────────────────────────────────
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

// ─── Socket Cleanup ──────────────────────────────────────────────────────────
function destroySocket() {
  if (sock) {
    try { sock.ev.removeAllListeners(); } catch (_) {}
    try { sock.end(); } catch (_) {}
    try { sock.ws?.close(); } catch (_) {}
    sock = null;
  }
}

// ─── Schedule Reconnect (debounced) ──────────────────────────────────────────
function scheduleReconnect(delayMs) {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connectToWhatsApp();
  }, delayMs);
}

// ─── Phone Number Formatter ───────────────────────────────────────────────────
function formatPhoneNumber(toPhone) {
  let num = toPhone.replace(/[^0-9]/g, '');
  if (num.startsWith('91') && num.length === 12) return num;
  if (num.length === 10) return '91' + num;
  return num;
}

// ─── WhatsApp Connection ──────────────────────────────────────────────────────
async function connectToWhatsApp() {
  if (isInitializing) {
    console.log('[WA-Gateway] Connection already in progress. Skipping.');
    return;
  }

  // Clean up any previous socket before creating a new one
  destroySocket();

  isInitializing = true;
  isConnected = false;

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
      browser: Browsers.ubuntu('Chrome'),
      syncFullHistory: false,
      markOnlineOnConnect: false,
      generateHighQualityLinkPreview: false,
      qrTimeout: 60000,
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: 60000,
      getMessage: async () => ({ conversation: 'Hello' }),
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        isInitializing = false;
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
        isInitializing = false;
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const reason = lastDisconnect?.error?.output?.payload?.message || 'unknown';
        const isLoggedOut = statusCode === DisconnectReason.loggedOut || statusCode === 401;

        console.log('=== [WA-Gateway] DISCONNECT DETAILS ===');
        console.log('  Status Code :', statusCode);
        console.log('  Reason      :', reason);
        console.log('  Is LoggedOut:', isLoggedOut);
        console.log('========================================');

        destroySocket();

        if (isLoggedOut) {
          console.log('[WA-Gateway] Logged out. Clearing session and restarting...');
          clearAuthFolder();
          currentQrBase64 = null;
          scheduleReconnect(3000);
        } else if (statusCode === 428) {
          // QR expired without scan — wait longer before generating new QR
          console.log('[WA-Gateway] QR expired (no scan). Waiting 15s before new QR...');
          scheduleReconnect(15000);
        } else if (statusCode === 440) {
          // Conflict (two sessions) — wait longer and clear session
          console.log('[WA-Gateway] Session conflict (440). Clearing auth and waiting 10s...');
          clearAuthFolder();
          currentQrBase64 = null;
          scheduleReconnect(10000);
        } else {
          // Generic drop — reconnect after 5s
          scheduleReconnect(5000);
        }
      }

      if (connection === 'open') {
        isConnected = true;
        isInitializing = false;
        currentQrBase64 = null;
        console.log('[WA-Gateway] WhatsApp connected successfully!');

        if (messageQueue.length > 0) {
          console.log(`[WA-Gateway] Flushing ${messageQueue.length} queued messages...`);
          await flushQueue();
        }
      }
    });

  } catch (err) {
    console.error('[WA-Gateway] Initialization error:', err.message);
    isConnected = false;
    isInitializing = false;
    destroySocket();
    scheduleReconnect(5000);
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
      console.error(`[WA-Gateway] Failed queued msg to ${item.to}:`, err.message);
      messageQueue.push(item);
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
}

// ─── Core Send ────────────────────────────────────────────────────────────────
async function sendWhatsApp(toPhone, message) {
  if (!sock || !isConnected) throw new Error('WhatsApp socket not ready');
  const num = formatPhoneNumber(toPhone);
  const jid = num + '@s.whatsapp.net';
  console.log(`[WA-Gateway] Sending to JID: ${jid}`);
  await sock.sendMessage(jid, { text: message });
}

// ─── REST API ─────────────────────────────────────────────────────────────────

app.get('/status', requireApiKey, (req, res) => {
  res.json({
    connected: isConnected,
    qrCode: isConnected ? null : currentQrBase64,
    queueLength: messageQueue.length,
  });
});

app.all('/health', (req, res) => {
  res.json({ status: 'ok', connected: isConnected });
});

app.post('/send', requireApiKey, async (req, res) => {
  const { to, message } = req.body;
  if (!to || !message) {
    return res.status(400).json({ error: 'to and message are required' });
  }

  if (!isConnected) {
    messageQueue.push({ to, message, queuedAt: new Date().toISOString() });
    return res.status(202).json({
      status: 'QUEUED',
      message: 'WhatsApp disconnected. Message queued.',
      queueLength: messageQueue.length,
    });
  }

  try {
    await sendWhatsApp(to, message);
    res.json({ status: 'SENT', to });
  } catch (err) {
    messageQueue.push({ to, message, queuedAt: new Date().toISOString() });
    res.status(500).json({ status: 'QUEUED_ON_ERROR', error: err.message });
  }
});

app.get('/queue', requireApiKey, (req, res) => {
  res.json({ queueLength: messageQueue.length, queue: messageQueue });
});

app.post('/flush-queue', requireApiKey, async (req, res) => {
  if (!isConnected) return res.status(400).json({ error: 'Not connected.' });
  const count = messageQueue.length;
  await flushQueue();
  res.json({ status: 'FLUSHED', messagesFlushed: count });
});

app.post('/reconnect', requireApiKey, async (req, res) => {
  console.log('[WA-Gateway] Manual reconnect triggered.');
  isInitializing = false;
  isConnected = false;
  currentQrBase64 = null;
  if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
  destroySocket();
  clearAuthFolder();
  setTimeout(() => connectToWhatsApp(), 1000);
  res.json({ status: 'RECONNECTING', message: 'Session cleared. Fresh QR incoming...' });
});

app.post('/logout', requireApiKey, async (req, res) => {
  try { if (sock) await sock.logout(); } catch (_) {}
  isConnected = false;
  currentQrBase64 = null;
  destroySocket();
  clearAuthFolder();
  res.json({ status: 'LOGGED_OUT' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[WA-Gateway] Server running on port ${PORT}`);
  connectToWhatsApp();
});
