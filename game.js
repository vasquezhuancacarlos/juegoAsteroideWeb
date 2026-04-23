const canvas  = document.getElementById('gameCanvas');
const ctx     = canvas.getContext('2d');
const W       = canvas.width;
const H       = canvas.height;

// Referencias HUD
const elScore = document.getElementById('h-score');
const elLevel = document.getElementById('h-level');
const elBest  = document.getElementById('h-best');
const elLives = document.getElementById('h-lives');

// Estado global
let puntos, vidas, nivel, record;
let estado;
let invTimer;
let timerSpawn, spawnRate, timerNivel;
let timerDisparo = 0;

// Colecciones
let nave, balas, meteoritos, particulas, stars;

const COLORES_METEOR = ['#a0522d', '#8b4513', '#cd853f', '#d2691e', '#b8860b'];

//Teclado
const teclas = {};

document.addEventListener('keydown', function(e) {
  teclas[e.key] = true;
  if (e.key === ' ') e.preventDefault();

  if ((e.key === 'p' || e.key === 'P') && estado === 'jugando') estado = 'pausa';
  else if ((e.key === 'p' || e.key === 'P') && estado === 'pausa') estado = 'jugando';

  if (e.key === 'Enter' && (estado === 'intro' || estado === 'gameover')) {
    iniciarJuego();
  }
});

document.addEventListener('keyup', function(e) {
  teclas[e.key] = false;
});

// Iniciar juego
function iniciarJuego() {
  puntos       = 0;
  vidas        = 3;
  nivel        = 1;
  record       = record || 0;
  timerSpawn   = 0;
  spawnRate    = 75;
  timerNivel   = 0;
  invTimer     = 0;
  timerDisparo = 0;

  nave = {
    x:      W / 2,
    y:      H / 2,
    angulo: -Math.PI / 2,   // apunta arriba
    vx:     0,              // velocidad acumulada (inercia)
    vy:     0
  };

  balas      = [];
  meteoritos = [];
  particulas = [];

  crearEstrellas();
  actualizarHUD();
  estado = 'jugando';
}

//HUD
function actualizarHUD() {
  elScore.textContent = puntos;
  elLevel.textContent = nivel;
  elBest.textContent  = record;
  elLives.textContent = '❤️ '.repeat(vidas).trim() || '💀';
}

// Estrellas con parallax 
function crearEstrellas() {
  stars = [];
  for (let i = 0; i < 150; i++) {
    stars.push({
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.4,
      a:     0.15 + Math.random() * 0.85,
      capa:  Math.random()   // 0 = lenta, 1 = rápida (para parallax)
    });
  }
}

// Crear meteorito desde cualquier borde 
function crearMeteoritos() {
  const r          = 10 + Math.random() * 26;
  const extraSpeed = (nivel - 1) * 0.35;
  const velocidad  = 1.4 + Math.random() * 2 + extraSpeed;

  // Elegir borde de aparición: 0=arriba, 1=abajo, 2=izquierda, 3=derecha
  const borde = Math.floor(Math.random() * 4);
  let mx, my;

  if (borde === 0) { mx = r + Math.random() * (W - r * 2); my = -r; }
  if (borde === 1) { mx = r + Math.random() * (W - r * 2); my = H + r; }
  if (borde === 2) { mx = -r;     my = r + Math.random() * (H - r * 2); }
  if (borde === 3) { mx = W + r;  my = r + Math.random() * (H - r * 2); }

  // Dirección: apunta al centro con variación aleatoria
  const destinoX = W / 2 + (Math.random() - 0.5) * W * 0.6;
  const destinoY = H / 2 + (Math.random() - 0.5) * H * 0.6;
  const angulo   = Math.atan2(destinoY - my, destinoX - mx) + (Math.random() - 0.5) * 0.8;

  meteoritos.push({
    x:        mx,
    y:        my,
    r:        r,
    vx:       Math.cos(angulo) * velocidad,
    vy:       Math.sin(angulo) * velocidad,
    rot:      0,
    rotSpeed: (Math.random() - 0.5) * 0.07,
    color:    COLORES_METEOR[Math.floor(Math.random() * COLORES_METEOR.length)]
  });
}

//  Explotar
function explotar(x, y, color, cantidad) {
  cantidad = cantidad || 18;
  for (let i = 0; i < cantidad; i++) {
    const angulo = (i / cantidad) * Math.PI * 2;
    const speed  = 1.5 + Math.random() * 3.5;
    particulas.push({
      x:     x,
      y:     y,
      vx:    Math.cos(angulo) * speed,
      vy:    Math.sin(angulo) * speed,
      life:  1.0,
      decay: 0.03 + Math.random() * 0.04,
      r:     1.5 + Math.random() * 3,
      color: color
    });
  }
}

function distancia(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// Actualizar 
function actualizar() {
  if (estado !== 'jugando') return;

  // Movimiento con INERCIA SUAVE 
  const aceleracion = 0.9;
  const friccion    = 0.82;
  const maxSpeed    = 5;

  if (teclas['ArrowLeft'])  nave.vx -= aceleracion;
  if (teclas['ArrowRight']) nave.vx += aceleracion;
  if (teclas['ArrowUp'])    nave.vy -= aceleracion;
  if (teclas['ArrowDown'])  nave.vy += aceleracion;

  // Limitar velocidad máxima
  const speed = Math.hypot(nave.vx, nave.vy);
  if (speed > maxSpeed) {
    nave.vx = (nave.vx / speed) * maxSpeed;
    nave.vy = (nave.vy / speed) * maxSpeed;
  }

  // Aplicar fricción
  nave.vx *= friccion;
  nave.vy *= friccion;

  nave.x += nave.vx;
  nave.y += nave.vy;

  // Rebotar en los bordes 
  if (nave.x < 14)     { nave.x = 14;     nave.vx *= -0.5; }
  if (nave.x > W - 14) { nave.x = W - 14; nave.vx *= -0.5; }
  if (nave.y < 14)     { nave.y = 14;     nave.vy *= -0.5; }
  if (nave.y > H - 14) { nave.y = H - 14; nave.vy *= -0.5; }

  //  Rotación suave hacia la dirección de movimiento 
  if (Math.hypot(nave.vx, nave.vy) > 0.3) {
    const anguloDestino = Math.atan2(nave.vy, nave.vx);
    let diff = anguloDestino - nave.angulo;
    while (diff >  Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    nave.angulo += diff * 0.18;
  }

  // Disparar en la dirección que apunta la nave
  timerDisparo--;
  if (teclas[' '] && timerDisparo <= 0) {
    balas.push({
      x:  nave.x + Math.cos(nave.angulo) * 20,
      y:  nave.y + Math.sin(nave.angulo) * 20,
      vx: Math.cos(nave.angulo) * 11,
      vy: Math.sin(nave.angulo) * 11
    });
    timerDisparo = 12;
  }

  // Nivel
  timerNivel++;
  if (timerNivel >= 900) {
    timerNivel = 0;
    nivel++;
    spawnRate = Math.max(28, spawnRate - 7);
    actualizarHUD();
  }

  // Spawn
  timerSpawn++;
  if (timerSpawn >= spawnRate) {
    crearMeteoritos();
    timerSpawn = 0;
  }

  // Balas
  for (let i = balas.length - 1; i >= 0; i--) {
    balas[i].x += balas[i].vx;
    balas[i].y += balas[i].vy;
    if (balas[i].x < -30 || balas[i].x > W + 30 ||
        balas[i].y < -30 || balas[i].y > H + 30) {
      balas.splice(i, 1);
    }
  }

  // Estrellas con efecto parallax (se mueven al revés que la nave) 
  stars.forEach(function(s) {
    s.x -= nave.vx * s.capa * 0.15;
    s.y -= nave.vy * s.capa * 0.15;
    if (s.x < 0) s.x += W;
    if (s.x > W) s.x -= W;
    if (s.y < 0) s.y += H;
    if (s.y > H) s.y -= H;
  });

  if (invTimer > 0) invTimer--;

  // Meteoritos
  for (let i = meteoritos.length - 1; i >= 0; i--) {
    const m = meteoritos[i];
    m.x   += m.vx;
    m.y   += m.vy;
    m.rot += m.rotSpeed;

    // Eliminar si sale muy lejos del canvas (por cualquier lado)
    if (m.x < -m.r * 3 || m.x > W + m.r * 3 ||
        m.y < -m.r * 3 || m.y > H + m.r * 3) {
      meteoritos.splice(i, 1);
      continue;
    }

    // Colision bala ↔ meteorito
    let destruido = false;
    for (let j = balas.length - 1; j >= 0; j--) {
      if (distancia(balas[j], m) < m.r + 4) {
        explotar(m.x, m.y, m.color);
        puntos += Math.round(m.r) * nivel;
        if (puntos > record) record = puntos;
        meteoritos.splice(i, 1);
        balas.splice(j, 1);
        destruido = true;
        actualizarHUD();
        break;
      }
    }
    if (destruido) continue;

    // Colision nave ↔ meteorito
    if (invTimer === 0 && distancia(m, nave) < m.r + 12) {
      explotar(m.x, m.y, '#ff4400', 22);
      meteoritos.splice(i, 1);
      vidas--;
      invTimer = 120;
      actualizarHUD();
      if (vidas <= 0) {
        estado = 'golpe';
        setTimeout(function() { estado = 'gameover'; }, 1500);
      }
      break;
    }
  }

  // Particulas
  for (let i = particulas.length - 1; i >= 0; i--) {
    const p = particulas[i];
    p.x    += p.vx;
    p.y    += p.vy;
    p.vy   += 0.05;
    p.life -= p.decay;
    if (p.life <= 0) particulas.splice(i, 1);
  }
}

// Dibujos 
function dibujarEstrellas() {
  stars.forEach(function(s) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, ' + s.a + ')';
    ctx.fill();
  });
}

function dibujarNave() {
  if (invTimer > 0 && Math.floor(invTimer / 6) % 2 === 0) return;

  ctx.save();
  ctx.translate(nave.x, nave.y);
  ctx.rotate(nave.angulo + Math.PI / 2);

  // Llamarada del motor
  const largoLlama = 14 + Math.random() * 8;
  ctx.fillStyle = 'hsl(' + (Math.random() * 20 + 10) + ', 100%, 55%)';
  ctx.beginPath();
  ctx.moveTo(-7, 8);
  ctx.lineTo(0, 8 + largoLlama);
  ctx.lineTo(7, 8);
  ctx.closePath();
  ctx.fill();

  // Cuerpo
  ctx.fillStyle = '#00ccff';
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(-14, 14);
  ctx.lineTo(0, 6);
  ctx.lineTo(14, 14);
  ctx.closePath();
  ctx.fill();

  // Borde brillante
  ctx.strokeStyle = 'rgba(100, 220, 255, 0.5)';
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(-14, 14);
  ctx.lineTo(0, 6);
  ctx.lineTo(14, 14);
  ctx.closePath();
  ctx.stroke();

  // Núcleo
  ctx.fillStyle = '#e8f8ff';
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.lineTo(-5, 5);
  ctx.lineTo(0, 1);
  ctx.lineTo(5, 5);
  ctx.closePath();
  ctx.fill();

  // Ventanilla (cabina)
  ctx.beginPath();
  ctx.arc(0, -5, 4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 200, 255, 0.4)';
  ctx.fill();

  ctx.restore();
}

function dibujarMeteoritos(m) {
  ctx.save();
  ctx.translate(m.x, m.y);
  ctx.rotate(m.rot);

  // Sombra
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle  = (i / 8) * Math.PI * 2;
    const jitter = 0.72 + Math.sin(i * 3.7) * 0.28;
    const radio  = m.r * jitter;
    if (i === 0) ctx.moveTo(Math.cos(angle) * radio + 2, Math.sin(angle) * radio + 2);
    else         ctx.lineTo(Math.cos(angle) * radio + 2, Math.sin(angle) * radio + 2);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fill();

  // Roca principal
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle  = (i / 8) * Math.PI * 2;
    const jitter = 0.72 + Math.sin(i * 3.7) * 0.28;
    const radio  = m.r * jitter;
    if (i === 0) ctx.moveTo(Math.cos(angle) * radio, Math.sin(angle) * radio);
    else         ctx.lineTo(Math.cos(angle) * radio, Math.sin(angle) * radio);
  }
  ctx.closePath();
  ctx.fillStyle = m.color;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth   = 1;
  ctx.stroke();

  // Cráteres
  ctx.beginPath();
  ctx.arc(-m.r * 0.22, -m.r * 0.18, m.r * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(m.r * 0.3, m.r * 0.25, m.r * 0.14, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fill();

  ctx.restore();
}

function dibujarBalas() {
  balas.forEach(function(b) {
    // Bala orientada en su dirección de vuelo
    const anguloBala = Math.atan2(b.vy, b.vx);
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(anguloBala);
    ctx.fillStyle   = '#ffff44';
    ctx.shadowBlur  = 8;
    ctx.shadowColor = '#ffff00';
    ctx.fillRect(-5, -2, 10, 4);
    ctx.shadowBlur  = 0;
    ctx.restore();
  });
}

function dibujarParticulas() {
  particulas.forEach(function(p) {
    ctx.globalAlpha = p.life;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

// Overlays 
function overlay(alpha) {
  ctx.fillStyle = 'rgba(0, 0, 0, ' + alpha + ')';
  ctx.fillRect(0, 0, W, H);
}

function texto(t, x, y, sz, color, alineacion) {
  alineacion = alineacion || 'center';
  ctx.font      = sz + 'px Courier New';
  ctx.fillStyle = color;
  ctx.textAlign = alineacion;
  ctx.fillText(t, x, y);
}

function dibujarIntro() {
  overlay(0.72);
  texto('☄️  METEORITOS',                        W / 2, H / 2 - 100, 28, '#00ffff');
  texto('Movimiento libre — meteoritos por todos lados', W / 2, H / 2 - 55, 13, '#aaa');
  texto('─────────────────────────',              W / 2, H / 2 - 28, 11, '#333');
  texto('↑ ↓ ← →   Mover (con inercia)',          W / 2, H / 2 - 5,  12, '#666');
  texto('ESPACIO    Disparar hacia donde apuntas', W / 2, H / 2 + 18, 12, '#666');
  texto('P          Pausar',                      W / 2, H / 2 + 41, 12, '#666');
  texto('─────────────────────────',              W / 2, H / 2 + 58, 11, '#333');
  texto('[ ENTER para jugar ]',                   W / 2, H / 2 + 95, 16, '#00ff88');
}

function dibujarPausa() {
  overlay(0.5);
  texto('⏸  PAUSA',                 W / 2, H / 2 - 10, 28, '#ffff00');
  texto('Presiona P para continuar', W / 2, H / 2 + 30, 13, '#aaa');
}

function dibujarGolpe() {
  overlay(0.5);
  texto('¡IMPACTO!', W / 2, H / 2, 32, '#ff6600');
}

function dibujarGameOver() {
  overlay(0.75);
  texto('GAME OVER',                  W / 2, H / 2 - 65, 34, '#ff3333');
  texto('Puntuación: ' + puntos,      W / 2, H / 2 - 12, 18, '#fff');
  texto('Récord: ' + record,          W / 2, H / 2 + 16, 15, '#00ffff');
  texto('Nivel alcanzado: ' + nivel,  W / 2, H / 2 + 42, 14, '#aaa');
  texto('[ ENTER para reiniciar ]',   W / 2, H / 2 + 90, 14, '#00ff88');
}

// ─── Dibujar 
function dibujar() {
  ctx.fillStyle = '#000010';
  ctx.fillRect(0, 0, W, H);

  dibujarEstrellas();

  if (estado !== 'intro') {
    dibujarBalas();
    meteoritos.forEach(dibujarMeteoritos);
    dibujarParticulas();
    dibujarNave();
  }

  if (estado === 'intro')    dibujarIntro();
  if (estado === 'pausa')    dibujarPausa();
  if (estado === 'golpe')    dibujarGolpe();
  if (estado === 'gameover') dibujarGameOver();
}

// ─── Loop 
function loop() {
  actualizar();
  dibujar();
  requestAnimationFrame(loop);
}

// ─── Inicio 
record = 0;
crearEstrellas();
estado = 'intro';
loop();
