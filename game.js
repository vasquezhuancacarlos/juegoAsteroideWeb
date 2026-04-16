const canvas  = document.getElementById('gameCanvas'); // Canvas donde se renderiza el juego
const ctx     = canvas.getContext('2d');               // Contexto 2D para dibujar
const W       = canvas.width;                          // Ancho y Alto del canvas
const H       = canvas.height;                        

//  Referencias HUD
const elScore = document.getElementById('h-score'); // Texto de puntaje
const elLevel = document.getElementById('h-level'); // Texto de nivel
const elBest  = document.getElementById('h-best');  // Texto de récord
const elLives = document.getElementById('h-lives'); // Texto de vidas

// Estado global 
let puntos, vidas, nivel, record; // Variables principales del juego
let estado;                       // Estado actual del juego
let invTimer;                     // Tiempo de invulnerabilidad tras golpe
let timerSpawn, spawnRate, timerNivel; // Control de generación y dificultad
let timerDisparo = 0;             // Control de disparo (cooldown)

// Colecciones 
let nave, balas, meteoritos, particulas, stars; // Objetos del juego

const COLORES_METEOR = ['#a0522d', '#8b4513', '#cd853f', '#d2691e']; // Colores meteoritos

// Teclado 
const teclas = {}; // Guarda el estado de cada tecla

document.addEventListener('keydown', function(e) {
  teclas[e.key] = true; 
  if (e.key === ' ') e.preventDefault(); // Evita scroll con espacio

  // Cambia entre pausa y juego
  if ((e.key === 'p' || e.key === 'P') && estado === 'jugando') estado = 'pausa';
  else if ((e.key === 'p' || e.key === 'P') && estado === 'pausa') estado = 'jugando';

  // Inicia o reinicia el juego
  if (e.key === 'Enter' && (estado === 'intro' || estado === 'gameover')) {
    iniciarJuego();
  }
});

document.addEventListener('keyup', function(e) {
  teclas[e.key] = false; // Marca tecla liberada
});

//  Iniciar juego 
function iniciarJuego() {
  puntos       = 0;  // Reinicia puntaje
  vidas        = 3;  
  nivel        = 1;  
  record       = record || 0; // Mantiene récord previo
  timerSpawn   = 0;
  spawnRate    = 80; // Tiempo entre meteoritos
  timerNivel   = 0;
  invTimer     = 0;
  timerDisparo = 0;

  // Posición inicial de la nave en el centro
  nave = {
    x:     W / 2,
    y:     H / 2,
    angulo: -Math.PI / 2  
  };

  balas      = []; // Limpia balas
  meteoritos = []; // Limpia meteoritos
  particulas = []; // Limpia partículas

  crearEstrellas(); // Genera fondo
  actualizarHUD();  // Actualiza interfaz
  estado = 'jugando'; // Cambia a estado activo
}

//  HUD 
function actualizarHUD() {
  // Muestra valores actuales en pantalla
  elScore.textContent = puntos;
  elLevel.textContent = nivel;
  elBest.textContent  = record;
  elLives.textContent = '❤️ '.repeat(vidas).trim() || '💀';
}

//  Estrellas
function crearEstrellas() {
  stars = [];
  for (let i = 0; i < 140; i++) {
    stars.push({
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.3, // tamaño
      a:     0.2 + Math.random() * 0.8, // transparencia
      speed: 0.1 + Math.random() * 0.3 // velocidad de movimiento
    });
  }
}

// Crear meteorito
function crearMeteoritos() {
  const r          = 10 + Math.random() * 24; // Tamaño aleatorio
  const extraSpeed = (nivel - 1) * 0.4;       // Aumenta con nivel

  meteoritos.push({
    x:        r + Math.random() * (W - r * 2),
    y:        -r, 
    r:        r,
    vx:       (Math.random() - 0.5) * 1.5, 
    vy:       1.5 + Math.random() * 2 + extraSpeed, // Caída
    rot:      0,
    rotSpeed: (Math.random() - 0.5) * 0.06,
    color:    COLORES_METEOR[Math.floor(Math.random() * COLORES_METEOR.length)]
  });
}

// Explosión
function explotar(x, y, color, cantidad) {
  cantidad = cantidad || 16;

  // Genera partículas en círculo
  for (let i = 0; i < cantidad; i++) {
    const angulo = (i / cantidad) * Math.PI * 2;
    const speed  = 1.5 + Math.random() * 3;

    particulas.push({
      x:     x,
      y:     y,
      vx:    Math.cos(angulo) * speed,
      vy:    Math.sin(angulo) * speed,
      life:  1.0,
      decay: 0.035 + Math.random() * 0.04,
      r:     1.5 + Math.random() * 2.5,
      color: color
    });
  }
}

// Calcula distancia entre dos objetos (colisiones)
function distancia(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// Actualizar
function actualizar() {
  if (estado !== 'jugando') return; // Solo corre si se está jugando

  // Movimiento de la nave con flechas
  if (teclas['ArrowLeft'])  { nave.x -= 5; nave.angulo = Math.PI; }
  if (teclas['ArrowRight']) { nave.x += 5; nave.angulo = 0; }
  if (teclas['ArrowUp'])    { nave.y -= 5; nave.angulo = -Math.PI / 2; }
  if (teclas['ArrowDown'])  { nave.y += 5; nave.angulo =  Math.PI / 2; }

  // Limita la nave dentro del canvas
  nave.x = Math.max(14, Math.min(W - 14, nave.x));
  nave.y = Math.max(14, Math.min(H - 14, nave.y));

  // Disparo con tiempo de espera
  timerDisparo--;
  if (teclas[' '] && timerDisparo <= 0) {
    balas.push({
      x:  nave.x + Math.cos(nave.angulo) * 20,
      y:  nave.y + Math.sin(nave.angulo) * 20,
      vx: Math.cos(nave.angulo) * 10,
      vy: Math.sin(nave.angulo) * 10
    });
    timerDisparo = 12;
  }

  // Subida de nivel
  timerNivel++;
  if (timerNivel >= 900) {
    timerNivel = 0;
    nivel++;
    spawnRate = Math.max(30, spawnRate - 8);
    actualizarHUD();
  }

  // Genera meteoritos
  timerSpawn++;
  if (timerSpawn >= spawnRate) {
    crearMeteoritos();
    timerSpawn = 0;
  }

  // Movimiento de balas y eliminación fuera de pantalla
  for (let i = balas.length - 1; i >= 0; i--) {
    balas[i].x += balas[i].vx;
    balas[i].y += balas[i].vy;

    if (balas[i].x < -20 || balas[i].x > W + 20 ||
        balas[i].y < -20 || balas[i].y > H + 20) {
      balas.splice(i, 1);
    }
  }

  // Movimiento de estrellas (efecto fondo)
  stars.forEach(function(s) {
    s.y += s.speed;
    if (s.y > H) s.y = 0;
  });

  if (invTimer > 0) invTimer--;

 
 //  Meteoritos y colisiones
  for (let i = meteoritos.length - 1; i >= 0; i--) {
    const m = meteoritos[i];

    // Movimiento del meteorito
    m.x   += m.vx;
    m.y   += m.vy;
    m.rot += m.rotSpeed; // rotación visual

    // Elimina meteorito si sale completamente del canvas
    if (m.y - m.r > H || m.x < -m.r * 2 || m.x > W + m.r * 2) {
      meteoritos.splice(i, 1);
      continue;
    }

    // Colisión bala ↔ meteorito 
    let destruido = false;

    for (let j = balas.length - 1; j >= 0; j--) {
      // Si la distancia es menor que el radio → colisión
      if (distancia(balas[j], m) < m.r + 4) {
        explotar(m.x, m.y, m.color); // efecto visual

        puntos += Math.round(m.r) * nivel; // suma puntos según tamaño
        if (puntos > record) record = puntos;

        meteoritos.splice(i, 1); // elimina meteorito
        balas.splice(j, 1);      // elimina bala
        destruido = true;

        actualizarHUD(); // refresca HUD
        break;
      }
    }

    if (destruido) continue;

    // ── Colisión nave ↔ meteorito ──
    if (invTimer === 0 && distancia(m, nave) < m.r + 12) {
      explotar(m.x, m.y, '#ff4400', 20); // explosión más grande

      meteoritos.splice(i, 1);
      vidas--;
      invTimer = 120; // activa invulnerabilidad temporal

      actualizarHUD();

      if (vidas <= 0) {
        estado = 'golpe'; // estado previo al gameover
        setTimeout(function() { estado = 'gameover'; }, 1500);
      }
      break;
    }
  }

  //  Partículas (efectos de explosión)
  for (let i = particulas.length - 1; i >= 0; i--) {
    const p = particulas[i];

    // Movimiento con ligera gravedad
    p.x    += p.vx;
    p.y    += p.vy;
    p.vy   += 0.06;

    p.life -= p.decay; // reduce vida

    // Elimina cuando desaparece
    if (p.life <= 0) particulas.splice(i, 1);
  }
}

//  Dibujos
function dibujarEstrellas() {
  stars.forEach(function(s) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, ' + s.a + ')';
    ctx.fill();
  });
}

function dibujarNave() {
  // Parpadeo cuando es invulnerable
  if (invTimer > 0 && Math.floor(invTimer / 6) % 2 === 0) return;

  ctx.save();
  ctx.translate(nave.x, nave.y);

  // Rota la nave según dirección
  ctx.rotate(nave.angulo + Math.PI / 2);

  // Motor (efecto de fuego)
  ctx.fillStyle = 'hsl(' + (Math.random() * 20 + 10) + ', 100%, 60%)';
  ctx.beginPath();
  ctx.moveTo(-7, 8);
  ctx.lineTo(0, 22 + Math.random() * 6);
  ctx.lineTo(7, 8);
  ctx.closePath();
  ctx.fill();

  // Cuerpo de la nave
  ctx.fillStyle = '#00ccff';
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(-14, 14);
  ctx.lineTo(0, 6);
  ctx.lineTo(14, 14);
  ctx.closePath();
  ctx.fill();

  // Núcleo central
  ctx.fillStyle = '#e0f8ff';
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.lineTo(-5, 5);
  ctx.lineTo(0, 1);
  ctx.lineTo(5, 5);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function dibujarMeteoritos(m) {
  ctx.save();
  ctx.translate(m.x, m.y);
  ctx.rotate(m.rot);

  ctx.beginPath();

  // Forma irregular del meteorito
  for (let i = 0; i < 8; i++) {
    const angle  = (i / 8) * Math.PI * 2;
    const jitter = 0.72 + Math.sin(i * 3.7) * 0.28;
    const radio  = m.r * jitter;

    if (i === 0)
      ctx.moveTo(Math.cos(angle) * radio, Math.sin(angle) * radio);
    else
      ctx.lineTo(Math.cos(angle) * radio, Math.sin(angle) * radio);
  }

  ctx.closePath();
  ctx.fillStyle = m.color;
  ctx.fill();

  // Borde tenue
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Sombra interna
  ctx.beginPath();
  ctx.arc(-m.r * 0.22, -m.r * 0.18, m.r * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
  ctx.fill();

  ctx.restore();
}

function dibujarBalas() {
  balas.forEach(function(b) {
    ctx.fillStyle   = '#ffff44';
    ctx.shadowBlur  = 8;       // efecto glow
    ctx.shadowColor = '#ffff00';
    ctx.fillRect(b.x - 1.5, b.y - 5, 3, 10);
    ctx.shadowBlur  = 0;
  });
}

function dibujarParticulas() {
  particulas.forEach(function(p) {
    ctx.globalAlpha = p.life; // transparencia según vida
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  });
  ctx.globalAlpha = 1; // reset
}

//  Overlays (pantallas) 
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

// Pantalla inicial
function dibujarIntro() {
  overlay(0.7);
  texto('☄️  METEORITOS', W / 2, H / 2 - 90, 28, '#00ffff');
  texto('Movimiento libre en 4 direcciones', W / 2, H / 2 - 40, 13, '#aaa');
  texto('↑ ↓ ← →   Mover', W / 2, H / 2 - 10, 12, '#666');
  texto('ESPACIO    Disparar', W / 2, H / 2 + 14, 12, '#666');
  texto('P          Pausar', W / 2, H / 2 + 38, 12, '#666');
  texto('[ ENTER para jugar ]', W / 2, H / 2 + 85, 16, '#00ff88');
}

// Pantalla pausa
function dibujarPausa() {
  overlay(0.5);
  texto('⏸  PAUSA', W / 2, H / 2 - 10, 28, '#ffff00');
  texto('Presiona P para continuar', W / 2, H / 2 + 30, 13, '#aaa');
}

// Golpe
function dibujarGolpe() {
  overlay(0.5);
  texto('¡IMPACTO!', W / 2, H / 2, 32, '#ff6600');
}

// Game Over
function dibujarGameOver() {
  overlay(0.75);
  texto('GAME OVER', W / 2, H / 2 - 60, 34, '#ff3333');
  texto('Puntuación: ' + puntos, W / 2, H / 2 - 10, 18, '#fff');
  texto('Récord: ' + record, W / 2, H / 2 + 18, 15, '#00ffff');
  texto('Nivel alcanzado: ' + nivel, W / 2, H / 2 + 44, 14, '#aaa');
  texto('[ ENTER para reiniciar ]', W / 2, H / 2 + 90, 14, '#00ff88');
}

//  Render principal
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

  // Estados del juego
  if (estado === 'intro')    dibujarIntro();
  if (estado === 'pausa')    dibujarPausa();
  if (estado === 'golpe')    dibujarGolpe();
  if (estado === 'gameover') dibujarGameOver();
}

// Loop
function loop() {
  actualizar(); // lógica del juego
  dibujar();    
  requestAnimationFrame(loop); 
}

//  Inicio 
record = 0;
crearEstrellas(); // fondo inicial
estado = 'intro'; // pantalla inicial
loop();           // inicia el ciclo del juego