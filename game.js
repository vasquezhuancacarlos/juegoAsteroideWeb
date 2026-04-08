const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Dibujar fondo
ctx.fillStyle = '#000010';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Estrellas con brillo variado
for (let i = 0; i < 120; i++) {
  const x     = Math.random() * canvas.width;
  const y     = Math.random() * canvas.height;
  const r     = Math.random() * 1.2;
  const alpha = 0.3 + Math.random() * 0.7;

  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
  ctx.fill();
}

// Vista previa de la nave
ctx.save();
ctx.translate(240, 500);
ctx.fillStyle = '#00ccff';
ctx.beginPath();
ctx.moveTo(0, -22);
ctx.lineTo(-14, 14);
ctx.lineTo(0, 6);
ctx.lineTo(14, 14);
ctx.closePath();
ctx.fill();
ctx.restore();

// Vista previa de meteoritos
function dibujarMeteoritoPreview(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = '#a0522d';
  ctx.fill();
  ctx.strokeStyle = '#cd853f';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

dibujarMeteoritoPreview(100, 120, 28);
dibujarMeteoritoPreview(300, 200, 18);
dibujarMeteoritoPreview(180, 80, 14);