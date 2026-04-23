var VistaBalas = {
  dibujar: function(ctx) {
    ModeloBalas.lista.forEach(function(b) {
      var angulo = Math.atan2(b.vy, b.vx); // ángulo real de vuelo
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(angulo); // rotar → la bala apunta hacia donde va
      ctx.fillStyle   = '#ffff44';
      ctx.shadowBlur  = 8;
      ctx.shadowColor = '#ffff00';
      ctx.fillRect(-5, -2, 10, 4); // rectángulo centrado que rota con el contexto
      ctx.shadowBlur  = 0;
      ctx.restore();
    });
  }
};