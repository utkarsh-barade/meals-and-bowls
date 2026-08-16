const { spawn } = require('child_process');
const path = require('path');
const ngrok = require('@ngrok/ngrok');

// 1. Start wa-gateway
console.log('[Runner] Starting wa-gateway server on port 3001...');
const gateway = spawn('node', ['index.js'], {
  cwd: path.join(__dirname, 'wa-gateway'),
  stdio: 'inherit',
});

gateway.on('error', (err) => console.error('[Runner] Gateway error:', err));
gateway.on('exit', (code) => console.log('[Runner] Gateway exited with code:', code));

// 2. Start ngrok tunnel
(async () => {
  try {
    // Wait 2s for gateway server to bind to port 3001
    await new Promise((r) => setTimeout(r, 2000));

    console.log('[Runner] Starting ngrok tunnel on port 3001...');
    const listener = await ngrok.forward({
      addr: 3001,
      authtoken: '3Hivtm4UZ4axKi7BKtPER7auPFW_2BDSyW2U9Qu5G3C4gPiRf',
    });

    console.log('');
    console.log('=====================================================');
    console.log('  NGROK TUNNEL ACTIVE:');
    console.log('  ' + listener.url());
    console.log('=====================================================');
    console.log('');
  } catch (err) {
    console.error('[Runner] ngrok start error:', err);
  }
})();

// Keep process alive
setInterval(() => {}, 60000);
