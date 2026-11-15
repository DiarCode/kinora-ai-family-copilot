"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type KinoraOrbProps = {
  size?: number;
  className?: string;
  animated?: boolean;
  glow?: boolean;
  label?: string;
};

const vertexShader = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;
varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amp * noise(p);
    p = p * 2.03 + vec2(17.0, 9.0);
    amp *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = (vUv - 0.5) * 2.0;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  uv.x *= aspect;

  float radius = 0.78;
  float dist = length(uv);
  float edge = smoothstep(radius, radius - 0.008, dist);

  vec3 color = vec3(0.0);
  float alpha = 0.0;

  if (dist < radius) {
    vec2 p = uv / radius;
    float z = sqrt(max(0.0, 1.0 - dot(p, p)));
    vec3 normal = vec3(p, z);

    vec3 deep = vec3(0.29, 0.12, 0.68);
    vec3 mid = vec3(0.51, 0.28, 0.92);
    vec3 lightPurple = vec3(0.83, 0.69, 1.0);
    vec3 highlight = vec3(0.97, 0.93, 1.0);

    vec3 lightDir = normalize(vec3(-0.5, 0.62, 0.6));
    float diffuse = clamp(dot(normal, lightDir), 0.0, 1.0);
    vec3 base = mix(deep, mid, smoothstep(0.0, 0.7, diffuse));
    base = mix(base, lightPurple, smoothstep(0.7, 1.0, diffuse) * 0.8);

    float bloom = smoothstep(0.72, 0.0, length(p - vec2(-0.22, 0.24)));
    base = mix(base, vec3(0.9, 0.81, 1.0), bloom * 0.5);

    float angle = atan(p.y, p.x);
    float swirlNoise = fbm(p * 2.15 + vec2(uTime * 0.035, -uTime * 0.02));
    float swirl = smoothstep(0.34, 0.8, swirlNoise + 0.22 * (1.0 - z));
    base = mix(base, vec3(0.38, 0.16, 0.75), swirl * 0.5);

    float bandCoord = (1.0 - z) * 3.0 + angle * 0.5 + fbm(p * 1.7 + uTime * 0.03) * 1.0;
    float bands = sin(bandCoord * 31.0 + uTime * 0.24);
    float ribbons = smoothstep(0.86, 0.99, bands);
    ribbons *= smoothstep(0.0, 0.4, 1.0 - z);
    ribbons *= smoothstep(-0.5, 0.35, p.x + p.y * 0.3);
    base = mix(base, vec3(0.95, 0.91, 1.0), ribbons * 0.55);

    float fineBands = sin(bandCoord * 63.0 + uTime * 0.16);
    float fineRibbons = smoothstep(0.92, 0.995, fineBands) * ribbons;
    base = mix(base, vec3(1.0, 0.97, 1.0), fineRibbons * 0.35);

    float depthShade = mix(0.68, 1.0, smoothstep(0.0, 0.65, z));
    base *= depthShade;

    float rim = smoothstep(radius * 0.82, radius, dist);
    base = mix(base, deep, rim * 0.45);

    float innerGlow = pow(max(0.0, 1.0 - z), 2.4);
    base += vec3(0.18, 0.1, 0.36) * innerGlow * 0.22;

    float specular = pow(max(dot(normal, normalize(vec3(-0.42, 0.6, 0.72))), 0.0), 80.0);
    base += highlight * specular * 0.5;

    float softSpec = pow(max(dot(normal, normalize(vec3(-0.25, 0.35, 0.9))), 0.0), 12.0);
    base += vec3(0.12, 0.08, 0.2) * softSpec;

    color = base;
    alpha = edge;
  }

  float halo = smoothstep(radius * 1.05, radius * 0.82, dist) * 0.16;
  color += vec3(0.68, 0.52, 1.0) * halo;
  alpha = max(alpha, halo * 0.65);

  gl_FragColor = vec4(color, alpha);
}
`;

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function OrbMark({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const id = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={cn("shrink-0", className)}
      role="img"
      aria-label="Kinora orb"
    >
      <defs>
        <radialGradient id={`${id}-g`} cx="33%" cy="24%" r="84%">
          <stop offset="0" stopColor="#f8f2ff" />
          <stop offset="0.28" stopColor="#d8c1fb" />
          <stop offset="0.62" stopColor="#a475f4" />
          <stop offset="1" stopColor="#5a2bc7" />
        </radialGradient>
        <radialGradient id={`${id}-s`} cx="42%" cy="48%" r="44%">
          <stop offset="0" stopColor="#5b28c4" stopOpacity="0.7" />
          <stop offset="1" stopColor="#5b28c4" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="19" fill={`url(#${id}-g)`} />
      <circle cx="20" cy="20" r="19" fill={`url(#${id}-s)`} />
      <g fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.8">
        <ellipse cx="21.5" cy="19" rx="16" ry="9" transform="rotate(-28 21.5 19)" />
        <ellipse cx="21.5" cy="19" rx="13.5" ry="7.5" transform="rotate(-28 21.5 19)" />
        <ellipse cx="21.5" cy="19" rx="11" ry="6" transform="rotate(-28 21.5 19)" />
        <ellipse cx="21.5" cy="19" rx="8.5" ry="4.5" transform="rotate(-28 21.5 19)" />
        <ellipse cx="21.5" cy="19" rx="6" ry="3.2" transform="rotate(-28 21.5 19)" />
      </g>
      <circle cx="14.8" cy="12.8" r="4.2" fill="rgba(255,255,255,0.28)" />
      <circle cx="20" cy="20" r="18.6" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
    </svg>
  );
}

export function KinoraOrb({
  size = 220,
  className,
  animated = true,
  glow = true,
  label = "Kinora orb",
}: KinoraOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [webgl, setWebgl] = useState(false);

  useEffect(() => {
    if (size < 80) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });
    if (!gl) return;

    const vertex = createShader(gl, gl.VERTEX_SHADER, vertexShader);
    const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    if (!vertex || !fragment) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const start = performance.now();
    let disposed = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      gl.uniform2f(uResolution, width, height);
    };

    const render = (time: number) => {
      if (disposed) return;
      resize();
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, animated && !reduced ? time / 1000 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (animated && !reduced) {
        frame = requestAnimationFrame(render);
      }
    };

    const observer = new ResizeObserver(() => {
      resize();
      if (!animated || reduced) render(performance.now());
    });
    observer.observe(canvas);

    setWebgl(true);
    if (animated && !reduced) {
      frame = requestAnimationFrame(render);
    } else {
      render(start);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteBuffer(buffer);
    };
  }, [size, animated]);

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label}
    >
      {glow ? (
        <div
          className="pointer-events-none absolute rounded-full orb-glow"
          style={{
            inset: `${-size * 0.36}px`,
          }}
        />
      ) : null}
      <div className="relative h-full w-full">
        <canvas
          ref={canvasRef}
          className={cn(
            "h-full w-full transition-opacity duration-500",
            webgl ? "opacity-100" : "opacity-0",
          )}
        />
        {!webgl ? <OrbMark size={size} className="absolute inset-0" /> : null}
      </div>
    </div>
  );
}
