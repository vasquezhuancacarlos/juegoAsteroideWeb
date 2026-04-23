var EstadoJuego = {

  // Datos de la partida
  puntos: 0,
  vidas:  3,
  nivel:  1,
  record: 0,   // persiste entre partidas

  // Estado de pantalla: 'intro' | 'jugando' | 'pausa' | 'golpe' | 'gameover'
  estado: 'intro',

  // Temporizadores
  timerSpawn:   0,
  spawnRate:    75,  // frames entre spawns (baja con el nivel)
  timerNivel:   0,
  invTimer:     0,   // frames de invulnerabilidad tras golpe
  timerDisparo: 0,

  // Constantes
  DISPARO_CD:   12,  // cooldown entre disparos en frames
  FRAMES_NIVEL: 900, // frames hasta subir de nivel (~15 seg a 60fps)

  /** Reinicia la partida. El récord NO se reinicia */
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

  /** Suma puntos y actualiza el récord si se supera */
  sumarPuntos: function(cantidad) {
    this.puntos += cantidad;
    if (this.puntos > this.record) this.record = this.puntos;
  },

  /** Resta una vida y activa invulnerabilidad */
  perderVida: function() {
    this.vidas--;
    this.invTimer = 120; // ~2 segundos a 60fps
  },

  /** Sube el nivel y aumenta la dificultad */
  subirNivel: function() {
    this.nivel++;
    this.spawnRate = Math.max(28, this.spawnRate - 7);
  }
};
