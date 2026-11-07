/* global importScripts, Cover */
// Draws the Disc off the main thread. Geometry as cover-code/pie.js. Any colours, on a ground or on nothing.
importScripts('/disc/light.js');

const TAU = 2 * Math.PI;
const mod = (a) => ((a % TAU) + TAU) % TAU;
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

let M, C, base, glow;

function init({ meta, colours, submitted, stops, range, ground, bloom }) {
	M = meta;
	const { S, T } = M,
		n = S * T;
	const d = new Uint8Array(colours);
	const ramp = submitted ? null : stops.map(hex);
	const at = (t) => {
		const u = Math.min(1, Math.max(0, t)) * (ramp.length - 1),
			i = Math.min(ramp.length - 2, Math.floor(u)),
			f = u - i;
		return [0, 1, 2].map((c) => ramp[i][c] * (1 - f) + ramp[i + 1][c] * f);
	};
	C = new Float32Array(n * 3);
	base = ground ? hex(ground) : null;
	glow = Boolean(bloom && base);
	for (let k = 0; k < S; k++) {
		const v = [0, 0, 0];
		for (let t = 0; t < T; t++) {
			const i = k * T + t;
			if (submitted) {
				for (let c = 0; c < 3; c++) {
					v[c] = (v[c] + d[c * n + i]) & 255;
					C[i * 3 + c] = v[c] / 255;
				}
			} else {
				v[0] = (v[0] + d[i]) & 255;
				// Brighter is a warmer prediction, so the map runs low to high with the emulator's main signal.
				C.set(at(range[0] + (v[0] / 255) * (range[1] - range[0])), i * 3);
			}
		}
	}
}

function render({ W, H, scale, cx, cy, id }) {
	const { T, geo: g, ray: S } = M,
		[s0, s1] = g.slices,
		ss = 2,
		inv = 1 / (ss * ss),
		n = W * H;
	const img = [0, 1, 2].map(() => new Float32Array(n));
	const alpha = new Float32Array(n);
	const reach = s1.ro + g.gap + g.rayLen,
		innermost = s0.ri;
	for (let py = 0; py < H; py++) {
		for (let px = 0; px < W; px++) {
			let r0 = 0,
				g0 = 0,
				b0 = 0,
				a0 = 0;
			for (let sy = 0; sy < ss; sy++) {
				const Y = (cy - py - (sy + 0.5) / ss) / scale;
				for (let sx = 0; sx < ss; sx++) {
					const X = (px + (sx + 0.5) / ss - cx) / scale;
					const far = Math.hypot(X, Y);
					if (far > reach || far < innermost) continue;
					const s = mod(Math.atan2(X, Y) - g.phi0) >= s1.start ? s1 : s0;
					const dx = X - s.shift[0],
						dy = Y - s.shift[1],
						r = Math.hypot(dx, dy);
					const th = mod(Math.atan2(dx, dy) - g.phi0) - s.start;
					if (th < 0 || th >= s.n * g.w) continue;
					const kl = Math.min(s.n - 1, Math.trunc(th / g.w)),
						k = s.k0 + kl;
					let a = 0,
						cr = 0,
						cg = 0,
						cb = 0;
					if (r >= s.ri && r <= s.ro) {
						const u = ((r - s.ri) / (s.ro - s.ri)) * (T - 1),
							t0 = Math.floor(u),
							t1 = Math.min(t0 + 1, T - 1),
							w = u - t0;
						const i0 = (k * T + t0) * 3,
							i1 = (k * T + t1) * 3;
						a = 1;
						cr = C[i0] * (1 - w) + C[i1] * w;
						cg = C[i0 + 1] * (1 - w) + C[i1 + 1] * w;
						cb = C[i0 + 2] * (1 - w) + C[i1 + 2] * w;
					} else {
						const d = r - (s.ro + g.gap);
						if (d >= 0 && d <= S[k] && Math.abs(th - (kl + 0.5) * g.w) * r <= g.rayW / 2) {
							const i = (k * T + T - 1) * 3;
							a = Math.exp(-d / g.rayFade);
							cr = C[i];
							cg = C[i + 1];
							cb = C[i + 2];
						}
					}
					r0 += cr * a;
					g0 += cg * a;
					b0 += cb * a;
					a0 += a;
				}
			}
			const i = py * W + px,
				A = a0 * inv;
			alpha[i] = A;
			if (base) {
				img[0][i] = base[0] * (1 - A) + r0 * inv;
				img[1][i] = base[1] * (1 - A) + g0 * inv;
				img[2][i] = base[2] * (1 - A) + b0 * inv;
			} else if (a0 > 0) {
				img[0][i] = r0 / a0;
				img[1][i] = g0 / a0;
				img[2][i] = b0 / a0;
			}
		}
	}
	if (glow) {
		// The cover's one bloom pass. Only what stands above the ground glows, so the ground still matches the page.
		const above = img.map((p, c) => p.map((v) => Math.max(0, v - base[c])));
		const light = Cover.blur(above, W, H, M.bloom.sigma_in * scale);
		for (let c = 0; c < 3; c++) {
			for (let i = 0; i < n; i++) {
				img[c][i] = 1 - (1 - img[c][i]) * (1 - Math.min(1, light[c][i] * M.bloom.strength));
			}
		}
	}
	const rgba = Cover.toRGBA(img, W, H);
	if (!base) for (let i = 0; i < n; i++) rgba[i * 4 + 3] = Math.round(alpha[i] * 255);
	postMessage({ W, H, buf: rgba.buffer, scale, cx, cy, id }, [rgba.buffer]);
}

onmessage = ({ data }) => (data.meta ? init(data) : render(data));
