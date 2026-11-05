// Ping Pong - main game loop
(() => {
  const W = 800, H = 500;
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');

  const UI = window.PongUI;
  const Input = window.PongInput;
  Input.bindPointer(canvas);

  const PADDLE_W = 12, PADDLE_H = 90;
  const left = new window.PongPaddle(18, PADDLE_W, PADDLE_H, '#00f0ff');
  const right = new window.PongPaddle(W - 18 - PADDLE_W, PADDLE_W, PADDLE_H, '#ff2e88');
  const ball = new window.PongBall(W, H);

  let state = 'menu'; // menu | playing | paused | gameover
  let mode = 'ai'; // ai | pvp
  let difficulty = 'medium';
  let winScore = 7;
  let score1 = 0, score2 = 0;
  let last = 0, particles = [];
  let serveDir = 1;

  function resetMatch(dir = 1) {
    score1 = 0; score2 = 0;
    left.reset(); right.reset();
    serveDir = dir;
    ball.reset(dir);
    particles = [];
    UI.hideServe();
  }

  function startMatch() {
    difficulty = document.getElementById('difficulty').value;
    winScore = parseInt(document.getElementById('winScore').value, 10) || 7;
    resetMatch(1);
    state = 'playing';
    UI.hideMenu(); UI.hideGameOver(); UI.hidePause(); UI.hideServe();
    setTimeout(() => { if (state==='playing') { ball.serve(); } }, 10);
  }

  function toMenu() {
    state = 'menu';
    resetMatch(1);
    UI.showMenu();
  }

  function togglePause() {
    if (state === 'playing') { state = 'paused'; UI.showPause(); }
    else if (state === 'paused') { state = 'playing'; UI.hidePause(); last = performance.now(); }
  }

  function onPoint(winner) {
    // winner 1 = left player scores, 2 = right
    if (winner === 1) score1++; else score2++;
    window.PongAudio.score();
    burst(ball.x, ball.y, winner === 1 ? '#00f0ff' : '#ff2e88');
    if (score1 >= winScore || score2 >= winScore) {
      state = 'gameover';
      window.PongAudio.win();
      const winnerName = mode==='ai'
        ? (score1 >= winScore ? 'Você' : 'A IA')
        : (score1 >= winScore ? 'Jogador 1' : 'Jogador 2');
      UI.showGameOver(winnerName, score1, score2);
      return;
    }
    serveDir = winner === 1 ? -1 : 1; // serve toward scorer? keep dynamic
    ball.reset(serveDir);
    if (state === 'playing') UI.showServe();
  }

  function burst(x, y, color) {
    for (let i=0;i<28;i++) {
      const a = Math.random()*Math.PI*2, s = 60+Math.random()*260;
      particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:0.5+Math.random()*0.4,color,r:2+Math.random()*3});
    }
  }

  function update(dt) {
    // Player 1
    if (Input.p1Up()) left.move(dt, -1);
    if (Input.p1Down()) left.move(dt, 1);
    const py = Input.getPointerY();
    if (py !== null) { left.y = py - left.h/2; left.clamp(); }

    // Player 2 / AI
    if (mode === 'pvp') {
      if (Input.p2Up()) right.move(dt, -1);
      if (Input.p2Down()) right.move(dt, 1);
    } else {
      window.PongAI.move(right, ball, dt, difficulty);
    }

    ball.update(dt);
    ball.collide(left);
    ball.collide(right);

    if (ball.x < -20) onPoint(2);
    else if (ball.x > W + 20) onPoint(1);

    particles = particles.filter(p => (p.life -= dt) > 0);
    particles.forEach(p => { p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=300*dt; });
  }

  function drawField() {
    ctx.fillStyle = '#07071a'; ctx.fillRect(0,0,W,H);
    // grid glow
    ctx.strokeStyle='rgba(0,240,255,0.06)'; ctx.lineWidth=1;
    for (let x=0;x<W;x+=40){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    // center line
    ctx.setLineDash([12,12]); ctx.strokeStyle='rgba(255,255,255,0.35)'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(W/2,0); ctx.lineTo(W/2,H); ctx.stroke(); ctx.setLineDash([]);
    // center circle
    ctx.beginPath(); ctx.arc(W/2,H/2,56,0,Math.PI*2); ctx.strokeStyle='rgba(57,255,136,0.25)'; ctx.stroke();

    // score
    ctx.fillStyle='#fff'; ctx.font='bold 44px system-ui';
    ctx.textAlign='center'; ctx.shadowBlur=14; ctx.shadowColor='#00f0ff';
    ctx.fillText(score1, W/2 - 60, 52);
    ctx.shadowColor='#ff2e88';
    ctx.fillText(score2, W/2 + 60, 52);
    ctx.shadowBlur=0;
    ctx.fillStyle='rgba(255,255,255,0.45)'; ctx.font='12px system-ui';
    ctx.fillText(mode==='ai' ? 'VOCÊ' : 'P1', W/2-60, 70);
    ctx.fillText(mode==='ai' ? 'IA' : 'P2', W/2+60, 70);
  }

  function draw(dt) {
    drawField();
    left.draw(ctx); right.draw(ctx); ball.draw(ctx);
    particles.forEach(p=>{
      ctx.globalAlpha=Math.max(0,p.life*2); ctx.fillStyle=p.color;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
    });
    if (state==='paused') {
      ctx.fillStyle='rgba(0,0,0,0.35)'; ctx.fillRect(0,0,W,H);
    }
  }

  function loop(ts) {
    requestAnimationFrame(loop);
    const dt = Math.min((ts-last)/1000 || 0, 0.033);
    last = ts;
    if (state === 'playing') update(dt);
    draw(dt);
  }
  requestAnimationFrame(loop);

  // Global API for input
  window.Game = {
    onKey(key, code) {
      const k = key.toLowerCase();
      if (k === 'p') {
        if (state==='playing' || state==='paused') togglePause();
      }
      if (k === 'r') {
        if (state!=='menu') startMatch();
      }
      if (k === ' ' || code === 'Space') {
        if (state==='playing' && !ball.active) { ball.serve(); UI.hideServe(); }
        else if (state==='menu') startMatch();
        else if (state==='gameover') startMatch();
      }
      if (k === 'enter' && state==='menu') startMatch();
    }
  };

  // Buttons
  document.querySelectorAll('[data-mode]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      mode = btn.dataset.mode;
      window.PongAudio.click();
      startMatch();
    });
  });
  document.getElementById('resumeBtn').addEventListener('click', togglePause);
  document.getElementById('restartBtn').addEventListener('click', startMatch);
  document.getElementById('menuBtn').addEventListener('click', toMenu);
  document.getElementById('menuBtn2').addEventListener('click', toMenu);
  document.getElementById('againBtn').addEventListener('click', startMatch);

  resetMatch(1);
})();
