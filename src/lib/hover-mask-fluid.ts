/**
 * Standalone WebGL2 port of Framer University's HoverMaskReveal_prod
 * (Navier–Stokes density mask + simplex-noise edge). Inspected from
 * https://framerusercontent.com/modules/pIP4ac8zTz87P6m1yp8h/7DdgzQU08TZ91XlXJOlT/HoverMaskReveal_prod.js
 */

export type HoverMaskFluidConfig = {
  size: number;
  strength: number;
  returnTime: number;
  edgeGrain: number;
  swirl: number;
  parallaxEnabled: boolean;
  parallaxAmount: number;
  smoothing: number;
};

type GL = WebGL2RenderingContext;

type FBO = {
  framebuffer: WebGLFramebuffer;
  texture: WebGLTexture;
  width: number;
  height: number;
};

type Program = {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation | null>;
};

const VERT = `#version 300 es
in vec2 a_position;
in vec2 a_uv;
out vec2 vUv;
void main() {
  vUv = a_uv;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const SPLAT_VEL = `#version 300 es
precision highp float;
in vec2 vUv;
uniform vec2 u_point;
uniform vec2 u_splatColor;
uniform float u_radius;
uniform float u_aspectRatio;
uniform sampler2D u_target;
out vec4 fragColor;
void main() {
  vec2 p = vUv - u_point;
  p.x *= max(u_aspectRatio, 1.0);
  p.y *= max(1.0 / u_aspectRatio, 1.0);
  float splat = exp(-dot(p, p) / (u_radius * u_radius));
  vec4 base = texture(u_target, vUv);
  base.xy += splat * u_splatColor;
  fragColor = base;
}
`;

const SPLAT_DENSITY = `#version 300 es
precision highp float;
in vec2 vUv;
uniform vec2 u_point;
uniform float u_radius;
uniform float u_aspectRatio;
uniform float u_densityAmount;
uniform sampler2D u_target;
out vec4 fragColor;
void main() {
  vec2 p = vUv - u_point;
  p.x *= max(u_aspectRatio, 1.0);
  p.y *= max(1.0 / u_aspectRatio, 1.0);
  float splat = exp(-dot(p, p) / (u_radius * u_radius));
  float base = texture(u_target, vUv).r;
  fragColor = vec4(base + splat * u_densityAmount, 0.0, 0.0, 1.0);
}
`;

const ADVECT = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D u_velocity;
uniform sampler2D u_source;
uniform vec2 u_texelSize;
uniform float u_dt;
uniform float u_dissipationMultiply;
out vec4 fragColor;
void main() {
  vec2 vel = texture(u_velocity, vUv).xy;
  vec2 pos = vUv - vel * u_texelSize * u_dt;
  fragColor = texture(u_source, pos) * u_dissipationMultiply;
}
`;

const DIVERGENCE = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D u_velocity;
uniform vec2 u_texelSize;
out vec4 fragColor;
void main() {
  float L = texture(u_velocity, vUv - vec2(u_texelSize.x, 0.0)).x;
  float R = texture(u_velocity, vUv + vec2(u_texelSize.x, 0.0)).x;
  float T = texture(u_velocity, vUv + vec2(0.0, u_texelSize.y)).y;
  float B = texture(u_velocity, vUv - vec2(0.0, u_texelSize.y)).y;
  float div = 0.5 * ((R - L) + (T - B));
  fragColor = vec4(div, 0.0, 0.0, 1.0);
}
`;

const PRESSURE = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D u_pressure;
uniform sampler2D u_divergence;
uniform vec2 u_texelSize;
out vec4 fragColor;
void main() {
  float L = texture(u_pressure, vUv - vec2(u_texelSize.x, 0.0)).r;
  float R = texture(u_pressure, vUv + vec2(u_texelSize.x, 0.0)).r;
  float T = texture(u_pressure, vUv + vec2(0.0, u_texelSize.y)).r;
  float B = texture(u_pressure, vUv - vec2(0.0, u_texelSize.y)).r;
  float C = texture(u_divergence, vUv).r;
  float p = (L + R + T + B - C) * 0.25;
  fragColor = vec4(p, 0.0, 0.0, 1.0);
}
`;

const CURL = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D u_velocity;
uniform vec2 u_texelSize;
uniform float u_curl;
out vec4 fragColor;
void main() {
  float vL = texture(u_velocity, vUv - vec2(u_texelSize.x, 0.0)).y;
  float vR = texture(u_velocity, vUv + vec2(u_texelSize.x, 0.0)).y;
  float vT = texture(u_velocity, vUv + vec2(0.0, u_texelSize.y)).x;
  float vB = texture(u_velocity, vUv - vec2(0.0, u_texelSize.y)).x;
  vec2 vel = texture(u_velocity, vUv).xy;
  float strength = u_curl * 0.00015;
  vel.x += strength * (vT - vB);
  vel.y += strength * (vL - vR);
  fragColor = vec4(vel, 0.0, 1.0);
}
`;

const GRADIENT = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D u_velocity;
uniform sampler2D u_pressure;
uniform vec2 u_texelSize;
out vec4 fragColor;
void main() {
  float L = texture(u_pressure, vUv - vec2(u_texelSize.x, 0.0)).r;
  float R = texture(u_pressure, vUv + vec2(u_texelSize.x, 0.0)).r;
  float T = texture(u_pressure, vUv + vec2(0.0, u_texelSize.y)).r;
  float B = texture(u_pressure, vUv - vec2(0.0, u_texelSize.y)).r;
  vec2 vel = texture(u_velocity, vUv).xy;
  vel.x -= 0.5 * (R - L);
  vel.y -= 0.5 * (T - B);
  fragColor = vec4(vel, 0.0, 1.0);
}
`;

const DISPLAY = `#version 300 es
precision highp float;
in vec2 vUv;
uniform float u_time;
uniform float u_progress;
uniform vec2 u_planeRes;
uniform float u_circleBoost;
uniform float u_noiseFreq;
uniform float u_noiseStrength;
uniform float u_noiseSize;
uniform float u_timeSpeed;
uniform sampler2D u_revealImage;
uniform float u_imageAspect;
uniform float u_containerAspect;
uniform vec2 u_parallaxOffset;
uniform float u_parallaxMax;
uniform sampler2D u_densityTex;
uniform float u_spill;
out vec4 fragColor;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
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
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  vec2 uv = vUv;
  float density = texture(u_densityTex, uv).r * u_circleBoost * u_progress;
  float offx = uv.x + (u_time * u_timeSpeed * 0.1) + sin(uv.y + u_time * u_timeSpeed * 0.1);
  float offy = uv.y - cos(u_time * u_timeSpeed * 0.001) * 0.01;
  float effectiveNoiseFreq = u_noiseFreq / max(u_noiseSize, 0.001);
  float n1 = snoise(vec3(offx * effectiveNoiseFreq, offy * effectiveNoiseFreq, u_time * u_timeSpeed)) - 1.0;
  float n2 = snoise(vec3(offx * effectiveNoiseFreq * 0.5, offy * effectiveNoiseFreq * 0.5, u_time * u_timeSpeed * 0.7)) - 1.0;
  float n = (n1 + n2 * 0.5) * 0.7;
  float finalMask = smoothstep(0.35, 0.55, (n * u_noiseStrength) + pow(density, 1.5));

  vec2 responsiveUV = uv;
  if (u_imageAspect > 0.0 && u_containerAspect > 0.0) {
    if (u_imageAspect > u_containerAspect) {
      float scale = u_imageAspect / u_containerAspect;
      responsiveUV.x = (uv.x - 0.5) / scale + 0.5;
    } else {
      float scale = u_containerAspect / u_imageAspect;
      responsiveUV.y = uv.y / scale;
    }
  }

  vec2 inset = u_parallaxMax / max(u_planeRes, vec2(1.0));
  vec2 baseUV = inset + responsiveUV * (1.0 - 2.0 * inset);
  vec2 parallaxUV = u_parallaxOffset / max(u_planeRes, vec2(1.0));
  vec2 sampleUV = clamp(baseUV + parallaxUV, vec2(0.0), vec2(1.0));

  if (u_spill > 0.5) {
    fragColor = vec4(vec3(0.914, 0.918, 0.886), finalMask);
    return;
  }

  vec4 revealColor = texture(u_revealImage, sampleUV);
  float outAlpha = revealColor.a * finalMask;
  if (outAlpha < 0.01) outAlpha = 0.0;
  fragColor = vec4(revealColor.rgb, outAlpha);
}
`;

const TIME_SPEED = 5;
const SIM_SCALE = 0.5;
const PRESSURE_ITERS = 25;
const PROGRESS_LERP = 0.08;

function mapCircleBoost(value: number) {
  return 0.5 + value * 3.5;
}

function mapTexture(value: number) {
  const grain = Math.max(0, Math.min(1, value));
  return {
    freq: 2 + grain * 12,
    strength: grain * 3,
    size: 1 - grain * 0.7,
  };
}

function mapTimeSpeed(value: number) {
  return value * 0.1;
}

function compileShader(gl: GL, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(info || "Shader compile failed");
  }
  return shader;
}

function createProgram(gl: GL, frag: string, uniformNames: string[]): Program {
  const program = gl.createProgram();
  if (!program) throw new Error("Unable to create program");
  const vs = compileShader(gl, gl.VERTEX_SHADER, VERT);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, frag);
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.bindAttribLocation(program, 0, "a_position");
  gl.bindAttribLocation(program, 1, "a_uv");
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(info || "Program link failed");
  }
  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  for (const name of uniformNames) {
    uniforms[name] = gl.getUniformLocation(program, name);
  }
  return { program, uniforms };
}

function createFBO(gl: GL, width: number, height: number, internalFormat: number, type: number): FBO {
  const texture = gl.createTexture();
  const framebuffer = gl.createFramebuffer();
  if (!texture || !framebuffer) throw new Error("Unable to create FBO");

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, gl.RGBA, type, null);

  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindTexture(gl.TEXTURE_2D, null);

  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    gl.deleteTexture(texture);
    gl.deleteFramebuffer(framebuffer);
    throw new Error("Framebuffer incomplete");
  }

  return { framebuffer, texture, width, height };
}

function deleteFBO(gl: GL, target: FBO | null) {
  if (!target) return;
  gl.deleteTexture(target.texture);
  gl.deleteFramebuffer(target.framebuffer);
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load ${src}`));
    image.src = src;
  });
}

export class HoverMaskFluid {
  private gl: GL | null = null;
  private config: HoverMaskFluidConfig;
  private disposed = false;
  private lost = false;
  private hoverActive = false;
  private settleUntil = 0;
  private animating = false;
  private raf = 0;
  private lastTime = 0;
  private time = 0;
  private progress = 0;
  private targetProgress = 0;
  private mouseX = 0.5;
  private mouseY = 0.5;
  private followX = 0.5;
  private followY = 0.5;
  private lastMouseX = 0.5;
  private lastMouseY = 0.5;
  private parallaxX = 0;
  private parallaxY = 0;
  private targetParallaxX = 0;
  private targetParallaxY = 0;
  private imageAspect = 1;
  private simWidth = 1;
  private simHeight = 1;
  private usingFloat = true;
  private intersecting = true;
  private pageVisible = true;
  private reducedMotion = false;

  private splatVel: Program | null = null;
  private splatDensity: Program | null = null;
  private advect: Program | null = null;
  private divergence: Program | null = null;
  private pressure: Program | null = null;
  private curl: Program | null = null;
  private gradient: Program | null = null;
  private display: Program | null = null;

  private vel0: FBO | null = null;
  private vel1: FBO | null = null;
  private density0: FBO | null = null;
  private density1: FBO | null = null;
  private div: FBO | null = null;
  private pressure0: FBO | null = null;
  private pressure1: FBO | null = null;
  private revealTexture: WebGLTexture | null = null;

  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private spill: HTMLCanvasElement | null = null;
  private spillCtx: CanvasRenderingContext2D | null = null;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly container: HTMLElement,
    private readonly backImage: string,
    config: HoverMaskFluidConfig,
  ) {
    this.config = config;
  }

  async start() {
    try {
      return await this.initialize();
    } catch {
      this.clearCanvas();
      return false;
    }
  }

  private async initialize() {
    const gl = this.canvas.getContext("webgl2", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    if (!gl) return false;
    this.gl = gl;

    const ext = gl.getExtension("EXT_color_buffer_float");
    this.usingFloat = Boolean(ext);
    gl.getExtension("EXT_float_blend");
    gl.getExtension("OES_texture_float_linear");

    this.splatVel = createProgram(gl, SPLAT_VEL, [
      "u_point",
      "u_splatColor",
      "u_radius",
      "u_aspectRatio",
      "u_target",
    ]);
    this.splatDensity = createProgram(gl, SPLAT_DENSITY, [
      "u_point",
      "u_radius",
      "u_aspectRatio",
      "u_densityAmount",
      "u_target",
    ]);
    this.advect = createProgram(gl, ADVECT, [
      "u_velocity",
      "u_source",
      "u_texelSize",
      "u_dt",
      "u_dissipationMultiply",
    ]);
    this.divergence = createProgram(gl, DIVERGENCE, ["u_velocity", "u_texelSize"]);
    this.pressure = createProgram(gl, PRESSURE, [
      "u_pressure",
      "u_divergence",
      "u_texelSize",
    ]);
    this.curl = createProgram(gl, CURL, ["u_velocity", "u_texelSize", "u_curl"]);
    this.gradient = createProgram(gl, GRADIENT, [
      "u_velocity",
      "u_pressure",
      "u_texelSize",
    ]);
    this.display = createProgram(gl, DISPLAY, [
      "u_time",
      "u_progress",
      "u_planeRes",
      "u_circleBoost",
      "u_noiseFreq",
      "u_noiseStrength",
      "u_noiseSize",
      "u_timeSpeed",
      "u_revealImage",
      "u_imageAspect",
      "u_containerAspect",
      "u_parallaxOffset",
      "u_parallaxMax",
      "u_densityTex",
      "u_spill",
    ]);

    const vao = gl.createVertexArray();
    const buffer = gl.createBuffer();
    if (!vao || !buffer) return false;
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1, 1, 1, 1, 1,
      ]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);

    try {
      const image = await loadImage(this.backImage);
      if (this.disposed) return false;
      this.imageAspect = image.width / Math.max(1, image.height);
      this.revealTexture = gl.createTexture();
      if (!this.revealTexture) return false;
      gl.bindTexture(gl.TEXTURE_2D, this.revealTexture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    } catch {
      return false;
    }

    this.resize();
    this.bindEvents();
    this.clearCanvas();
    return true;
  }

  setConfig(config: HoverMaskFluidConfig) {
    this.config = config;
  }

  /** Same fluid circle, drawn behind the portrait as the gray outside the body. */
  attachSpill(canvas: HTMLCanvasElement | null) {
    this.spill = canvas;
    this.spillCtx = canvas ? canvas.getContext("2d", { alpha: true }) : null;
    if (!canvas) return;
    this.copySpill();
  }

  setPointer(nx: number, ny: number) {
    this.mouseX = Math.max(0, Math.min(1, nx));
    this.mouseY = Math.max(0, Math.min(1, ny));
    if (this.config.parallaxEnabled) {
      const amount = Math.max(0, Math.min(200, this.config.parallaxAmount));
      this.targetParallaxX = Math.max(-amount, Math.min(amount, (this.mouseX - 0.5) * 2 * amount));
      this.targetParallaxY = Math.max(-amount, Math.min(amount, (this.mouseY - 0.5) * 2 * amount));
    }
    this.ensureLoop();
  }

  enter() {
    this.clearSim();
    this.hoverActive = true;
    this.settleUntil = Number.POSITIVE_INFINITY;
    this.targetProgress = 1;
    this.ensureLoop();
  }

  leave() {
    this.hoverActive = false;
    const returnMs = Math.max(0.5, Math.min(10, this.config.returnTime)) * 1000;
    this.settleUntil = performance.now() + returnMs + 250;
    this.targetProgress = 0;
    this.targetParallaxX = 0;
    this.targetParallaxY = 0;
    if (!this.config.parallaxEnabled || this.config.smoothing === 0) {
      this.parallaxX = 0;
      this.parallaxY = 0;
    }
    this.ensureLoop();
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.reducedMotionQuery?.removeEventListener("change", this.onReducedMotion);
    this.canvas.removeEventListener("webglcontextlost", this.onContextLost);
    this.canvas.removeEventListener("webglcontextrestored", this.onContextRestored);
    const gl = this.gl;
    if (!gl) return;
    deleteFBO(gl, this.vel0);
    deleteFBO(gl, this.vel1);
    deleteFBO(gl, this.density0);
    deleteFBO(gl, this.density1);
    deleteFBO(gl, this.div);
    deleteFBO(gl, this.pressure0);
    deleteFBO(gl, this.pressure1);
    if (this.revealTexture) gl.deleteTexture(this.revealTexture);
    const programs = [
      this.splatVel,
      this.splatDensity,
      this.advect,
      this.divergence,
      this.pressure,
      this.curl,
      this.gradient,
      this.display,
    ];
    for (const program of programs) {
      if (program) gl.deleteProgram(program.program);
    }
    this.gl = null;
  }

  private reducedMotionQuery: MediaQueryList | null = null;

  private bindEvents() {
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        this.intersecting = entries.some((entry) => entry.isIntersecting);
        if (this.intersecting) this.ensureLoop();
      },
      { root: null, rootMargin: "50px", threshold: 0.01 },
    );
    this.intersectionObserver.observe(this.container);

    this.pageVisible = document.visibilityState === "visible";
    document.addEventListener("visibilitychange", this.onVisibility);

    this.reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.reducedMotion = this.reducedMotionQuery.matches;
    this.reducedMotionQuery.addEventListener("change", this.onReducedMotion);

    this.canvas.addEventListener("webglcontextlost", this.onContextLost);
    this.canvas.addEventListener("webglcontextrestored", this.onContextRestored);
  }

  private onVisibility = () => {
    this.pageVisible = document.visibilityState === "visible";
    if (this.pageVisible) this.ensureLoop();
  };

  private onReducedMotion = () => {
    this.reducedMotion = Boolean(this.reducedMotionQuery?.matches);
    if (this.reducedMotion) {
      cancelAnimationFrame(this.raf);
      this.animating = false;
      this.clearCanvas();
    } else {
      this.ensureLoop();
    }
  };

  private onContextLost = (event: Event) => {
    event.preventDefault();
    this.lost = true;
    cancelAnimationFrame(this.raf);
    this.animating = false;
  };

  private onContextRestored = () => {
    this.lost = false;
  };

  private shouldAnimate() {
    return (
      !this.disposed &&
      !this.lost &&
      this.pageVisible &&
      this.intersecting &&
      !this.reducedMotion &&
      (this.hoverActive || performance.now() < this.settleUntil)
    );
  }

  private ensureLoop() {
    if (this.animating || !this.shouldAnimate()) return;
    this.lastTime = performance.now();
    this.animating = true;
    this.raf = requestAnimationFrame(this.frame);
  }

  private resize() {
    const gl = this.gl;
    if (!gl || this.disposed) return;
    const width = Math.max(2, Math.floor(this.container.clientWidth));
    const height = Math.max(2, Math.floor(this.container.clientHeight));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const bufferW = Math.max(2, Math.floor(width * dpr));
    const bufferH = Math.max(2, Math.floor(height * dpr));
    if (this.canvas.width !== bufferW || this.canvas.height !== bufferH) {
      this.canvas.width = bufferW;
      this.canvas.height = bufferH;
    }

    const simW = Math.max(1, Math.floor(width * SIM_SCALE));
    const simH = Math.max(1, Math.floor(height * SIM_SCALE));
    if (simW !== this.simWidth || simH !== this.simHeight || !this.vel0) {
      this.simWidth = simW;
      this.simHeight = simH;
      this.rebuildSimTargets();
      this.clearSim();
    }
  }

  private rebuildSimTargets() {
    const gl = this.gl;
    if (!gl) return;
    deleteFBO(gl, this.vel0);
    deleteFBO(gl, this.vel1);
    deleteFBO(gl, this.density0);
    deleteFBO(gl, this.density1);
    deleteFBO(gl, this.div);
    deleteFBO(gl, this.pressure0);
    deleteFBO(gl, this.pressure1);

    const make = () => {
      if (this.usingFloat) {
        return createFBO(gl, this.simWidth, this.simHeight, gl.RGBA16F, gl.HALF_FLOAT);
      }
      return createFBO(gl, this.simWidth, this.simHeight, gl.RGBA, gl.UNSIGNED_BYTE);
    };

    try {
      this.vel0 = make();
      this.vel1 = make();
      this.density0 = make();
      this.density1 = make();
      this.div = make();
      this.pressure0 = make();
      this.pressure1 = make();
    } catch {
      this.usingFloat = false;
      this.vel0 = make();
      this.vel1 = make();
      this.density0 = make();
      this.density1 = make();
      this.div = make();
      this.pressure0 = make();
      this.pressure1 = make();
    }
  }

  private clearSim() {
    const gl = this.gl;
    if (!gl) return;
    const targets = [
      this.vel0,
      this.vel1,
      this.density0,
      this.density1,
      this.div,
      this.pressure0,
      this.pressure1,
    ];
    gl.clearColor(0, 0, 0, 0);
    for (const target of targets) {
      if (!target) continue;
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
      gl.viewport(0, 0, target.width, target.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  private clearCanvas() {
    const gl = this.gl;
    if (!gl) return;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.clearSpill();
  }

  private clearSpill() {
    const ctx = this.spillCtx;
    const canvas = this.spill;
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  private copySpill() {
    const ctx = this.spillCtx;
    const canvas = this.spill;
    if (!ctx || !canvas) return;
    const width = this.canvas.width;
    const height = this.canvas.height;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(this.canvas, 0, 0);
  }

  private blit(program: Program, target: FBO | null, bind: (set: Program["uniforms"]) => void) {
    const gl = this.gl;
    if (!gl) return;
    gl.useProgram(program.program);
    if (target) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
      gl.viewport(0, 0, target.width, target.height);
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }
    bind(program.uniforms);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  private frame = (now: number) => {
    if (!this.shouldAnimate()) {
      this.animating = false;
      this.clearCanvas();
      return;
    }

    const dt = Math.min(0.05, (now - this.lastTime) / 1000 || 0.016);
    this.lastTime = now;
    this.time += dt;

    const smoothing = Math.max(0, Math.min(1, this.config.smoothing));
    if (smoothing === 0) {
      this.followX = this.mouseX;
      this.followY = this.mouseY;
    } else {
      const tau = 0.04 + smoothing * 0.21;
      const alpha = 1 - Math.exp(-dt / tau);
      this.followX += (this.mouseX - this.followX) * alpha;
      this.followY += (this.mouseY - this.followY) * alpha;
    }

    if (!this.config.parallaxEnabled) {
      this.parallaxX = 0;
      this.parallaxY = 0;
      this.targetParallaxX = 0;
      this.targetParallaxY = 0;
    } else if (smoothing === 0) {
      this.parallaxX = this.targetParallaxX;
      this.parallaxY = this.targetParallaxY;
    } else {
      const tau = 0.04 + smoothing * 0.21;
      const alpha = 1 - Math.exp(-dt / Math.max(1e-6, tau));
      this.parallaxX += (this.targetParallaxX - this.parallaxX) * alpha;
      this.parallaxY += (this.targetParallaxY - this.parallaxY) * alpha;
    }

    const mouseVelocityX = this.followX - this.lastMouseX;
    const mouseVelocityY = this.followY - this.lastMouseY;
    this.lastMouseX = this.followX;
    this.lastMouseY = this.followY;

    this.simulate(mouseVelocityX, mouseVelocityY);
    this.progress += (this.targetProgress - this.progress) * PROGRESS_LERP;
    this.drawDisplay();

    this.raf = requestAnimationFrame(this.frame);
  };

  private simulate(velX: number, velY: number) {
    const gl = this.gl;
    if (
      !gl ||
      !this.splatVel ||
      !this.splatDensity ||
      !this.advect ||
      !this.divergence ||
      !this.pressure ||
      !this.curl ||
      !this.gradient ||
      !this.vel0 ||
      !this.vel1 ||
      !this.density0 ||
      !this.density1 ||
      !this.div ||
      !this.pressure0 ||
      !this.pressure1
    ) {
      return;
    }

    const width = Math.max(2, this.container.clientWidth);
    const height = Math.max(2, this.container.clientHeight);
    const aspect = width / height;
    const texelX = 1 / this.simWidth;
    const texelY = 1 / this.simHeight;
    const splatRad = Math.max(0.005, this.config.size);
    const velDiss = Math.max(0.9, Math.min(1, 0.99));
    const T = Math.max(0.5, Math.min(10, this.config.returnTime));
    const denDiss = Math.pow(0.01, 1 / (60 * T));
    const swirl = Math.max(0, this.config.swirl);

    gl.disable(gl.BLEND);

    this.blit(this.splatVel, this.vel1, (u) => {
      gl.uniform2f(u.u_point, this.followX, this.followY);
      gl.uniform2f(u.u_splatColor, velX * 30, velY * 30);
      gl.uniform1f(u.u_radius, splatRad);
      gl.uniform1f(u.u_aspectRatio, aspect);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.vel0!.texture);
      gl.uniform1i(u.u_target, 0);
    });

    this.blit(this.splatDensity, this.density1, (u) => {
      gl.uniform2f(u.u_point, this.followX, this.followY);
      gl.uniform1f(u.u_radius, splatRad);
      gl.uniform1f(u.u_aspectRatio, aspect);
      gl.uniform1f(u.u_densityAmount, 1);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.density0!.texture);
      gl.uniform1i(u.u_target, 0);
    });

    this.blit(this.advect, this.vel0, (u) => {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.vel1!.texture);
      gl.uniform1i(u.u_velocity, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.vel1!.texture);
      gl.uniform1i(u.u_source, 1);
      gl.uniform2f(u.u_texelSize, texelX, texelY);
      gl.uniform1f(u.u_dt, 1);
      gl.uniform1f(u.u_dissipationMultiply, velDiss);
    });

    let velForDiv = this.vel0;
    if (swirl > 0) {
      this.blit(this.curl, this.vel1, (u) => {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.vel0!.texture);
        gl.uniform1i(u.u_velocity, 0);
        gl.uniform2f(u.u_texelSize, texelX, texelY);
        gl.uniform1f(u.u_curl, swirl);
      });
      velForDiv = this.vel1;
    }

    this.blit(this.divergence, this.div, (u) => {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velForDiv.texture);
      gl.uniform1i(u.u_velocity, 0);
      gl.uniform2f(u.u_texelSize, texelX, texelY);
    });

    let pressureRead = this.pressure0;
    let pressureWrite = this.pressure1;
    for (let i = 0; i < PRESSURE_ITERS; i += 1) {
      this.blit(this.pressure, pressureWrite, (u) => {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, pressureRead.texture);
        gl.uniform1i(u.u_pressure, 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.div!.texture);
        gl.uniform1i(u.u_divergence, 1);
        gl.uniform2f(u.u_texelSize, texelX, texelY);
      });
      const tmp = pressureRead;
      pressureRead = pressureWrite;
      pressureWrite = tmp;
    }

    const velForGradientRead = swirl > 0 ? this.vel1 : this.vel0;
    const velForGradientWrite = swirl > 0 ? this.vel0 : this.vel1;
    this.blit(this.gradient, velForGradientWrite, (u) => {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velForGradientRead.texture);
      gl.uniform1i(u.u_velocity, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, pressureRead.texture);
      gl.uniform1i(u.u_pressure, 1);
      gl.uniform2f(u.u_texelSize, texelX, texelY);
    });

    this.blit(this.advect, this.density0, (u) => {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velForGradientWrite.texture);
      gl.uniform1i(u.u_velocity, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.density1!.texture);
      gl.uniform1i(u.u_source, 1);
      gl.uniform2f(u.u_texelSize, texelX, texelY);
      gl.uniform1f(u.u_dt, 1);
      gl.uniform1f(u.u_dissipationMultiply, denDiss);
    });

    if (swirl <= 0) {
      const tmp = this.vel0;
      this.vel0 = this.vel1;
      this.vel1 = tmp;
    }
  }

  private drawDisplay() {
    const gl = this.gl;
    if (!gl || !this.display || !this.density0 || !this.revealTexture) return;

    const width = Math.max(2, this.container.clientWidth);
    const height = Math.max(2, this.container.clientHeight);
    const grain = mapTexture(this.config.edgeGrain);
    const parallaxMax = this.config.parallaxEnabled
      ? Math.max(0, Math.min(200, this.config.parallaxAmount))
      : 0;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const bindDisplay = (spill: boolean) => {
      const u = this.display!.uniforms;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(u.u_time, this.time);
      gl.uniform1f(u.u_progress, this.progress);
      gl.uniform2f(u.u_planeRes, width, height);
      gl.uniform1f(u.u_circleBoost, mapCircleBoost(this.config.strength));
      gl.uniform1f(u.u_noiseFreq, grain.freq);
      gl.uniform1f(u.u_noiseStrength, grain.strength);
      gl.uniform1f(u.u_noiseSize, grain.size);
      gl.uniform1f(u.u_timeSpeed, mapTimeSpeed(TIME_SPEED));
      gl.uniform1f(u.u_imageAspect, this.imageAspect);
      gl.uniform1f(u.u_containerAspect, width / height);
      gl.uniform2f(u.u_parallaxOffset, this.parallaxX, this.parallaxY);
      gl.uniform1f(u.u_parallaxMax, parallaxMax);
      gl.uniform1f(u.u_spill, spill ? 1 : 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.revealTexture);
      gl.uniform1i(u.u_revealImage, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.density0!.texture);
      gl.uniform1i(u.u_densityTex, 1);
    };

    if (this.spillCtx) {
      this.blit(this.display, null, () => bindDisplay(true));
      this.copySpill();
    }
    this.blit(this.display, null, () => bindDisplay(false));

    gl.disable(gl.BLEND);
  }
}
