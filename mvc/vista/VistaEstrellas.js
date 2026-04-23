var VistaEstrellas = {
  dibujar: function(ctx) {
    ModeloEstrellas.lista.forEach(function(s) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + s.a + ')';
      ctx.fill();
    });
  }
};
