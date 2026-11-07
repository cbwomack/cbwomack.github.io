// About: once the reader scrolls down towards Interests, one of Chris's photos, picked at random on
// each visit, fades in over the portrait. Scrolling back up brings the portrait back.
// Wide screens only (there the photo stays in view beside the text); phones and no-script readers see
// the portrait. The list comes from the figure's data-photos (src/lib/data/photos.ts); the files are
// static/photos/<name>-800.jpg and -1600.jpg, all the portrait's 3:2 shape.
(() => {
	const fig = document.querySelector('.photo[data-photos]');
	const mark = document.getElementById('interests');
	const portrait = fig && fig.querySelector('img');
	if (!fig || !mark || !portrait) return;

	let list;
	try {
		list = JSON.parse(fig.dataset.photos || '[]');
	} catch {
		return;
	}
	if (!list.length) return;

	const wide = matchMedia('(min-width: 1180px)');
	const pick = list[Math.floor(Math.random() * list.length)];
	let photo = null;

	function make() {
		photo = document.createElement('img');
		photo.className = 'swap';
		photo.src = `/photos/${pick.name}-1600.jpg`;
		photo.srcset = `/photos/${pick.name}-800.jpg 800w, /photos/${pick.name}-1600.jpg 1600w`;
		photo.sizes = '50vw';
		photo.width = 1600;
		photo.height = 1067;
		photo.alt = pick.alt;
		photo.decoding = 'async';
		photo.setAttribute('aria-hidden', 'true');
		fig.append(photo);
	}

	function update() {
		// "Towards Interests": its heading has risen past the lower third of the window, and the reader
		// has scrolled (so a very tall window does not open on the swapped photo).
		const on =
			wide.matches && scrollY > 40 && mark.getBoundingClientRect().top < innerHeight * 0.66;
		if (on && !photo) make();
		fig.classList.toggle('swapped', on);
		// Only the photo on show is announced.
		// (aria-hidden must be "true"; an empty value does not hide.)
		const hide = (el, hidden) =>
			hidden ? el.setAttribute('aria-hidden', 'true') : el.removeAttribute('aria-hidden');
		if (photo) hide(photo, !on);
		hide(portrait, on);
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
	addEventListener('scroll', onScroll, { passive: true });
	addEventListener('resize', onScroll);
	// Fetch the photo early on wide screens, so it is ready before the reader gets there.
	addEventListener('load', () => {
		if (wide.matches && !photo) make();
	});
	update();
})();
