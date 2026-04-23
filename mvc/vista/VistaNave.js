var VistaNave = {
  dibujar: function(ctx) {
    // Parpadeo durante invulnerabilidad: visible/invisible cada 6 frames
    if (EstadoJuego.invTimer > 0 && Math.floor(EstadoJuego.invTimer / 6) % 2 === 0) return;

    ctx.save();
    ctx.translate(Nave.x, Nave.y);
    // +Math.PI/2 porque la nave dibujada "apunta arriba" pero ángulo 0 = derecha
    ctx.rotate(Nave.angulo + Math.PI / 2);

    // Llamarada del motor (longitud aleatoria = animación de llama)
    var largoLlama = 14 + Math.random() * 8;
    ctx.fillStyle = 'hsl(' + (Math.random() * 20 + 10) + ',100%,55%)';
    ctx.beginPath();
    ctx.moveTo(-7, 8); ctx.lineTo(0, 8 + largoLlama); ctx.lineTo(7, 8);
    ctx.closePath(); ctx.fill();

    // Cuerpo principal
    ctx.fillStyle = '#00ccff';
    ctx.beginPath();
    ctx.moveTo(0, -18); ctx.lineTo(-14, 14); ctx.lineTo(0, 6); ctx.lineTo(14, 14);
    ctx.closePath(); ctx.fill();

    // Borde brillante
    ctx.strokeStyle = 'rgba(100,220,255,0.5)';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(0, -18); ctx.lineTo(-14, 14); ctx.lineTo(0, 6); ctx.lineTo(14, 14);
    ctx.closePath(); ctx.stroke();

    // Núcleo
    ctx.fillStyle = '#e8f8ff';
    ctx.beginPath();
    ctx.moveTo(0, -10); ctx.lineTo(-5, 5); ctx.lineTo(0, 1); ctx.lineTo(5, 5);
    ctx.closePath(); ctx.fill();

    // Ventanilla
    ctx.beginPath();
    ctx.arc(0, -5, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,200,255,0.4)';
    ctx.fill();

    ctx.restore();
  }
};
