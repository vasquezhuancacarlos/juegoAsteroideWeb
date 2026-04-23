var VistaBalas = {
  dibujar: function(ctx) {
    ModeloBalas.lista.forEach(function(b) {
      var angulo = Math.atan2(b.vy, b.vx); 
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(angulo); 
      ctx.fillStyle   = '#ffff44';
      ctx.shadowBlur  = 8;
      ctx.shadowColor = '#ffff00';
      ctx.fillRect(-5, -2, 10, 4); 
      ctx.restore();
    });
  }
};