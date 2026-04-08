const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Fondo base
ctx.fillStyle = '#111';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Estrellas aleatorias simples
for (let i = 0; i < 80; i++) {
  ctx.fillStyle = 'white';
  ctx.fillRect(
    Math.random() * canvas.width,
    Math.random() * canvas.height,
    1,
    1
  );
}

// Texto de confirmacion
ctx.fillStyle = '#00ffff';
ctx.font = '18px Arial';
ctx.textAlign = 'center';
ctx.fillText('', canvas.width / 2, canvas.height / 2);
