const ngrok = require('@ngrok/ngrok');

(async () => {
  const listener = await ngrok.forward({
    addr: 3001,
    authtoken: '3Hivtm4UZ4axKi7BKtPER7auPFW_2BDSyW2U9Qu5G3C4gPiRf',
  });

  console.log('');
  console.log('=====================================================');
  console.log('  ngrok Tunnel URL (copy this):');
  console.log('  ' + listener.url());
  console.log('=====================================================');
  console.log('');
  console.log('Paste this URL in Render backend env: WA_GATEWAY_URL');
  console.log('Press Ctrl+C to stop the tunnel.');

  // Keep alive
  await new Promise(() => {});
})();
