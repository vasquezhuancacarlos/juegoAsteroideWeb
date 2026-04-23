var ControladorJuego = {

  canvas: null,
  ctx:    null,
  W:      480,
  H:      600,

  /** Punto de entrada. Se llama una sola vez al cargar la página */
  iniciar: function() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx    = this.canvas.getContext('2d');

    ControladorTeclado.iniciar();          
    ModeloEstrellas.generar(this.W, this.H); 
    VistaHUD.actualizar();                 

    this._loop();
  },

  /** Reinicia todos los modelos y empieza una partida nueva */
  iniciarPartida: function() {
    EstadoJuego.reiniciar();
    Nave.reiniciar(this.W, this.H);
    ModeloMeteoritos.reiniciar();
    ModeloBalas.reiniciar();
    ModeloParticulas.reiniciar();
    ModeloEstrellas.generar(this.W, this.H);
    VistaHUD.actualizar();
  },

  /** Loop principal: ~60 veces por segundo */
  _loop: function() {
    var self = this;

    // 1. ACTUALIZAR — solo si el juego está activo
    if (EstadoJuego.estado === 'jugando') {
      ControladorNave.actualizar(self.W, self.H);
      ControladorMeteoritos.actualizar(self.W, self.H);
      ControladorColisiones.actualizar();
    }

    self._dibujar();
    requestAnimationFrame(function() { self._loop(); });
  },

  /** Dibuja todos los elementos en el orden correcto */
  _dibujar: function() {
    var ctx = this.ctx;
    var W   = this.W;
    var H   = this.H;

    ctx.fillStyle = '#000010';
    ctx.fillRect(0, 0, W, H);
    VistaEstrellas.dibujar(ctx);

    // Elementos del juego (solo con partida activa)
    if (EstadoJuego.estado !== 'intro') {
      VistaBalas.dibujar(ctx);
      VistaMeteoritos.dibujar(ctx);
      VistaParticulas.dibujar(ctx);
      VistaNave.dibujar(ctx);
    }

    // Overlay de pantalla encima de todo
    VistaPantallas.dibujar(ctx, W, H);
  }
};

// Arrancar cuando el DOM esté listo
window.onload = function() {
  ControladorJuego.iniciar();
};
