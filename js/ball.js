// Ball with trail and particles support
window.PongBall = class Ball {
  constructor(w, h) {
    this.w = w; this.h = h;
    this.r = 8;
    this.reset(1);
  }
  reset(dir) {
    this.x = this.w/2; this.y = this.h/2;
    this.speed = 380;
    const angle = (Math.random()*0.6 - 0.3); // -0.3..0.3 rad
    this.vx = Math.cos(angle) * this.speed * dir;
    this.vy = Math.sin(angle) * this.speed;
    this.trail = [];
    this.active = false; // waits for serve
  }
  serve() { this.active = true; }
  update(dt) {
    if (!this.active) return;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.trail.push({x:this.x,y:this.y});
    if (this.trail.length > 14) this.trail.shift();

    if (this.y - this.r < 0) { this.y = this.r; this.vy *= -1; window.PongAudio.wall(); }
    if (this.y + this.r > this.h) { this.y = this.h - this.r; this.vy *= -1; window.PongAudio.wall(); }
  }
  // collide with paddle: returns true on hit
  collide(paddle) {
    if (this.vx > 0 && paddle.x < this.x && this.x - this.r <= paddle.x + paddle.w && this.x + this.r >= paddle.x && this.y >= paddle.y && this.y <= paddle.y + paddle.h) {
      this.hit(paddle); return true;
    }
    if (this.vx < 0 && paddle.x > this.x && this.x + this.r >= paddle.x && this.x - this.r <= paddle.x + paddle.w && this.y >= paddle.y && this.y <= paddle.y + paddle.h) {
      this.hit(paddle); return true;
    }
    return false;
  }
  hit(paddle) {
    const center = paddle.y + paddle.h/2;
    const rel = (this.y - center) / (paddle.h/2); // -1..1
    const maxAngle = Math.PI/3; // 60deg
    const angle = rel * maxAngle;
    this.speed = Math.min(this.speed * 1.06, 900);
    const dir = this.x < this.w/2 ? 1 : -1;
    this.vx = Math.cos(angle) * this.speed * dir;
    this.vy = Math.sin(angle) * this.speed;
    this.x = dir === 1 ? paddle.x + paddle.w + this.r : paddle.x - this.r;
    window.PongAudio.paddle();
  }
  draw(ctx) {
    // trail
    for (let i=0;i<this.trail.length;i++){
      const t=this.trail[i], a=i/this.trail.length*0.35;
      ctx.beginPath(); ctx.arc(t.x,t.y,this.r*(0.4+0.6*i/this.trail.length),0,Math.PI*2);
      ctx.fillStyle=`rgba(0,240,255,${a})`; ctx.fill();
    }
    ctx.shadowBlur=18; ctx.shadowColor='#00f0ff';
    ctx.fillStyle='#eaffff';
    ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fill();
    ctx.shadowBlur=0;
  }
};
