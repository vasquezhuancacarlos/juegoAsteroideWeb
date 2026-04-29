var ControladorColisiones = {

  actualizar: function() {
    this._balasMeteoritos();
    this._naveMeteoritos();
  },

  _dist: function(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  },

  _balasMeteoritos: function() {
    for (var i = ModeloMeteoritos.lista.length - 1; i >= 0; i--) {
      var m = ModeloMeteoritos.lista[i];
      for (var j = ModeloBalas.lista.length - 1; j >= 0; j--) {
        var b = ModeloBalas.lista[j];
        if (this._dist(b, m) < m.r + 4) {
          ModeloParticulas.explotar(m.x, m.y, m.color);
          EstadoJuego.sumarPuntos(Math.round(m.r) * EstadoJuego.nivel);
          ModeloMeteoritos.eliminar(i);
          ModeloBalas.eliminar(j);
          VistaHUD.actualizar();
          break;
        }
      }
    }
  },

  _naveMeteoritos: function() {
    if (EstadoJuego.invTimer > 0) {
      EstadoJuego.invTimer--;
      return;
    }
    for (var i = ModeloMeteoritos.lista.length - 1; i >= 0; i--) {
      var m = ModeloMeteoritos.lista[i];
      if (this._dist(m, Nave) < m.r + Nave.RADIO_COLISION) {
        ModeloParticulas.explotar(m.x, m.y, '#ff4400', 22);
        ModeloMeteoritos.eliminar(i);
        EstadoJuego.perderVida();
        VistaHUD.actualizar();
        if (EstadoJuego.vidas <= 0) {
          EstadoJuego.estado = 'golpe';
          setTimeout(function() { EstadoJuego.estado = 'gameover'; }, 1500);
        }
        break;
      }
    }
  }
};
