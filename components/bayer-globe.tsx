'use client';

import * as React from 'react';
import { useEffect, useRef } from 'react';

// grade de dithering ordenado 8x8 - distribui os valores pra parecer textura, nao ruido aleatorio
const BAYER8 = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36,
  14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41,
  51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55,
  23, 61, 29, 53, 21,
];

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function noise2(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return (a + (b - a) * u) * (1 - v) + (c + (d - c) * u) * v;
}

function fbm(x: number, y: number) {
  let v = 0;
  let amp = 0.5;
  let fx = x;
  let fy = y;
  for (let i = 0; i < 3; i++) {
    v += noise2(fx, fy) * amp;
    fx *= 2.03;
    fy *= 2.01;
    amp *= 0.5;
  }
  return v;
}

function parseHex(hex: string) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

export function BayerGlobe({
  colorA = '#000000',
  colorB = '#FFE500',
  pixel = 14,
  land = 0.5,
  globeSize = 0.2,
  speed = 0.5,
}: {
  colorA?: string;
  colorB?: string;
  pixel?: number;
  land?: number;
  globeSize?: number;
  speed?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.imageRendering = 'pixelated';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const buffer = document.createElement('canvas');
    const bufferCtx = buffer.getContext('2d');
    if (!bufferCtx) return;

    let frameId = 0;
    let time = 0;
    let lastT = performance.now();
    let width = 0;
    let height = 0;
    let bw = 0;
    let bh = 0;
    let image: ImageData | null = null;

    function resize() {
      width = container!.clientWidth;
      height = container!.clientHeight;
      canvas.width = width;
      canvas.height = height;
      bw = Math.max(16, Math.round(width / pixel));
      bh = Math.max(16, Math.round(height / pixel));
      buffer.width = bw;
      buffer.height = bh;
      image = bufferCtx!.createImageData(bw, bh);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const dark = parseHex(colorA);
    const light = parseHex(colorB);

    function step() {
      frameId = requestAnimationFrame(step);
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;
      time += dt;
      if (!image) return;

      const data = image.data;
      const cx = bw * 0.5;
      const cy = bh * 0.5;
      const R = Math.min(bw, bh) * globeSize;
      const spin = time * speed * 3;
      const lx = -0.35;
      const ly = -0.28;
      const lz = 0.9;
      const ditherShift = Math.floor(time * speed * 8);

      for (let y = 0; y < bh; y++) {
        for (let x = 0; x < bw; x++) {
          const dx = x - cx;
          const dy = y - cy;
          const rr = Math.sqrt(dx * dx + dy * dy);
          let v: number;

          if (rr < R) {
            const nx = dx / R;
            const ny = dy / R;
            const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
            const lam = Math.max(0, nx * lx + ny * ly + nz * lz);
            const lon = Math.atan2(nx, nz) + spin;
            const lat = Math.asin(Math.max(-1, Math.min(1, ny)));
            const isLand = fbm(lon * 1.6 + 10, lat * 2.2 + 5) > land;
            v = lam * (isLand ? 0.95 : 0.5);
          } else {
            v = 0;
          }

          const m = BAYER8[((y + ditherShift) & 7) * 8 + ((x + ditherShift) & 7)] / 64 - 0.5;
          let idx = Math.round(v * 3 + m);
          idx = Math.max(0, Math.min(3, idx));
          const f = idx / 3;

          const i = (y * bw + x) * 4;
          data[i] = dark[0] + (light[0] - dark[0]) * f;
          data[i + 1] = dark[1] + (light[1] - dark[1]) * f;
          data[i + 2] = dark[2] + (light[2] - dark[2]) * f;
          data[i + 3] = 255;
        }
      }

      bufferCtx!.putImageData(image, 0, 0);
      ctx!.imageSmoothingEnabled = false;
      ctx!.drawImage(buffer, 0, 0, width, height);
    }

    step();

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      container.removeChild(canvas);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}