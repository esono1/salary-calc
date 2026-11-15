const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.setContent('<canvas id=c></canvas>');
  for (const [size, name, mask] of [[512, 'icon-512.png', 0], [192, 'icon-192.png', 0], [180, 'icon-180.png', 0], [512, 'icon-maskable-512.png', 1]]) {
    const data = await p.evaluate(([S, mask]) => {
      const c = document.getElementById('c'); c.width = c.height = S; const g = c.getContext('2d');
      g.fillStyle = '#2a1d24'; g.fillRect(0, 0, S, S);
      const k = mask ? 0.78 : 1, cx = S / 2, cy = S / 2;
      // layered fan: superficial (pale) to deep (plum)
      const cols = ['#4b2454', '#78305d', '#a7435f', '#cf625a', '#e8946b', '#edb27c'];
      cols.forEach((col, i) => {
        const r = S * k * (0.40 - i * 0.052);
        g.beginPath(); g.ellipse(cx, cy + S * k * 0.02, r * 0.72, r, 0, 0, Math.PI * 2);
        g.fillStyle = col; g.fill();
      });
      // fibre lines on top layer
      g.strokeStyle = 'rgba(255,240,225,.55)'; g.lineWidth = S * 0.012; g.lineCap = 'round';
      for (let i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(cx + i * S * k * 0.035, cy - S * k * 0.1); g.quadraticCurveTo(cx + i * S * k * 0.05, cy, cx + i * S * k * 0.035, cy + S * k * 0.12); g.stroke(); }
      return c.toDataURL('image/png').split(',')[1];
    }, [size, mask]);
    fs.writeFileSync('out/app/' + name, Buffer.from(data, 'base64'));
  }
  await b.close();
})();
