var Nave = {

  //Posición y velocidad
  x:      240,
  y:      300,
  vx:     0,
  vy:     0,
  angulo: -Math.PI / 2,

  //Constantes
  ACELERACION:    0.9,
  FRICCION:       0.82,
  MAX_SPEED:      5,
  RADIO_COLISION: 12,
  DISPARO_CD:     12,

  //Reiniciar
  reiniciar: function(canvasW, canvasH) {
    this.x      = canvasW / 2;
    this.y      = canvasH / 2;
    this.vx     = 0;
    this.vy     = 0;
    this.angulo = -Math.PI / 2;
  },

  //Movimiento
  mover: function(teclas, canvasW, canvasH) {
    if (teclas['ArrowLeft'])  this.vx -= this.ACELERACION;
    if (teclas['ArrowRight']) this.vx += this.ACELERACION;
    if (teclas['ArrowUp'])    this.vy -= this.ACELERACION;
    if (teclas['ArrowDown'])  this.vy += this.ACELERACION;

    // Limitar velocidad máxima
    var speed = Math.hypot(this.vx, this.vy);
    if (speed > this.MAX_SPEED) {
      this.vx = (this.vx / speed) * this.MAX_SPEED;
      this.vy = (this.vy / speed) * this.MAX_SPEED;
    }

    // Fricción
    this.vx *= this.FRICCION;
    this.vy *= this.FRICCION;

    // Aplicar movimiento
    this.x += this.vx;
    this.y += this.vy;

    // Rebotar en bordes
    if (this.x < 14)           { this.x = 14;           this.vx *= -0.5; }
    if (this.x > canvasW - 14) { this.x = canvasW - 14; this.vx *= -0.5; }
    if (this.y < 14)           { this.y = 14;            this.vy *= -0.5; }
    if (this.y > canvasH - 14) { this.y = canvasH - 14;  this.vy *= -0.5; }

    // Rotación suave hacia la dirección de movimiento
    if (Math.hypot(this.vx, this.vy) > 0.3) {
      var anguloDestino = Math.atan2(this.vy, this.vx);
      var diff = anguloDestino - this.angulo;
      while (diff >  Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      this.angulo += diff * 0.18;
    }
  },

  //Disparar
  disparar: function(teclas) {
    EstadoJuego.timerDisparo--;
    if (teclas[' '] && EstadoJuego.timerDisparo <= 0) {
      ModeloBalas.crear(this.x, this.y, this.angulo);
      EstadoJuego.timerDisparo = this.DISPARO_CD;
    }
  },

  // Dibujar
  dibujar: function(ctx) {
    // Parpadeo durante invulnerabilidad
    if (EstadoJuego.invTimer > 0 && Math.floor(EstadoJuego.invTimer / 6) % 2 === 0) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angulo + Math.PI / 2);

    // Llamarada del motor
    var largoLlama = 14 + Math.random() * 8;
    ctx.fillStyle = 'hsl(' + (Math.random() * 20 + 10) + ', 100%, 55%)';
    ctx.beginPath();
    ctx.moveTo(-7, 8); ctx.lineTo(0, 8 + largoLlama); ctx.lineTo(7, 8);
    ctx.closePath(); ctx.fill();

    // Cuerpo principal
    ctx.fillStyle = '#00ccff';
    ctx.beginPath();
    ctx.moveTo(0, -18); ctx.lineTo(-14, 14); ctx.lineTo(0, 6); ctx.lineTo(14, 14);
    ctx.closePath(); ctx.fill();

    // Borde brillante
    ctx.strokeStyle = 'rgba(100, 220, 255, 0.5)';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(0, -18); ctx.lineTo(-14, 14); ctx.lineTo(0, 6); ctx.lineTo(14, 14);
    ctx.closePath(); ctx.stroke();

    // Núcleo interior
    ctx.fillStyle = '#e8f8ff';
    ctx.beginPath();
    ctx.moveTo(0, -10); ctx.lineTo(-5, 5); ctx.lineTo(0, 1); ctx.lineTo(5, 5);
    ctx.closePath(); ctx.fill();

    // Ventanilla
    ctx.beginPath();
    ctx.arc(0, -5, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 200, 255, 0.4)';
    ctx.fill();

    ctx.restore();
  }

};

