'use strict';

const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

// ─── State ───────────────────────────────────────────────────────────────────
let client = null;
let isConnected = false;
let currentQrBase64 = null;          // Latest QR code as base64 PNG
const messageQueue = [];             // Pending messages when disconnected

const AUTH_DIR = path.join(__dirname, 'auth_info');
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.WA_GATEWAY_API_KEY || 'meals-bowls-secret';

// ─── API Key Middleware ───────────────────────────────────────────────────────
function requireApiKey(req, res, next) {
  const key = req.headers['x-api-key'] || req.query.apiKey;
  const expectedKey = process.env.WA_GATEWAY_API_KEY || 'meals-bowls-secret';
  if (key && key !== expectedKey && expectedKey !== 'meals-bowls-secret') {
    console.warn(`[WA-Gateway] API Key mismatch! Received: ${key}, Expected: ${expectedKey}`);
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

let isInitializing = false;
let initTimeout = null;

function scheduleInit(delayMs) {
  if (initTimeout) clearTimeout(initTimeout);
  initTimeout = setTimeout(() => {
    initTimeout = null;
    initializeClient();
  }, delayMs);
}

function removeLocks(dir) {
  if (!fs.existsSync(dir)) return;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        removeLocks(fullPath);
      } else if (entry.name.includes('Singleton')) {
        try {
          fs.unlinkSync(fullPath);
          console.log(`[WA-Gateway] Removed stale lock file: ${entry.name}`);
        } catch (_) {}
      }
    }
  } catch (_) {}
}

function clearAuthFolder() {
  try {
    if (fs.existsSync(AUTH_DIR)) {
      fs.rmSync(AUTH_DIR, { recursive: true, force: true });
      console.log('[WA-Gateway] Cleared session directory.');
    }
  } catch (err) {
    console.error('[WA-Gateway] Error clearing session folder:', err.message);
  }
}

// ─── WhatsApp Client Setup ────────────────────────────────────────────────────
async function initializeClient() {
  if (isInitializing) {
    console.log('[WA-Gateway] Initialization already in progress. Skipping.');
    return;
  }
  isInitializing = true;

  if (client) {
    try {
      await client.destroy();
    } catch (_) {}
    client = null;
  }

  // Remove Chrome lock files if left over from previous process/crash
  removeLocks(AUTH_DIR);

  console.log('[WA-Gateway] Initializing whatsapp-web.js Client...');

  const puppeteerOptions = {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
    ],
  };

  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    puppeteerOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  try {
    client = new Client({
      authStrategy: new LocalAuth({ dataPath: AUTH_DIR }),
      puppeteer: puppeteerOptions,
    });

    client.on('qr', async (qr) => {
      console.log('[WA-Gateway] New QR code generated successfully.');
      try {
        currentQrBase64 = await QRCode.toDataURL(qr);
        isConnected = false;
      } catch (err) {
        console.error('[WA-Gateway] QRCode rendering error:', err.message);
      }
    });

    client.on('ready', async () => {
      isConnected = true;
      isInitializing = false;
      currentQrBase64 = null;
      console.log('[WA-Gateway] WhatsApp Web Client is READY!');

      if (messageQueue.length > 0) {
        console.log(`[WA-Gateway] Flushing ${messageQueue.length} queued messages...`);
        await flushQueue();
      }
    });

    client.on('authenticated', () => {
      console.log('[WA-Gateway] Session authenticated successfully.');
    });

    client.on('auth_failure', (msg) => {
      console.error('[WA-Gateway] Auth failure:', msg);
      isConnected = false;
      isInitializing = false;
      currentQrBase64 = null;
      clearAuthFolder();
      scheduleInit(3000);
    });

    client.on('disconnected', (reason) => {
      console.log('[WA-Gateway] Client disconnected:', reason);
      isConnected = false;
      isInitializing = false;
      currentQrBase64 = null;
      scheduleInit(3000);
    });

    await client.initialize();
  } catch (err) {
    console.error('[WA-Gateway] Error initializing client:', err.message);
    isConnected = false;
    isInitializing = false;
    scheduleInit(5000);
  }
}

// ─── Queue Processing ─────────────────────────────────────────────────────────
async function flushQueue() {
  const toSend = [...messageQueue];
  messageQueue.length = 0;

  for (const item of toSend) {
    try {
      await sendWhatsApp(item.to, item.message);
      console.log(`[WA-Gateway] Queued message sent to ${item.to}`);
    } catch (err) {
      console.error(`[WA-Gateway] Failed to send queued msg to ${item.to}:`, err.message);
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
}

// ─── Core Send ────────────────────────────────────────────────────────────────
async function sendWhatsApp(toPhone, message) {
  if (!client || !isConnected) throw new Error('WhatsApp client not ready');

  let num = toPhone.replace(/[^0-9]/g, '');
  if (num.length === 10) num = '91' + num;

  const chatId = num + '@c.us';
  await client.sendMessage(chatId, message);
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
    messageQueue.push({ to, message, queuedAt: new Date().toISOString() });
    console.log(`[WA-Gateway] WA disconnected. Queued message for ${to}. Queue size: ${messageQueue.length}`);
    return res.status(202).json({
      status: 'QUEUED',
      message: 'WhatsApp disconnected. Message queued for reconnect.',
      queueLength: messageQueue.length,
    });
  }

  try {
    await sendWhatsApp(to, message);
    console.log(`[WA-Gateway] Message sent to ${to}`);
    res.json({ status: 'SENT', to });
  } catch (err) {
    console.error(`[WA-Gateway] Send error for ${to}:`, err.message);
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

// POST /flush-queue — Manually trigger queue flush
app.post('/flush-queue', requireApiKey, async (req, res) => {
  if (!isConnected) {
    return res.status(400).json({ error: 'WhatsApp is not connected.' });
  }
  const count = messageQueue.length;
  await flushQueue();
  res.json({ status: 'FLUSHED', messagesFlushed: count });
});

// POST /reconnect — Clear session and restart client
app.post('/reconnect', requireApiKey, async (req, res) => {
  try {
    if (client) await client.destroy();
  } catch (_) {}

  isConnected = false;
  currentQrBase64 = null;
  clearAuthFolder();

  setTimeout(() => initializeClient(), 1000);
  res.json({ status: 'RECONNECTING', message: 'Session cleared. Generating new QR code...' });
});

// POST /logout — Log out and clear session
app.post('/logout', requireApiKey, async (req, res) => {
  try {
    if (client) await client.logout();
  } catch (_) {}
  isConnected = false;
  currentQrBase64 = null;
  clearAuthFolder();
  res.json({ status: 'LOGGED_OUT' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[WA-Gateway] Server running on port ${PORT}`);
  initializeClient();
});
