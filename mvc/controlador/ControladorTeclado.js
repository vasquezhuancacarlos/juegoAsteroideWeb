var ControladorTeclado = {
  teclas: {},

  iniciar: function() {
    var self = this;

    document.addEventListener('keydown', function(e) {
      self.teclas[e.key] = true;
      if (e.key === ' ') e.preventDefault();

      // P → alternar pausa
      if (e.key === 'p' || e.key === 'P') {
        if (EstadoJuego.estado === 'jugando')    EstadoJuego.estado = 'pausa';
        else if (EstadoJuego.estado === 'pausa') EstadoJuego.estado = 'jugando';
      }

      // Enter → iniciar o reiniciar
      if (e.key === 'Enter') {
        if (EstadoJuego.estado === 'intro' || EstadoJuego.estado === 'gameover') {
          ControladorJuego.iniciarPartida();
        }
      }
    });

    document.addEventListener('keyup', function(e) {
      self.teclas[e.key] = false;
    });
  },

  estaPresionada: function(tecla) {
    return this.teclas[tecla] === true;
  }
};