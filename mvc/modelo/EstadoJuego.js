var EstadoJuego = {

  puntos: 0,
  vidas:  3,
  nivel:  1,
  record: 0,

  // 'intro' | 'jugando' | 'pausa' | 'golpe' | 'gameover'
  estado: 'intro',

  timerSpawn:   0,
  spawnRate:    75,
  timerNivel:   0,
  invTimer:     0,
  timerDisparo: 0,

  DISPARO_CD:   12,
  FRAMES_NIVEL: 900,

  reiniciar: function() {
    this.puntos       = 0;
    this.vidas        = 3;
    this.nivel        = 1;
    this.timerSpawn   = 0;
    this.spawnRate    = 75;
    this.timerNivel   = 0;
    this.invTimer     = 0;
    this.timerDisparo = 0;
    this.estado       = 'jugando';
  },

  sumarPuntos: function(cantidad) {
    this.puntos += cantidad;
    if (this.puntos > this.record) this.record = this.puntos;
  },

  perderVida: function() {
    this.vidas--;
    this.invTimer = 120;
  },

  subirNivel: function() {
    this.nivel++;
    this.spawnRate = Math.max(28, this.spawnRate - 7);
  }
};
