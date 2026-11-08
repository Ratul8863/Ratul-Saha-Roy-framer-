const VERT = `#version 300 es
in vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_pointer;
uniform float u_influence;

vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0 / 7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float blob(vec2 p, vec2 c, vec2 radii, float ang) {
  vec2 d = p - c;
  float ca = cos(ang);
  float sa = sin(ang);
  d = vec2(ca * d.x + sa * d.y, -sa * d.x + ca * d.y);
  d /= max(radii, vec2(0.04));
  return exp(-dot(d, d));
}

float field(vec2 p, float t, vec2 ptr, float inf) {
  vec2 delta = p - ptr;
  float fall = exp(-dot(delta, delta) * 5.5) * inf;
  vec2 tang = vec2(-delta.y, delta.x);
  p += tang * fall * 0.2 - delta * fall * 0.07;

  float t1 = t * 0.11;
  float t2 = t * 0.083;
  vec2 q = p;
  q += vec2(
    snoise(vec3(p * 0.62, t1)),
    snoise(vec3(p * 0.62 + 4.1, t2))
  ) * 0.32;
  q += vec2(
    snoise(vec3(p * 1.15 - 1.7, t * 0.07)),
    snoise(vec3(p * 1.05 + 2.4, t * 0.064))
  ) * 0.14;

  float v = 0.0;
  v += 0.62 * blob(
    q,
    vec2(0.16 + 0.14 * sin(t * 0.17), 0.56 + 0.16 * cos(t * 0.13)),
    vec2(0.34 + 0.05 * sin(t * 0.09), 0.5 + 0.07 * cos(t * 0.11)),
    t * 0.07
  );
  v += 0.58 * blob(
    q,
    vec2(0.92 + 0.12 * cos(t * 0.12), 0.32 + 0.18 * sin(t * 0.15)),
    vec2(0.46 + 0.08 * cos(t * 0.08), 0.38 + 0.06 * sin(t * 0.1)),
    -t * 0.055 + 0.6
  );
  v += 0.42 * blob(
    q,
    vec2(0.58 + 0.2 * sin(t * 0.09 + 1.2), 0.08 + 0.1 * cos(t * 0.14)),
    vec2(0.4, 0.22 + 0.05 * sin(t * 0.12)),
    t * 0.04 + 1.1
  );
  v += 0.32 * blob(
    q,
    vec2(0.72 + 0.18 * cos(t * 0.1 + 0.4), 0.86 + 0.12 * sin(t * 0.08)),
    vec2(0.28, 0.34),
    -t * 0.06
  );
  v += 0.28 * blob(
    q,
    vec2(0.08 + 0.1 * sin(t * 0.14 + 2.1), 0.18 + 0.12 * cos(t * 0.1)),
    vec2(0.26, 0.3),
    t * 0.05 + 0.8
  );
  v += 0.2 * snoise(vec3(q * 1.35, t * 0.075));
  return v;
}

float iso(float v, float level) {
  float w = max(fwidth(v) * 1.25, 0.0022);
  return 1.0 - smoothstep(0.0, w, abs(v - level));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / max(u_res.y, 1.0);
  vec2 p = vec2(uv.x * aspect, uv.y);
  vec2 ptr = vec2(u_pointer.x * aspect, u_pointer.y);

  float t = u_time;
  float v = field(p, t, ptr, u_influence);

  float stroke = iso(v, 0.22) * 0.34;
  stroke = max(stroke, iso(v, 0.34) * 0.42);
  stroke = max(stroke, iso(v, 0.46) * 0.5);
  stroke = max(stroke, iso(v, 0.58) * 0.36);
  stroke = max(stroke, iso(v, 0.7) * 0.26);

  float a = clamp(stroke, 0.0, 1.0);
  vec3 lineCol = vec3(0.82, 0.825, 0.81);
  fragColor = vec4(lineCol * a, a);
}
`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create shader");
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? "shader compile failed";
    gl.deleteShader(shader);
    throw new Error(log);
  }
  return shader;
}

export class HeroFieldGL {
  private gl: WebGL2RenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private vao: WebGLVertexArrayObject | null = null;
  private raf = 0;
  private running = false;
  private reduced = false;
  private visible = true;
  private pageVisible = true;
  private origin = performance.now();
  private pointerX = 0.72;
  private pointerY = 0.45;
  private pointerTargetX = 0.72;
  private pointerTargetY = 0.45;
  private influence = 0;
  private targetInfluence = 0;
  private last = performance.now();
  private resizeObserver: ResizeObserver | null = null;
  private intersection: IntersectionObserver | null = null;
  private motionQuery: MediaQueryList | null = null;
  private uniforms: Record<string, WebGLUniformLocation | null> = {};

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly container: HTMLElement,
  ) {}

  start() {
    try {
      return this.initialize();
    } catch (error) {
      console.error("HeroFieldGL", error);
      return false;
    }
  }

  private initialize() {
    const gl = this.canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      powerPreference: "low-power",
    });
    if (!gl) {
      console.error("HeroFieldGL: webgl2 unavailable");
      return false;
    }
    this.gl = gl;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!program) return false;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.bindAttribLocation(program, 0, "a_pos");
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("HeroFieldGL link", gl.getProgramInfoLog(program));
      return false;
    }
    this.program = program;

    const buf = gl.createBuffer();
    const vao = gl.createVertexArray();
    if (!buf || !vao) return false;
    this.vao = vao;
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    this.uniforms = {
      u_res: gl.getUniformLocation(program, "u_res"),
      u_time: gl.getUniformLocation(program, "u_time"),
      u_pointer: gl.getUniformLocation(program, "u_pointer"),
      u_influence: gl.getUniformLocation(program, "u_influence"),
    };

    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.motionQuery.addEventListener("change", this.onMotion);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);
    this.resize();

    this.intersection = new IntersectionObserver(
      ([entry]) => {
        this.visible = Boolean(entry?.isIntersecting);
        this.syncLoop();
      },
      { root: null, rootMargin: "80px", threshold: 0.01 },
    );
    this.intersection.observe(this.container);
    document.addEventListener("visibilitychange", this.onVisibility);

    this.draw(0);
    this.syncLoop();
    return true;
  }

  setPointer(nx: number, ny: number, active: boolean) {
    this.pointerTargetX = nx;
    this.pointerTargetY = 1 - ny;
    this.targetInfluence = active ? 1 : 0;
    if (!this.running && this.shouldRun()) this.syncLoop();
  }

  dispose() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.resizeObserver?.disconnect();
    this.intersection?.disconnect();
    this.motionQuery?.removeEventListener("change", this.onMotion);
    document.removeEventListener("visibilitychange", this.onVisibility);
    const gl = this.gl;
    if (gl && this.program) gl.deleteProgram(this.program);
    this.gl = null;
    this.program = null;
  }

  private onMotion = (event: MediaQueryListEvent) => {
    this.reduced = event.matches;
    if (this.reduced) this.influence = 0;
    this.draw((performance.now() - this.origin) / 1000);
    this.syncLoop();
  };

  private onVisibility = () => {
    this.pageVisible = document.visibilityState !== "hidden";
    this.syncLoop();
  };

  private shouldRun() {
    return !this.reduced && this.visible && this.pageVisible;
  }

  private syncLoop() {
    if (this.shouldRun()) {
      if (!this.running) {
        this.running = true;
        this.last = performance.now();
        this.raf = requestAnimationFrame(this.frame);
      }
      return;
    }
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private resize() {
    const rect = this.container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(2, Math.round(rect.width * dpr));
    const h = Math.max(2, Math.round(rect.height * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.gl?.viewport(0, 0, w, h);
    if (!this.running) this.draw((performance.now() - this.origin) / 1000);
  }

  private frame = (now: number) => {
    if (!this.running) return;
    const dt = Math.min(0.05, (now - this.last) / 1000 || 0.016);
    this.last = now;
    const k = 1 - Math.exp(-dt / 0.28);
    this.influence += (this.targetInfluence - this.influence) * k;
    const kp = 1 - Math.exp(-dt / 0.08);
    this.pointerX += (this.pointerTargetX - this.pointerX) * kp;
    this.pointerY += (this.pointerTargetY - this.pointerY) * kp;
    this.draw((now - this.origin) / 1000);
    this.raf = requestAnimationFrame(this.frame);
  };

  private draw(time: number) {
    const gl = this.gl;
    const program = this.program;
    if (!gl || !program) return;
    gl.useProgram(program);
    gl.bindVertexArray(this.vao);
    gl.uniform2f(this.uniforms.u_res, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.uniforms.u_time, this.reduced ? 0 : time);
    gl.uniform2f(this.uniforms.u_pointer, this.pointerX, this.pointerY);
    gl.uniform1f(this.uniforms.u_influence, this.reduced ? 0 : this.influence);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}
