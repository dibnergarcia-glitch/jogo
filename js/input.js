// Keyboard + mouse + touch input
window.PongInput = (() => {
  const keys = {};
  let pointerY = null; // for mouse/touch control of player 1

  window.addEventListener('keydown', e => {
    keys[e.key.toLowerCase()] = true;
    keys[e.code] = true;
    if (['ArrowUp','ArrowDown',' '].includes(e.key)) e.preventDefault();
    if (window.Game) window.Game.onKey(e.key, e.code);
  });
  window.addEventListener('keyup', e => {
    keys[e.key.toLowerCase()] = false;
    keys[e.code] = false;
  });

  function bindPointer(canvas) {
    const toGameY = (clientY) => {
      const r = canvas.getBoundingClientRect();
      return (clientY - r.top) / r.height * 500;
    };
    canvas.addEventListener('mousemove', e => { pointerY = toGameY(e.clientY); });
    canvas.addEventListener('touchmove', e => {
      if (e.touches[0]) pointerY = toGameY(e.touches[0].clientY);
    }, {passive:true});
  }

  return {
    keys,
    bindPointer,
    getPointerY: () => pointerY,
    p1Up: () => keys['w'] || keys['W'],
    p1Down: () => keys['s'] || keys['S'],
    p2Up: () => keys['ArrowUp'] || keys['arrowup'],
    p2Down: () => keys['ArrowDown'] || keys['arrowdown'],
  };
})();
