var ModeloParticulas = {
  lista: [],

  /** Genera N partículas en círculo desde el punto de impacto */
  explotar: function(x, y, color, cantidad) {
    cantidad = cantidad || 18;
    for (var i = 0; i < cantidad; i++) {
      var angulo = (i / cantidad) * Math.PI * 2;
      var speed  = 1.5 + Math.random() * 3.5;
      this.lista.push({
        x:     x,
        y:     y,
        vx:    Math.cos(angulo) * speed,
        vy:    Math.sin(angulo) * speed,
        life:  1.0,                        
        decay: 0.03 + Math.random() * 0.04,
        r:     1.5 + Math.random() * 3,
        color: color
      });
    }
  },

  eliminar:  function(i) { this.lista.splice(i, 1); },
  reiniciar: function()  { this.lista = []; }
};
