var ControladorMeteoritos = {

  actualizar: function(W, H) {
    this._subirNivel();
    this._spawnMeteoritos(W, H);
    this._moverBalas(W, H);
    this._moverMeteoritos(W, H);
    this._moverParticulas();
    this._parallaxEstrellas();
  },

  _subirNivel: function() {
    EstadoJuego.timerNivel++;
    if (EstadoJuego.timerNivel >= EstadoJuego.FRAMES_NIVEL) {
      EstadoJuego.timerNivel = 0;
      EstadoJuego.subirNivel();
      VistaHUD.actualizar();
    }
  },

  _spawnMeteoritos: function(W, H) {
    EstadoJuego.timerSpawn++;
    if (EstadoJuego.timerSpawn >= EstadoJuego.spawnRate) {
      ModeloMeteoritos.crear(W, H, EstadoJuego.nivel);
      EstadoJuego.timerSpawn = 0;
    }
  },

  _moverBalas: function(W, H) {
    for (var i = ModeloBalas.lista.length - 1; i >= 0; i--) {
      var b = ModeloBalas.lista[i];
      b.x += b.vx; b.y += b.vy;
      if (b.x < -30 || b.x > W+30 || b.y < -30 || b.y > H+30)
        ModeloBalas.eliminar(i);
    }
  },

  _moverMeteoritos: function(W, H) {
    for (var i = ModeloMeteoritos.lista.length - 1; i >= 0; i--) {
      var m = ModeloMeteoritos.lista[i];
      m.x += m.vx; m.y += m.vy; m.rot += m.rotSpeed;
      if (m.x < -m.r*3 || m.x > W+m.r*3 || m.y < -m.r*3 || m.y > H+m.r*3)
        ModeloMeteoritos.eliminar(i);
    }
  },

  _moverParticulas: function() {
    for (var i = ModeloParticulas.lista.length - 1; i >= 0; i--) {
      var p = ModeloParticulas.lista[i];
      p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.life -= p.decay;
      if (p.life <= 0) ModeloParticulas.eliminar(i);
    }
  },

  _parallaxEstrellas: function() {
    ModeloEstrellas.lista.forEach(function(s) {
      s.x -= Nave.vx * s.capa * 0.15;
      s.y -= Nave.vy * s.capa * 0.15;
      if (s.x < 0) s.x += 480; if (s.x > 480) s.x -= 480;
      if (s.y < 0) s.y += 600; if (s.y > 600) s.y -= 600;
    });
  }
};
