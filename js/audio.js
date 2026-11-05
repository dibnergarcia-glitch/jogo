// Simple Web Audio beeps - no external files needed
window.PongAudio = (() => {
  let ctx = null;
  function ensure() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function beep(freq, dur = 0.07, type = 'square', vol = 0.12) {
    try {
      const c = ensure();
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(vol, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
      o.connect(g).connect(c.destination);
      o.start(); o.stop(c.currentTime + dur);
    } catch(e) {}
  }
  return {
    paddle: () => beep(520, 0.06),
    wall: () => beep(340, 0.05, 'square', 0.08),
    score: () => { beep(880,0.12,'square',0.15); setTimeout(()=>beep(1174,0.18,'square',0.15),90); },
    win: () => [523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,0.18,'square',0.16), i*140)),
    click: () => beep(700,0.05)
  };
})();
