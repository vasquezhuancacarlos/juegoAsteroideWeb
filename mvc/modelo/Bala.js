var ModeloBalas = {
  lista:    [],
  VELOCIDAD: 11,

  /** Crea una bala que sale desde la punta de la nave en su dirección */
  crear: function(naveX, naveY, angulo) {
    this.lista.push({
      x:  naveX + Math.cos(angulo) * 20, 
      y:  naveY + Math.sin(angulo) * 20,
      vx: Math.cos(angulo) * this.VELOCIDAD,
      vy: Math.sin(angulo) * this.VELOCIDAD
    });
  },

  eliminar:  function(i) { this.lista.splice(i, 1); },
  reiniciar: function()  { this.lista = []; }
};
