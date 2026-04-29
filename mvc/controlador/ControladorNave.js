var ControladorNave = {
  actualizar: function(W, H) {
    Nave.mover(ControladorTeclado.teclas, W, H);
    Nave.disparar(ControladorTeclado.teclas);
  }
};
