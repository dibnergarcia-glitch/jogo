// UI overlays management
window.PongUI = (() => {
  const $ = id => document.getElementById(id);
  const menu = $('menu'), pause = $('pause'), gameover = $('gameover');
  const winnerText = $('winnerText'), finalScore = $('finalScore');
  const serveHint = $('serveHint');

  function show(el) { el?.classList.remove('hidden'); }
  function hide(el) { el?.classList.add('hidden'); }

  function showMenu() { show(menu); hide(pause); hide(gameover); hide(serveHint); }
  function showPause() { show(pause); }
  function hidePause() { hide(pause); }
  function showGameOver(winner, s1, s2) {
    winnerText.textContent = winner + ' venceu! 🎉';
    finalScore.textContent = `${s1} x ${s2}`;
    show(gameover); hide(pause); hide(serveHint);
  }
  function hideGameOver() { hide(gameover); }
  function hideMenu() { hide(menu); }
  function showServe() { show(serveHint); }
  function hideServe() { hide(serveHint); }

  return { showMenu, hideMenu, showPause, hidePause, showGameOver, hideGameOver, showServe, hideServe, $ };
})();
