var VistaMeteoritos = {
  dibujar: function(ctx) {
    ModeloMeteoritos.lista.forEach(function(m) {
      ctx.save();
      ctx.translate(m.x, m.y);
      ctx.rotate(m.rot);

      // Sombra desplazada
      ctx.beginPath();
      for (var i = 0; i < 8; i++) {
        var a = (i/8)*Math.PI*2, j = 0.72+Math.sin(i*3.7)*0.28, r = m.r*j;
        if (i===0) ctx.moveTo(Math.cos(a)*r+2, Math.sin(a)*r+2);
        else       ctx.lineTo(Math.cos(a)*r+2, Math.sin(a)*r+2);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fill();

      // Forma irregular (8 vértices con jitter → parece roca)
      ctx.beginPath();
      for (var i = 0; i < 8; i++) {
        var a = (i/8)*Math.PI*2, j = 0.72+Math.sin(i*3.7)*0.28, r = m.r*j;
        if (i===0) ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r);
        else       ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
      }
      ctx.closePath();
      ctx.fillStyle = m.color; ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth=1; ctx.stroke();

      // Cráteres
      ctx.beginPath();
      ctx.arc(-m.r*0.22, -m.r*0.18, m.r*0.22, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fill();

      ctx.beginPath();
      ctx.arc(m.r*0.3, m.r*0.25, m.r*0.14, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fill();

      ctx.restore();
    });
  }
};
