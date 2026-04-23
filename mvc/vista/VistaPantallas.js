var VistaPantallas = {

  dibujar: function(ctx, W, H) {
    var e = EstadoJuego.estado;
    if (e === 'intro')    this._intro(ctx, W, H);
    if (e === 'pausa')    this._pausa(ctx, W, H);
    if (e === 'golpe')    this._golpe(ctx, W, H);
    if (e === 'gameover') this._gameOver(ctx, W, H);
  },

  // Capa oscura semitransparente de fondo
  _overlay: function(ctx, W, H, alpha) {
    ctx.fillStyle = 'rgba(0,0,0,' + alpha + ')';
    ctx.fillRect(0, 0, W, H);
  },

  // Texto centrado genérico
  _txt: function(ctx, texto, x, y, size, color) {
    ctx.font      = size + 'px Courier New';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(texto, x, y);
  },

  _intro: function(ctx, W, H) {
    this._overlay(ctx, W, H, 0.72);
    this._txt(ctx, '☄️  METEORITOS',                        W/2, H/2-100, 28, '#00ffff');
    this._txt(ctx, 'Movimiento libre — meteoritos por todos lados', W/2, H/2-55, 13, '#aaa');
    this._txt(ctx, '─────────────────────────',              W/2, H/2-28,  11, '#333');
    this._txt(ctx, '↑ ↓ ← →   Mover (con inercia)',          W/2, H/2-5,   12, '#666');
    this._txt(ctx, 'ESPACIO    Disparar hacia donde apuntas', W/2, H/2+18,  12, '#666');
    this._txt(ctx, 'P          Pausar',                       W/2, H/2+41,  12, '#666');
    this._txt(ctx, '─────────────────────────',              W/2, H/2+58,  11, '#333');
    this._txt(ctx, '[ ENTER para jugar ]',                    W/2, H/2+95,  16, '#00ff88');
  },

  _pausa: function(ctx, W, H) {
    this._overlay(ctx, W, H, 0.5);
    this._txt(ctx, '⏸  PAUSA',                 W/2, H/2-10, 28, '#ffff00');
    this._txt(ctx, 'Presiona P para continuar', W/2, H/2+30, 13, '#aaa');
  },

  _golpe: function(ctx, W, H) {
    this._overlay(ctx, W, H, 0.5);
    this._txt(ctx, '¡IMPACTO!', W/2, H/2, 32, '#ff6600');
  },

  _gameOver: function(ctx, W, H) {
    this._overlay(ctx, W, H, 0.75);
    this._txt(ctx, 'GAME OVER',                          W/2, H/2-65, 34, '#ff3333');
    this._txt(ctx, 'Puntuación: ' + EstadoJuego.puntos,  W/2, H/2-12, 18, '#ffffff');
    this._txt(ctx, 'Récord: '     + EstadoJuego.record,  W/2, H/2+16, 15, '#00ffff');
    this._txt(ctx, 'Nivel alcanzado: ' + EstadoJuego.nivel, W/2, H/2+42, 14, '#aaa');
    this._txt(ctx, '[ ENTER para reiniciar ]',            W/2, H/2+90, 14, '#00ff88');
  }
};
