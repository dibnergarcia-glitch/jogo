// Paddles + AI
window.PongPaddle = class Paddle {
  constructor(x, w, h, color) {
    this.x = x; this.w = w; this.h = h;
    this.color = color;
    this.y = 200 - h/2;
    this.speed = 520;
  }
  reset() { this.y = 200 - this.h/2; }
  move(dt, dir) { this.y += dir * this.speed * dt; this.clamp(); }
  clamp() { this.y = Math.max(0, Math.min(500 - this.h, this.y)); }
  draw(ctx) {
    ctx.shadowBlur=16; ctx.shadowColor=this.color;
    ctx.fillStyle=this.color;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(this.x, this.y, this.w, this.h, 6); else ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fill();
    ctx.shadowBlur=0;
  }
};

window.PongAI = {
  // Returns -1, 0, 1 direction toward ball with error & max speed
  move(aiPaddle, ball, dt, difficulty) {
    const cfg = {
      easy:   { maxSpeed: 320, error: 55, reaction: 0.12 },
      medium: { maxSpeed: 480, error: 28, reaction: 0.05 },
      hard:   { maxSpeed: 700, error: 10, reaction: 0.0 },
    }[difficulty] || { maxSpeed:480, error:28, reaction:0.05 };

    if (!ball.active || ball.vx < 0) {
      // return to center slowly
      const c = 250 - aiPaddle.h/2;
      const d = c - aiPaddle.y;
      if (Math.abs(d) > 4) aiPaddle.y += (d>0?1:-1) * 200 * dt;
      aiPaddle.clamp(); return;
    }
    // predict intercept
    const t = (aiPaddle.x - ball.x) / ball.vx;
    let predicted = ball.y + ball.vy * t;
    // bounce prediction (simple)
    while (predicted < 0 || predicted > 500) {
      if (predicted < 0) predicted = -predicted;
      if (predicted > 500) predicted = 1000 - predicted;
    }
    const target = predicted - aiPaddle.h/2 + cfg.error * 0.3;
    const d = target - aiPaddle.y;
    if (Math.abs(d) > 6) {
      const step = Math.sign(d) * Math.min(cfg.maxSpeed*dt, Math.abs(d));
      aiPaddle.y += step;
      aiPaddle.clamp();
    }
  }
};
