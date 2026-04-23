var ModeloEstrellas = {
  lista: [],

  /** Genera un campo de estrellas aleatorio */
  generar: function(canvasW, canvasH, cantidad) {
    cantidad   = cantidad || 150;
    this.lista = [];
    for (var i = 0; i < cantidad; i++) {
      this.lista.push({
        x:    Math.random() * canvasW,
        y:    Math.random() * canvasH,
        r:    Math.random() * 1.4,
        a:    0.15 + Math.random() * 0.85, // opacidad
        capa: Math.random()                // 0=lenta/fondo, 1=rápida/frente
      });
    }
  }
};