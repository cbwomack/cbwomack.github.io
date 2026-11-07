/* global Disc */
// Home: the live Disc as the O of WOMACK, and the opening sequence.
// Loaded with `defer` after disc-embed.js. Without script, the <noscript> image in #o shows instead.
//
// With motion allowed (html.motion, set in app.html), the page opens on "Chris WOMACK" and the Earth.
// The Earth outline starts as large as the Disc's rim. The monument is sticky for two screens of
// scrolling (CSS: the .spacer after it), and over that distance --p goes 0 → 1 on .mon, in three steps:
//   first quarter: the Earth shrinks to its true size;
//   next: the Disc sweeps in clockwise, one full turn;
//   last: the headline and bio fade in (in CSS, from --p), only once the Disc is whole;
// then html.past is set: the page scrolls on and the floating header appears.
(() => {
	const root = document.documentElement;
	const o = document.getElementById('o');
	const track = document.querySelector('.track');
	const mon = document.querySelector('.mon');
	if (!o || !track || !mon) return;

	const motion = root.classList.contains('motion');
	// Where each step ends, as a share of the locked scroll; the text fades in over the rest
	// (keep DISC_END in step with the .lower opacity rule in src/routes/+page.svelte).
	const EARTH_END = 0.25;
	const DISC_END = 0.625;
	const step = (f, a, b) => Math.min(1, Math.max(0, (f - a) / (b - a)));
	const shrink = (f) => step(f, 0, EARTH_END);
	const sweep = (f) => step(f, EARTH_END, DISC_END);
	let disc = null;
	let p = motion ? 0 : 1;

	function update() {
		const distance = track.offsetHeight - mon.offsetHeight;
		const scrolled = window.scrollY - track.offsetTop;
		p = motion && distance > 0 ? Math.min(1, Math.max(0, scrolled / distance)) : 1;
		mon.style.setProperty('--p', p.toFixed(4));
		disc?.earthZoom(shrink(p));
		disc?.reveal(sweep(p));
		root.classList.toggle('past', p >= 1);
	}

	let queued = false;
	const onScroll = () => {
		if (queued) return;
		queued = true;
		requestAnimationFrame(() => {
			queued = false;
			update();
		});
	};
	if (motion) {
		addEventListener('scroll', onScroll, { passive: true });
		addEventListener('resize', onScroll);
	}
	update();

	if (!window.Disc) return;

	// Crameri "lipari" (Scientific colour maps, Crameri 2018), the 41 published stops.
	// Only the map's first 90% is used, so its pale end does not vanish into the porcelain ground.
	const LIPARI = [
		'#031326', '#051B31', '#07243E', '#0A2C4A', '#103557', '#183E61', '#22466B', '#2F4E73',
		'#3C5478', '#47587A', '#525B7A', '#5A5D7A', '#615E78', '#695E76', '#705F74', '#785F72',
		'#806070', '#87606E', '#91616C', '#9A6169', '#A56267', '#AE6364', '#B86462', '#C56660',
		'#CF695E', '#D86E5E', '#E17660', '#E77E63', '#E98768', '#EA916E', '#E99973', '#E7A279',
		'#E6AA7F', '#E5B186', '#E5BA8F', '#E7C398', '#EACDA5', '#EED6B1', '#F2E0BE', '#F8EBCD',
		'#FDF5DA'
	];

	Disc.mount(o, {
		colours: LIPARI,
		range: [0, 0.9],
		interactive: false,
		// Scroll drives the sweep; without motion the Disc is simply whole.
		reveal: sweep(p),
		earthZoom: shrink(p),
		// The wordmark around it already names the art for screen readers.
		label: false,
		earth: { stroke: '#23282c', width: 0.75 }
	}).then((handle) => {
		disc = handle;
		disc.earthZoom(shrink(p));
		disc.reveal(sweep(p));
	});
})();
