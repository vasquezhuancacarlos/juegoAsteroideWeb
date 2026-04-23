var VistaParticulas = {
  dibujar: function(ctx) {
    ModeloParticulas.lista.forEach(function(p) {
      ctx.save();
      ctx.globalAlpha = p.life; // se vuelven transparentes al morir
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.restore();
    });
  }
};
