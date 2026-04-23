var Nave = {
  x:      240,
  y:      300,
  vx:     0,            // velocidad horizontal acumulada (inercia)
  vy:     0,            // velocidad vertical acumulada
  angulo: -Math.PI / 2, // dirección en radianes (-π/2 = apunta arriba)

  // Constantes de física
  ACELERACION:     0.9,
  FRICCION:        0.82,
  MAX_SPEED:       5,
  RADIO_COLISION:  12,  // radio del círculo de colisión

  /** Reinicia la nave al centro del canvas al empezar una partida */
  reiniciar: function(canvasW, canvasH) {
    this.x      = canvasW / 2;
    this.y      = canvasH / 2;
    this.vx     = 0;
    this.vy     = 0;
    this.angulo = -Math.PI / 2;
  }
};
