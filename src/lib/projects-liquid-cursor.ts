/**
 * Kala-style site-wide liquid cursor.
 *
 * - Spin-arrow tip leads at the pointer
 * - Soft circle-chain eases BEHIND the tip (gooey stroke when moving)
 * - Idle blob collapses behind the tip — never sits on top of it
 */

type Vec = { x: number; y: number };

type Droplet = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  maxLife: number;
};

/** Follower nodes from head (near cursor) → tail */
const NODE_COUNT = 7;
/** Head catch-up — responsive, but aimed at a point behind the tip */
const HEAD_LAMBDA = 28;
/** Each subsequent node follows the previous (higher = shorter trail) */
const TAIL_LAMBDA = 24;
const SPEED_SMOOTH_LAMBDA = 14;
/** Resting blob radius — sits behind the spin-arrow tip when idle */
const IDLE_RADIUS = 10;
const HEAD_RADIUS = 12;
const TAIL_RADIUS = 2.2;
const MAX_SPEED = 2600;
/** Cap spacing between nodes so fast flicks don't paint a long streak */
const MAX_NODE_GAP = 18;
/** Keep liquid head clear of the arrow tip (px behind pointer) */
const TIP_CLEARANCE_IDLE = 18;
const TIP_CLEARANCE_MOVE = 12;

function clamp(v: number, a: number, b: number) {
  return Math.min(b, Math.max(a, v));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Frame-rate independent exponential smoothing toward a target. */
function expDamp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

function nodeRadius(i: number, stretch: number) {
  const t = i / Math.max(NODE_COUNT - 1, 1);
  const base = lerp(HEAD_RADIUS, TAIL_RADIUS, Math.pow(t, 0.72));
  // When nearly idle, collapse toward a uniform soft circle
  const idle = IDLE_RADIUS * (1 - t * 0.15);
  return lerp(idle, base, stretch);
}

export class ProjectsLiquidCursor {
  private ctx: CanvasRenderingContext2D | null = null;
  private raf = 0;
  private running = false;
  private visible = false;
  private overHit = false;
  private rawX = 0;
  private rawY = 0;
  private nodes: Vec[] = Array.from({ length: NODE_COUNT }, () => ({
    x: 0,
    y: 0,
  }));
  private speed = 0;
  private lastHeadX = 0;
  private lastHeadY = 0;
  private droplets: Droplet[] = [];
  private dropletCooldown = 0;
  private width = 0;
  private height = 0;
  private lastFrame = 0;
  private idleBlend = 1;
  /** Unit vector pointing behind the tip (opposite travel). */
  private behindX = 0.65;
  private behindY = 0.75;
  private lastRawX = 0;
  private lastRawY = 0;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastFrame = performance.now();
    this.resize();
    this.raf = requestAnimationFrame(this.frame);
  }

  stop() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.clear();
  }

  dispose() {
    this.stop();
    this.droplets = [];
    this.ctx = null;
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.width = w;
    this.height = h;
    this.canvas.width = Math.max(1, Math.round(w * dpr));
    this.canvas.height = Math.max(1, Math.round(h * dpr));
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  setPointer(x: number, y: number, inside: boolean) {
    if (!inside) {
      this.visible = false;
      this.overHit = false;
      this.speed = 0;
      this.droplets = [];
      return;
    }
    const wasVisible = this.visible;
    this.visible = true;
    if (wasVisible) {
      const dx = x - this.lastRawX;
      const dy = y - this.lastRawY;
      const len = Math.hypot(dx, dy);
      // Update "behind" from travel direction so the blob trails the tip
      if (len > 1.2) {
        this.behindX = -dx / len;
        this.behindY = -dy / len;
      }
    }
    this.lastRawX = x;
    this.lastRawY = y;
    this.rawX = x;
    this.rawY = y;
    if (!wasVisible) {
      const bx = x + this.behindX * TIP_CLEARANCE_IDLE;
      const by = y + this.behindY * TIP_CLEARANCE_IDLE;
      for (const n of this.nodes) {
        n.x = bx;
        n.y = by;
      }
      this.lastHeadX = bx;
      this.lastHeadY = by;
      this.idleBlend = 1;
      this.speed = 0;
    }
  }

  setOverHit(over: boolean) {
    if (over && !this.overHit) {
      this.droplets = [];
      this.speed = 0;
      this.idleBlend = 1;
    }
    this.overHit = over;
  }

  private clear() {
    this.ctx?.clearRect(0, 0, this.width, this.height);
  }

  private frame = (now: number) => {
    if (!this.running) return;
    const dt = Math.min(0.033, (now - this.lastFrame) / 1000 || 0.016);
    this.lastFrame = now;

    if (this.visible) {
      // Head eases toward a point BEHIND the tip — arrow leads, liquid follows
      const clearance = lerp(
        TIP_CLEARANCE_IDLE,
        TIP_CLEARANCE_MOVE,
        1 - this.idleBlend,
      );
      const targetX = this.rawX + this.behindX * clearance;
      const targetY = this.rawY + this.behindY * clearance;
      const head = this.nodes[0];
      head.x = expDamp(head.x, targetX, HEAD_LAMBDA, dt);
      head.y = expDamp(head.y, targetY, HEAD_LAMBDA, dt);

      for (let i = 1; i < NODE_COUNT; i++) {
        const prev = this.nodes[i - 1];
        const n = this.nodes[i];
        // Slightly softer down the chain for liquid follow-through
        const lambda = TAIL_LAMBDA - i * 0.25;
        n.x = expDamp(n.x, prev.x, Math.max(10, lambda), dt);
        n.y = expDamp(n.y, prev.y, Math.max(10, lambda), dt);

        // Keep the stroke short — no long comet on fast flicks
        const gx = n.x - prev.x;
        const gy = n.y - prev.y;
        const gap = Math.hypot(gx, gy);
        if (gap > MAX_NODE_GAP) {
          const s = MAX_NODE_GAP / gap;
          n.x = prev.x + gx * s;
          n.y = prev.y + gy * s;
        }
      }

      const dx = head.x - this.lastHeadX;
      const dy = head.y - this.lastHeadY;
      const dist = Math.hypot(dx, dy);
      const instant = dist / Math.max(dt, 1e-4);
      this.speed = expDamp(this.speed, instant, SPEED_SMOOTH_LAMBDA, dt);
      this.lastHeadX = head.x;
      this.lastHeadY = head.y;

      // 0 = moving stroke, 1 = idle circle
      const idleTarget = this.speed < 90 ? 1 : 0;
      this.idleBlend = expDamp(this.idleBlend, idleTarget, 8, dt);

      this.updateDroplets(dt, dx, dy, dist);
    } else {
      this.speed = expDamp(this.speed, 0, 12, dt);
      this.idleBlend = expDamp(this.idleBlend, 1, 10, dt);
      this.droplets = this.droplets.filter((d) => {
        d.life -= dt;
        return d.life > 0;
      });
    }

    this.draw();
    this.raf = requestAnimationFrame(this.frame);
  };

  private updateDroplets(dt: number, dx: number, dy: number, dist: number) {
    this.dropletCooldown = Math.max(0, this.dropletCooldown - dt);
    for (const d of this.droplets) {
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      d.vx *= 0.9;
      d.vy *= 0.9;
      d.life -= dt;
      d.r *= 0.98;
    }
    this.droplets = this.droplets.filter((d) => d.life > 0.02 && d.r > 0.5);

    if (
      !this.overHit &&
      this.dropletCooldown <= 0 &&
      this.speed > 520 &&
      dist > 3 &&
      this.droplets.length < 3
    ) {
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      const side = Math.random() > 0.5 ? 1 : -1;
      const head = this.nodes[0];
      this.droplets.push({
        x: head.x - dx * 0.5 + nx * side * (5 + Math.random() * 8),
        y: head.y - dy * 0.5 + ny * side * (5 + Math.random() * 8),
        vx: nx * side * (25 + Math.random() * 45) - dx * 1.5,
        vy: ny * side * (25 + Math.random() * 45) - dy * 1.5,
        r: 2.2 + Math.random() * 3.5,
        life: 0.2 + Math.random() * 0.25,
        maxLife: 0.45,
      });
      this.dropletCooldown = 0.1 + Math.random() * 0.14;
    }
  }

  /** Capsule between two circles so the chain reads as one liquid stroke. */
  private drawCapsule(
    ctx: CanvasRenderingContext2D,
    a: Vec,
    ra: number,
    b: Vec,
    rb: number,
  ) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 0.001) return;
    const nx = -dy / dist;
    const ny = dx / dist;
    ctx.beginPath();
    ctx.moveTo(a.x + nx * ra, a.y + ny * ra);
    ctx.lineTo(b.x + nx * rb, b.y + ny * rb);
    ctx.lineTo(b.x - nx * rb, b.y - ny * rb);
    ctx.lineTo(a.x - nx * ra, a.y - ny * ra);
    ctx.closePath();
    ctx.fill();
  }

  private drawLiquid(ctx: CanvasRenderingContext2D) {
    const stretch = clamp(this.speed / MAX_SPEED, 0, 1);
    const moving = 1 - this.idleBlend;
    const shape = Math.max(stretch, 0.15) * moving;

    const head = this.nodes[0];

    // Always keep a soft head circle (idle resting blob behind the +)
    const idleR = lerp(HEAD_RADIUS * 0.9, IDLE_RADIUS, this.idleBlend);
    ctx.beginPath();
    ctx.arc(head.x, head.y, idleR, 0, Math.PI * 2);
    ctx.fill();

    if (moving < 0.08) return;

    const radii = this.nodes.map((_, i) =>
      nodeRadius(i, Math.max(shape, 0.2)),
    );
    // Ensure head of stroke matches the resting blob
    radii[0] = Math.max(radii[0], idleR);

    for (let i = 0; i < NODE_COUNT - 1; i++) {
      this.drawCapsule(
        ctx,
        this.nodes[i],
        radii[i],
        this.nodes[i + 1],
        radii[i + 1],
      );
    }
    for (let i = 1; i < NODE_COUNT; i++) {
      const n = this.nodes[i];
      ctx.beginPath();
      ctx.arc(n.x, n.y, radii[i], 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private draw() {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.width, this.height);
    if (!this.visible || this.overHit) return;

    ctx.fillStyle = "#ffffff";

    this.drawLiquid(ctx);

    for (const d of this.droplets) {
      const a = clamp(d.life / Math.max(d.maxLife, 0.01), 0, 1);
      ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}
