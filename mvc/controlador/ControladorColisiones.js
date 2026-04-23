var ControladorColisiones = {

  actualizar: function() {
    this._balasMeteoritos();
    this._naveMeteoritos();
  },

  // Distancia entre dos puntos (para detectar colisión circular)
  _dist: function(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  },

  // Bala ↔ Meteorito
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

  // Nave ↔ Meteorito (solo si no está invulnerable)
  _naveMeteoritos: function() {
    // Decrementar timer de invulnerabilidad cada frame
    if (EstadoJuego.invTimer > 0) {
      EstadoJuego.invTimer--;
      return; // no revisar colisiones mientras es invulnerable
    }

    for (var i = ModeloMeteoritos.lista.length - 1; i >= 0; i--) {
      var m = ModeloMeteoritos.lista[i];

      if (this._dist(m, Nave) < m.r + Nave.RADIO_COLISION) {
        ModeloParticulas.explotar(m.x, m.y, '#ff4400', 22); // explosión roja
        ModeloMeteoritos.eliminar(i);
        EstadoJuego.perderVida();   // resta vida y activa invTimer
        VistaHUD.actualizar();

        // Si se acabaron las vidas → game over
        if (EstadoJuego.vidas <= 0) {
          EstadoJuego.estado = 'golpe';
          setTimeout(function() {
            EstadoJuego.estado = 'gameover';
          }, 1500);
        }
        break; // solo procesar una colisión nave por frame
      }
    }
  }
};
