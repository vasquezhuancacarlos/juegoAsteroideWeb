var ControladorNave = {

  actualizar: function(W, H) {

    // ── Aceleración según teclas ─────────────────────────────────────────
    if (ControladorTeclado.estaPresionada('ArrowLeft'))  Nave.vx -= Nave.ACELERACION;
    if (ControladorTeclado.estaPresionada('ArrowRight')) Nave.vx += Nave.ACELERACION;
    if (ControladorTeclado.estaPresionada('ArrowUp'))    Nave.vy -= Nave.ACELERACION;
    if (ControladorTeclado.estaPresionada('ArrowDown'))  Nave.vy += Nave.ACELERACION;

    // ── Limitar velocidad máxima ─────────────────────────────────────────
    var speed = Math.hypot(Nave.vx, Nave.vy);
    if (speed > Nave.MAX_SPEED) {
      Nave.vx = (Nave.vx / speed) * Nave.MAX_SPEED;
      Nave.vy = (Nave.vy / speed) * Nave.MAX_SPEED;
    }

    // ── Fricción (desacelera al soltar teclas) ───────────────────────────
    Nave.vx *= Nave.FRICCION;
    Nave.vy *= Nave.FRICCION;

    // ── Aplicar movimiento ───────────────────────────────────────────────
    Nave.x += Nave.vx;
    Nave.y += Nave.vy;

    // ── Rebotar en bordes ────────────────────────────────────────────────
    if (Nave.x < 14)     { Nave.x = 14;     Nave.vx *= -0.5; }
    if (Nave.x > W - 14) { Nave.x = W - 14; Nave.vx *= -0.5; }
    if (Nave.y < 14)     { Nave.y = 14;     Nave.vy *= -0.5; }
    if (Nave.y > H - 14) { Nave.y = H - 14; Nave.vy *= -0.5; }

    // ── Rotación suave hacia la dirección de movimiento ──────────────────
    if (Math.hypot(Nave.vx, Nave.vy) > 0.3) {
      var anguloDestino = Math.atan2(Nave.vy, Nave.vx);
      var diff = anguloDestino - Nave.angulo;
      // Normalizar al rango [-π, π] para girar por el camino más corto
      while (diff >  Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      Nave.angulo += diff * 0.18;
    }

    // ── Disparar ─────────────────────────────────────────────────────────
    EstadoJuego.timerDisparo--;
    if (ControladorTeclado.estaPresionada(' ') && EstadoJuego.timerDisparo <= 0) {
      ModeloBalas.crear(Nave.x, Nave.y, Nave.angulo);
      EstadoJuego.timerDisparo = EstadoJuego.DISPARO_CD;
    }
  }
};
