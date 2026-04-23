var VistaHUD = {
  elScore: document.getElementById('h-score'),
  elLevel: document.getElementById('h-level'),
  elBest:  document.getElementById('h-best'),
  elLives: document.getElementById('h-lives'),

  /** Sincroniza el HUD con el EstadoJuego actual */
  actualizar: function() {
    this.elScore.textContent = EstadoJuego.puntos;
    this.elLevel.textContent = EstadoJuego.nivel;
    this.elBest.textContent  = EstadoJuego.record;
    this.elLives.textContent = EstadoJuego.vidas > 0
      ? '❤️ '.repeat(EstadoJuego.vidas).trim()
      : '💀';
  }
};
