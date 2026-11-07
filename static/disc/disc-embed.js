/* global CRAMERI */
// Puts the study's real Disc into any element. The element must have a size and a position other than static.
//
//   Disc.mount(element, {
//     colours: 'submitted',            // or any Crameri map name in crameri.js, e.g. 'batlow', or an array of hex stops
//     range: [0, 1],                   // part of the map to use: stop short of an end that would vanish into the page
//     ground: null,                    // null floats the Disc on whatever is behind it; or a hex colour, which enables glow
//     glow: false,                     // the cover's bloom; needs a ground; looks right on dark grounds
//     place: (w, h) => ({ r, cx, cy }),// outer radius and centre in CSS px, given the box. Default fits the box, centred
//     rotate: 0,                       // degrees clockwise
//     earth: { stroke, fill, width },  // the outline Earth; stroke defaults to currentColor. earth: false hides it
//     sweep: false,                    // open with the clockwise sweep, once (skipped under reduced motion)
//     reveal: undefined,               // a number 0..1 drives the same sweep by hand (e.g. from scroll):
//                                      // the art shows that share of a turn; set it later with handle.reveal(f)
//     earthZoom: 1,                    // 0 draws the outline Earth as large as the Disc's rim, 1 at its true
//                                      // size, in between in proportion; set it later with handle.earthZoom(t)
//     interactive: true,               // pointer and arrow keys pick a scenario and year
//     veil: 0.35,                      // how far the rest recedes while pointing, 0 for not at all
//     label: 'text for screen readers', // or false when the host element already names the art
//     onPoint: (info) => {},           // { label, year, emissions, peak, kind, series: [{ year, emissions }] } or null
//     onReady: () => {}                // the first render is on screen
//   });
//
// mount resolves to { ringFor(year), reveal(f), earthZoom(t), destroy() }. ringFor gives the CSS-px circle { cx, cy, r } at that year;
// destroy() stops the worker and the resize observer and removes the Disc's elements (call it on unmount).
// Disc.scenarios() resolves to all 357: [{ label, kind, peak, series: [{ year, emissions }] }], real GtCO2/yr, every 5 years.
// Elements inside the box have classes disc-art, disc-earth and disc-over, for CSS masks, reveals and so on.
//
// The art is only ever shifted and scaled uniformly, so it is a true circle at every moment of a resize.
(() => {
	const DATA = '/disc/data/';
	const TAU = 2 * Math.PI;
	const mod = (a) => ((a % TAU) + TAU) % TAU;
	const fetched = {};
	const bin = (name) => (fetched[name] ??= fetch(DATA + name).then((r) => r.arrayBuffer()));
	const json = () => (fetched.meta ??= fetch(DATA + 'meta.json').then((r) => r.json()));
	const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
	const DEFAULT_LABEL =
		'A disc of 357 CO₂-only emission scenarios radiating from an outline of the Earth: 7 standard in a slice set apart, 350 optimized in the ring.';

	async function mount(el, options = {}) {
		const o = {
			colours: 'submitted',
			range: [0, 1],
			ground: null,
			glow: false,
			rotate: 0,
			sweep: false,
			interactive: true,
			veil: 0.35,
			...options
		};
		const submitted = o.colours === 'submitted';
		const stops = submitted ? null : Array.isArray(o.colours) ? o.colours : CRAMERI[o.colours];
		const [M, emis, colours] = await Promise.all([
			json(),
			bin('emissions.bin'),
			bin(submitted ? 'rgb.bin' : 'pc1.bin')
		]);
		const { S, T } = M;
		const turn = (o.rotate * Math.PI) / 180;
		const spin = ([x, y]) => [
			x * Math.cos(turn) + y * Math.sin(turn),
			-x * Math.sin(turn) + y * Math.cos(turn)
		];
		const g = {
			...M.geo,
			phi0: M.geo.phi0 + turn,
			slices: M.geo.slices.map((s) => ({ ...s, shift: spin(s.shift) }))
		};
		const [s0, s1] = g.slices;
		const reach = s1.ro + g.gap + g.rayLen;
		// The outline Earth's size about its centre: at zoom 0 its radius is the Disc's rim, at 1 its own.
		// The box is resized rather than CSS-scaled, so the non-scaling stroke stays as thin as set.
		const rimScale = s1.ro / M.earth.r;
		let earthK = 1;
		const placeEarth = () => {
			if (!earth || !box.w) return;
			const size = 2 * M.earth.r * box.scale * earthK;
			Object.assign(earth.style, {
				left: `${box.cx - size / 2}px`,
				top: `${box.cy - size / 2}px`,
				width: `${size}px`,
				height: `${size}px`
			});
		};
		const zoomEarth = (t) => {
			const k = Math.min(1, Math.max(0, t));
			earthK = rimScale + (1 - rimScale) * k;
			placeEarth();
		};
		const yearOf = (t) => M.years[0] + (t * (M.years[1] - M.years[0])) / (T - 1);
		const E = new Int16Array(emis.slice(0));
		for (let i = 0; i < E.length; i++) if (i % T) E[i] += E[i - 1];

		const art = document.createElement('canvas');
		art.className = 'disc-art';
		art.setAttribute('aria-hidden', 'true');
		art.style.cssText = 'position:absolute;left:0;top:0;transform-origin:0 0;pointer-events:none';
		el.append(art);
		let earth = null;
		if (o.earth !== false) {
			const e = o.earth ?? {};
			el.insertAdjacentHTML(
				'beforeend',
				`<svg viewBox="-1000 -1000 2000 2000" aria-hidden="true" style="position:absolute;overflow:visible;pointer-events:none;fill:${e.fill ?? 'none'};stroke:${e.stroke ?? 'currentColor'};stroke-width:${e.width ?? 0.75}"><path d="${M.earth.path}" vector-effect="non-scaling-stroke"/><circle r="1000" vector-effect="non-scaling-stroke"/></svg>`
			);
			earth = el.lastElementChild;
			earth.classList.add('disc-earth');
			// Starting size only; layout() places it once the box is measured.
			if (typeof o.earthZoom === 'number')
				earthK = rimScale + (1 - rimScale) * Math.min(1, Math.max(0, o.earthZoom));
		}
		const over = document.createElement('canvas');
		over.className = 'disc-over';
		over.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
		if (o.label === false) over.setAttribute('aria-hidden', 'true');
		else {
			over.setAttribute('role', 'img');
			over.setAttribute('aria-label', o.label ?? DEFAULT_LABEL);
		}
		if (o.interactive) {
			over.tabIndex = 0;
			over.style.touchAction = 'pan-y';
		} else over.style.pointerEvents = 'none';
		el.append(over);
		const ctx = over.getContext('2d');

		const worker = new Worker('/disc/disc-worker.js');
		const copy = colours.slice(0);
		worker.postMessage(
			{
				meta: { S, T, geo: g, bloom: M.bloom, ray: M.ray },
				colours: copy,
				submitted,
				stops,
				range: o.range,
				ground: o.ground,
				bloom: o.glow
			},
			[copy]
		);

		let box = { w: 0, h: 0, cx: 0, cy: 0, scale: 1, dpr: 1 },
			sel = null,
			shown = null,
			first = true,
			sized;

		// Requests carry their quality, so each result can be sized exactly as it was drawn.
		const qualities = new Map();

		// Hand-driven sweep: a clockwise wedge from the Disc's start angle, in the art canvas's own pixels.
		let revealF = typeof o.reveal === 'number' ? o.reveal : null;
		const applyReveal = () => {
			if (revealF === null || !shown) return;
			if (revealF >= 1) return void (art.style.clipPath = '');
			const f = Math.max(0, revealF),
				R = 1e5,
				a0 = g.phi0 - 0.02,
				pts = [`${shown.cx}px ${shown.cy}px`];
			for (let i = 0; i <= 48; i++) {
				const a = a0 + (TAU * f * i) / 48;
				pts.push(`${shown.cx + R * Math.sin(a)}px ${shown.cy - R * Math.cos(a)}px`);
			}
			art.style.clipPath = `polygon(${pts.join()})`;
		};
		const shownWidth = (W, scale) => W / (qualities.get(scale) ?? 1);

		const placeArt = () => {
			if (!shown) return;
			const k = box.scale / shown.css;
			art.style.transform = `translate(${box.cx - k * shown.cx}px, ${box.cy - k * shown.cy}px) scale(${k})`;
		};

		function layout() {
			const w = el.clientWidth,
				h = el.clientHeight,
				dpr = devicePixelRatio || 1;
			if (!w || !h || (w === box.w && h === box.h)) return;
			const p = (o.place ?? ((W, H) => ({ r: Math.min(W, H) / 2, cx: W / 2, cy: H / 2 })))(w, h);
			box = { w, h, cx: p.cx, cy: p.cy, scale: p.r / reach, dpr };
			placeArt();
			over.width = Math.round(w * dpr);
			over.height = Math.round(h * dpr);
			placeEarth();
			paint();
			clearTimeout(sized);
			// Sharp on a 2x screen, capped so that a very large box does not take seconds.
			const q = Math.min(2, 2800 / Math.max(w, h));
			sized = setTimeout(
				() => {
					qualities.set(box.scale * q, q);
					worker.postMessage({
						W: Math.round(w * q),
						H: Math.round(h * q),
						scale: box.scale * q,
						cx: box.cx * q,
						cy: box.cy * q
					});
				},
				first ? 0 : 150
			);
		}

		worker.onmessage = ({ data: { W, H, buf, scale, cx, cy } }) => {
			// This render's own CSS size, scale and centre: the box may have moved on since it was asked for.
			const q = W / shownWidth(W, scale);
			art.width = W;
			art.height = H;
			art.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(buf), W, H), 0, 0);
			art.style.width = `${W / q}px`;
			art.style.height = `${H / q}px`;
			shown = { css: scale / q, cx: cx / q, cy: cy / q };
			placeArt();
			applyReveal();
			if (first && o.sweep && !reduced()) sweepOpen();
			if (first) o.onReady?.();
			first = false;
		};

		function sweepOpen() {
			const R = Math.hypot(box.w, box.h),
				a0 = g.phi0 - 0.02;
			const wedge = (f) => {
				const p = [`${box.cx}px ${box.cy}px`];
				for (let i = 0; i <= 32; i++) {
					const a = a0 + (TAU * f * i) / 32;
					p.push(`${box.cx + R * Math.sin(a)}px ${box.cy - R * Math.cos(a)}px`);
				}
				return `polygon(${p.join()})`;
			};
			art.animate(
				Array.from({ length: 41 }, (_, i) => ({ clipPath: wedge(i / 40) })),
				{ duration: 1600, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }
			);
		}

		const sliceOf = (k) => (k < s1.k0 ? s0 : s1);
		const at = (s, a, r) => [
			box.cx + box.scale * (s.shift[0] + r * Math.sin(a)),
			box.cy - box.scale * (s.shift[1] + r * Math.cos(a))
		];

		function hit(px, py) {
			const X = (px - box.cx) / box.scale,
				Y = (box.cy - py) / box.scale,
				slop = 24 / box.scale;
			const s = mod(Math.atan2(X, Y) - g.phi0) >= s1.start ? s1 : s0;
			const dx = X - s.shift[0],
				dy = Y - s.shift[1],
				r = Math.hypot(dx, dy);
			if (r < s.ri - slop || r > reach + slop) return null;
			const span = s.n * g.w,
				th = mod(Math.atan2(dx, dy) - g.phi0 - s.start);
			const kl =
				th < span ? Math.min(s.n - 1, Math.trunc(th / g.w)) : th - span < TAU - th ? s.n - 1 : 0;
			const t = Math.min(T - 1, Math.max(0, Math.round(((r - s.ri) / (s.ro - s.ri)) * (T - 1))));
			return { k: s.k0 + kl, t };
		}

		function paint() {
			ctx.setTransform(box.dpr, 0, 0, box.dpr, 0, 0);
			ctx.clearRect(0, 0, box.w, box.h);
			if (!sel) return;
			const s = sliceOf(sel.k),
				a0 = g.phi0 + s.start + (sel.k - s.k0) * g.w,
				a1 = a0 + g.w;
			const end = s.ro + g.gap + M.ray[sel.k];
			if (o.veil) {
				ctx.beginPath();
				ctx.rect(0, 0, box.w, box.h);
				for (const [i, p] of [
					at(s, a0, s.ri),
					at(s, a0, end),
					at(s, a1, end),
					at(s, a1, s.ri)
				].entries())
					ctx[i ? 'lineTo' : 'moveTo'](...p);
				ctx.closePath();
				ctx.globalCompositeOperation = 'source-over';
				ctx.fillStyle = o.ground ?? getComputedStyle(el).backgroundColor;
				ctx.globalAlpha = o.veil;
				ctx.fill('evenodd');
				ctx.globalAlpha = 1;
			}
			const rr = s.ri + (sel.t / (T - 1)) * (s.ro - s.ri);
			const ink = getComputedStyle(el).color;
			ctx.lineCap = 'round';
			ctx.beginPath();
			for (let i = 0; i <= 8; i++) {
				const p = at(s, a0 + g.w / 2 + ((i - 4) / 4) * Math.max(2 * g.w, 9 / (rr * box.scale)), rr);
				ctx[i ? 'lineTo' : 'moveTo'](...p);
			}
			ctx.lineWidth = 2.5;
			ctx.strokeStyle = ink;
			ctx.stroke();
		}

		function show(next) {
			if (next?.k === sel?.k && next?.t === sel?.t) return;
			sel = next;
			paint();
			o.onPoint?.(
				sel && {
					label: M.label[sel.k],
					kind: sel.k < s1.k0 ? 'standard' : 'optimized',
					year: yearOf(sel.t),
					emissions: E[sel.k * T + sel.t] / 10,
					peak: M.peak[sel.k],
					series: Array.from({ length: T }, (_, t) => ({
						year: yearOf(t),
						emissions: E[sel.k * T + t] / 10
					}))
				}
			);
		}

		if (o.interactive) {
			const hovers = matchMedia('(hover: hover) and (pointer: fine)').matches;
			const point = (e) => {
				const r = over.getBoundingClientRect();
				show(hit(e.clientX - r.left, e.clientY - r.top));
			};
			over.addEventListener('pointerdown', point);
			over.addEventListener('pointermove', (e) => {
				if (e.buttons || (hovers && e.pointerType === 'mouse')) point(e);
			});
			over.addEventListener('pointerleave', (e) => {
				if (e.pointerType === 'mouse') show(null);
			});
			over.addEventListener('keydown', (e) => {
				const step = {
					ArrowRight: [1, 0],
					ArrowLeft: [-1, 0],
					ArrowUp: [0, 1],
					ArrowDown: [0, -1]
				}[e.key];
				if (!step) return;
				e.preventDefault();
				show(
					sel
						? { k: (sel.k + step[0] + S) % S, t: Math.min(T - 1, Math.max(0, sel.t + step[1])) }
						: { k: 0, t: T - 1 }
				);
			});
		}

		const observer = new ResizeObserver(layout);
		observer.observe(el);
		layout();
		return {
			earthZoom(t) {
				zoomEarth(t);
			},
			reveal(f) {
				revealF = f;
				applyReveal();
			},
			destroy() {
				clearTimeout(sized);
				observer.disconnect();
				worker.terminate();
				for (const node of [art, earth, over]) node?.remove();
			},
			ringFor(year) {
				const r = s1.ri + ((year - M.years[0]) / (M.years[1] - M.years[0])) * (s1.ro - s1.ri);
				return { cx: box.cx, cy: box.cy, r: r * box.scale };
			}
		};
	}

	async function scenarios() {
		const [M, emis] = await Promise.all([json(), bin('emissions.bin')]);
		const E = new Int16Array(emis.slice(0)),
			{ S, T } = M,
			n1 = M.geo.slices[1].k0;
		for (let i = 0; i < E.length; i++) if (i % T) E[i] += E[i - 1];
		return Array.from({ length: S }, (_, k) => ({
			label: M.label[k],
			kind: k < n1 ? 'standard' : 'optimized',
			peak: M.peak[k],
			series: Array.from({ length: T }, (_, t) => ({
				year: M.years[0] + (t * (M.years[1] - M.years[0])) / (T - 1),
				emissions: E[k * T + t] / 10
			}))
		}));
	}

	window.Disc = { mount, scenarios };
})();
