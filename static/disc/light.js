/*
 * Additive light canvas: a port of cover_art.Light (pipeline/08_plotting/cover_art.py).
 *
 * Lines are densified to half-pixel steps and splatted bilinearly into float accumulators, so overlaps add
 * like light. expose() blurs to the stroke width, adds bloom (Gaussian glows) and tone-maps with 1 - exp(-k x);
 * with exposure = null, k is chosen so a percentile of the lit pixels lands at a target brightness.
 * Coordinates are page inches, origin bottom-left (as in the Python).
 *
 * Runs in the browser (window.Cover) and in node (globalThis.Cover) for testing.
 */
(function (root) {
  "use strict";
  const Cover = root.Cover || (root.Cover = {});

  function hexToRgb(h) {
    h = h.replace("#", "");
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  }

  // matplotlib-style lookup into a 256-entry ramp (x clipped to [0, 1]; x == 1 takes the last entry)
  function rampColor(lut, x) {
    const n = lut.length;
    const i = Math.min(n - 1, Math.max(0, Math.floor(Math.min(1, Math.max(0, x)) * n)));
    return lut[i];
  }

  const soft = (v, limit) => limit * Math.tanh(v / limit);

  // Python's round(): half to even (used where the Python placed images by pixel)
  function pyRound(v) {
    const f = Math.floor(v), d = v - f;
    if (d > 0.5) return f + 1;
    if (d < 0.5) return f;
    return f % 2 === 0 ? f : f + 1;
  }

  // numpy percentile (linear) of an unsorted Float32Array
  function percentile(a, q) {
    const s = Float32Array.from(a).sort();
    const pos = (s.length - 1) * q / 100, lo = Math.floor(pos), hi = Math.min(lo + 1, s.length - 1);
    return s[lo] + (s[hi] - s[lo]) * (pos - lo);
  }

  // ------------------------------------------------------------------
  // Gaussian blur, as scipy.ndimage.gaussian_filter (truncate 4, mode "reflect").
  // Exact separable convolution up to sigma 8 px; wider glows are blurred on a box-downsampled copy and
  // upsampled bilinearly (total variance matched), which keeps page-sized blooms fast in the browser.
  // ------------------------------------------------------------------
  function kernel(sigma) {
    const rad = Math.floor(4 * sigma + 0.5), k = new Float64Array(2 * rad + 1);
    let s = 0;
    for (let i = -rad; i <= rad; i++) { k[i + rad] = Math.exp(-0.5 * i * i / (sigma * sigma)); s += k[i + rad]; }
    for (let i = 0; i < k.length; i++) k[i] /= s;
    return k;
  }

  const reflect = (i, n) => {
    while (i < 0 || i >= n) i = i < 0 ? -i - 1 : 2 * n - i - 1;
    return i;
  };

  function convolve(src, W, H, k, horizontal) {
    const rad = (k.length - 1) >> 1, n = horizontal ? W : H, m = horizontal ? H : W;
    const out = new Float32Array(W * H), line = new Float64Array(n + 2 * rad);
    for (let j = 0; j < m; j++) {
      const base = horizontal ? j * W : j, stride = horizontal ? 1 : W;
      for (let i = -rad; i < n + rad; i++) line[i + rad] = src[base + reflect(i, n) * stride];
      for (let i = 0; i < n; i++) {
        let acc = 0;
        for (let t = 0; t < k.length; t++) acc += k[t] * line[i + t];
        out[base + i * stride] = acc;
      }
    }
    return out;
  }

  function blurExact(p, W, H, sigma) {
    const k = kernel(sigma);
    return convolve(convolve(p, W, H, k, false), W, H, k, true);   // scipy order: axis 0 (rows) then axis 1
  }

  function blurPlane(p, W, H, sigma) {
    if (sigma <= 8) return blurExact(p, W, H, sigma);
    const f = Math.floor(sigma / 4), w = Math.ceil(W / f), h = Math.ceil(H / f);
    const small = new Float32Array(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let s = 0, c = 0;
        for (let yy = y * f; yy < Math.min(H, y * f + f); yy++)
          for (let xx = x * f; xx < Math.min(W, x * f + f); xx++) { s += p[yy * W + xx]; c++; }
        small[y * w + x] = s / c;
      }
    }
    const b = blurExact(small, w, h, Math.sqrt(sigma * sigma - (f * f - 1) / 4) / f);
    const out = new Float32Array(W * H);
    for (let y = 0; y < H; y++) {
      const ys = Math.min(h - 1, Math.max(0, (y + 0.5) / f - 0.5)), y0 = Math.floor(ys), y1 = Math.min(h - 1, y0 + 1), fy = ys - y0;
      for (let x = 0; x < W; x++) {
        const xs = Math.min(w - 1, Math.max(0, (x + 0.5) / f - 0.5)), x0 = Math.floor(xs), x1 = Math.min(w - 1, x0 + 1), fx = xs - x0;
        out[y * W + x] = (b[y0 * w + x0] * (1 - fx) + b[y0 * w + x1] * fx) * (1 - fy) +
                         (b[y1 * w + x0] * (1 - fx) + b[y1 * w + x1] * fx) * fy;
      }
    }
    return out;
  }

  const blur = (planes, W, H, sigma) => planes.map((p) => blurPlane(p, W, H, sigma));

  // ------------------------------------------------------------------
  // The light canvas
  // ------------------------------------------------------------------
  class Light {
    constructor(dpi, w = 8.5, h = 11.0) {
      this.dpi = dpi; this.w = w; this.h = h;
      this.W = Math.round(w * dpi); this.H = Math.round(h * dpi);
    }

    new() { return [0, 1, 2].map(() => new Float32Array(this.W * this.H)); }

    /* lines: iterable of {x, y, color} with color [r, g, b] or per-vertex [[r, g, b], ...] */
    draw(acc, lines, weight = 1.0, step = 0.5) {
      const { dpi, h, W, H } = this;
      const [A0, A1, A2] = acc;
      const splat = (px, py, w, r, g, b) => {
        const x0 = Math.floor(px), y0 = Math.floor(py), fx = px - x0, fy = py - y0;
        const put = (xi, yi, cw) => {
          if (xi < 0 || xi >= W || yi < 0 || yi >= H) return;
          const i = yi * W + xi, ww = w * cw;
          A0[i] += ww * r; A1[i] += ww * g; A2[i] += ww * b;
        };
        put(x0, y0, (1 - fx) * (1 - fy)); put(x0 + 1, y0, fx * (1 - fy));
        put(x0, y0 + 1, (1 - fx) * fy); put(x0 + 1, y0 + 1, fx * fy);
      };
      for (const ln of lines) {
        const { x, y, color } = ln, perVertex = Array.isArray(color[0]);
        for (let i = 0; i < x.length - 1; i++) {
          const px0 = x[i] * dpi, py0 = (h - y[i]) * dpi, dx = x[i + 1] * dpi - px0, dy = (h - y[i + 1]) * dpi - py0;
          const L = Math.hypot(dx, dy), k = Math.max(1, Math.ceil(L / step)), w = L / k * weight;
          if (w === 0) continue;
          const c0 = perVertex ? color[i] : color, c1 = perVertex ? color[i + 1] : color;
          for (let j = 0; j < k; j++) {
            const t = j / k;
            splat(px0 + t * dx, py0 + t * dy, w,
              c0[0] * (1 - t) + c1[0] * t, c0[1] * (1 - t) + c1[1] * t, c0[2] * (1 - t) + c1[2] * t);
          }
        }
      }
    }

    expose(acc, widthPt = 0.6, exposure = null, glow = [], auto = [99.0, 0.85], gain = 1.0) {
      const { W, H, dpi } = this, n = W * H;
      const s = Math.max(0.5, widthPt / 72 * dpi / 2.355), norm = Math.sqrt(2 * Math.PI) * s;
      const lin = blur(acc, W, H, s).map((p) => { for (let i = 0; i < n; i++) p[i] *= norm; return p; });
      const out = lin.map((p) => Float32Array.from(p));
      for (const [sigmaIn, strength] of glow) {
        const g = blur(lin, W, H, sigmaIn * dpi);
        for (let c = 0; c < 3; c++) for (let i = 0; i < n; i++) out[c][i] += strength * g[c][i];
      }
      if (exposure === null) {
        const lum = new Float32Array(n);
        let mx = 0;
        for (let i = 0; i < n; i++) { lum[i] = Math.max(out[0][i], out[1][i], out[2][i]); if (lum[i] > mx) mx = lum[i]; }
        const lit = lum.filter((v) => v > 1e-3 * mx);
        exposure = -Math.log(1 - auto[1]) / percentile(lit, auto[0]);
      }
      const k = exposure * gain;
      for (let c = 0; c < 3; c++) for (let i = 0; i < n; i++) out[c][i] = 1 - Math.exp(-k * out[c][i]);
      return out;
    }

    blank(hex) {
      const c = hexToRgb(hex);
      return c.map((v) => new Float32Array(this.W * this.H).fill(v));
    }
  }

  function screen(...layers) {
    const n = layers[0][0].length, out = [0, 1, 2].map(() => new Float32Array(n));
    for (const L of layers) for (let c = 0; c < 3; c++) for (let i = 0; i < n; i++) out[c][i] = 1 - (1 - out[c][i]) * (1 - L[c][i]);
    return out;
  }

  function vignette(img, W, H, strength = 0.35) {           // toward black, as cover_art.vignette
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const r = Math.hypot((x / W - 0.5) / 0.5, (y / H - 0.5) / 0.5) / Math.SQRT2;
        const a = Math.min(1, Math.max(0, strength * r * r)), i = y * W + x;
        for (let c = 0; c < 3; c++) img[c][i] *= 1 - a;
      }
    }
    return img;
  }

  // float planes in [0, 1] -> RGBA bytes
  function toRGBA(img, W, H) {
    const out = new Uint8ClampedArray(W * H * 4);
    for (let i = 0; i < W * H; i++) {
      out[4 * i] = Math.round(Math.min(1, Math.max(0, img[0][i])) * 255);
      out[4 * i + 1] = Math.round(Math.min(1, Math.max(0, img[1][i])) * 255);
      out[4 * i + 2] = Math.round(Math.min(1, Math.max(0, img[2][i])) * 255);
      out[4 * i + 3] = 255;
    }
    return out;
  }

  Object.assign(Cover, { hexToRgb, rampColor, soft, pyRound, percentile, blur, blurPlane, Light, screen, vignette, toRGBA });
})(typeof window !== "undefined" ? window : globalThis);
