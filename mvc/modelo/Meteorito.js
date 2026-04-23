var ModeloMeteoritos = {
  lista:   [],
  COLORES: ['#a0522d', '#8b4513', '#cd853f', '#d2691e', '#b8860b'],

  /**
   * Crea un meteorito nuevo desde un borde aleatorio del canvas.
   * Su dirección apunta aproximadamente al centro.
   */
  crear: function(canvasW, canvasH, nivel) {
    var r         = 10 + Math.random() * 26;
    var velocidad = 1.4 + Math.random() * 2 + (nivel - 1) * 0.35;

    // Elegir borde: 0=arriba, 1=abajo, 2=izquierda, 3=derecha
    var borde = Math.floor(Math.random() * 4);
    var mx, my;
    if (borde === 0) { mx = r + Math.random() * (canvasW - r*2); my = -r; }
    if (borde === 1) { mx = r + Math.random() * (canvasW - r*2); my = canvasH + r; }
    if (borde === 2) { mx = -r;          my = r + Math.random() * (canvasH - r*2); }
    if (borde === 3) { mx = canvasW + r; my = r + Math.random() * (canvasH - r*2); }

    // Dirección hacia el centro con variación aleatoria
    var destinoX = canvasW/2 + (Math.random()-0.5) * canvasW * 0.6;
    var destinoY = canvasH/2 + (Math.random()-0.5) * canvasH * 0.6;
    var angulo   = Math.atan2(destinoY - my, destinoX - mx)
                 + (Math.random() - 0.5) * 0.8;

    this.lista.push({
      x:        mx,
      y:        my,
      r:        r,
      vx:       Math.cos(angulo) * velocidad,
      vy:       Math.sin(angulo) * velocidad,
      rot:      0,
      rotSpeed: (Math.random() - 0.5) * 0.07,
      color:    this.COLORES[Math.floor(Math.random() * this.COLORES.length)]
    });
  },

  eliminar:  function(i) { this.lista.splice(i, 1); },
  reiniciar: function()  { this.lista = []; }
};
