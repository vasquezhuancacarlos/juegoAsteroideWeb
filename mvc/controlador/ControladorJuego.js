var ControladorJuego = {

  canvas: null,
  ctx:    null,
  W:      480,
  H:      600,

  iniciar: function() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx    = this.canvas.getContext('2d');
    ControladorTeclado.iniciar();
    ModeloEstrellas.generar(this.W, this.H);
    VistaHUD.actualizar();
    this._loop();
  },

  iniciarPartida: function() {
    EstadoJuego.reiniciar();
    Nave.reiniciar(this.W, this.H);
    ModeloMeteoritos.reiniciar();
    ModeloBalas.reiniciar();
    ModeloParticulas.reiniciar();
    ModeloEstrellas.generar(this.W, this.H);
    VistaHUD.actualizar();
  },

  _loop: function() {
    var self = this;

    if (EstadoJuego.estado === 'jugando') {
      ControladorNave.actualizar(self.W, self.H);
      ControladorMeteoritos.actualizar(self.W, self.H);
      ControladorColisiones.actualizar();
    }

    self._dibujar();
    requestAnimationFrame(function() { self._loop(); });
  },

  _dibujar: function() {
    var ctx = this.ctx;
    var W   = this.W;
    var H   = this.H;

    // Fondo
    ctx.fillStyle = '#000010';
    ctx.fillRect(0, 0, W, H);

    // Estrellas (siempre visibles)
    VistaEstrellas.dibujar(ctx);

    // Elementos del juego
    if (EstadoJuego.estado !== 'intro') {
      VistaBalas.dibujar(ctx);
      VistaMeteoritos.dibujar(ctx);
      VistaParticulas.dibujar(ctx);
      VistaNave.dibujar(ctx);
    }

    // Overlay de pantalla
    VistaPantallas.dibujar(ctx, W, H);
  }
};

window.onload = function() {
  ControladorJuego.iniciar();
};