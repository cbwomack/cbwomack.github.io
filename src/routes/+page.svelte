<!--
	Home: "Chris" above WOMACK in hairline condensed capitals, with the
	live Disc (the PNAS study's 357 scenarios) as the O; the headline and bio below MACK's baseline; then
	the highlighted publications.

	Opening sequence (static/disc/home.js, only when script runs and motion is allowed): the page opens
	on "Chris WOMACK" and the Earth alone, drawn as large as the Disc. The monument holds still for two
	screens of scrolling: the Earth shrinks to its true size, then the Disc sweeps in clockwise, then,
	once it is whole, the headline and bio fade in; then the page scrolls on and the floating header
	appears. Without script or with reduced motion, everything shows at once.
-->
<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { publications } from '$lib/data/publications';
	import { site } from '$lib/data/site';

	// The highlighted papers, with a short venue label each.
	const picks = [
		{ title: 'Optimal scenario design for climate emulation', venue: 'PNAS, 2026' },
		{
			title:
				'A theoretical framework to understand sources of error in Earth System Model emulation',
			venue: 'Earth System Dynamics, 2026'
		}
	];
	const highlights = picks.map(({ title, venue }) => {
		const pub = publications.find((p) => p.title === title);
		if (!pub) throw new Error(`Highlighted paper not in publications.ts: ${title}`);
		return { pub, venue };
	});
</script>

<SeoHead />

<svelte:head>
	<script src="/disc/disc-embed.js" defer></script>
	<script src="/disc/home.js" defer></script>
</svelte:head>

<div class="track">
	<section class="mon" aria-labelledby="headline">
		<div class="word" role="img" aria-label="Chris Womack, with the Disc as the letter O">
			<span class="first" aria-hidden="true">Chris</span>
			<span aria-hidden="true">W</span>
			<div id="o" aria-hidden="true">
				<noscript><img class="still" src="/disc/disc.png" alt="" /></noscript>
			</div>
			<span aria-hidden="true">M</span>
			<span aria-hidden="true">A</span>
			<span aria-hidden="true">C</span>
			<span aria-hidden="true">K</span>
		</div>

		<div class="lower">
			<h1 id="headline">{site.headline.join(' ')}</h1>
			<p class="bio">{site.bio}</p>
		</div>
	</section>
	<div class="spacer" aria-hidden="true"></div>
</div>

<section class="list" aria-labelledby="papers">
	<h2 id="papers" class="section-title">Highlighted publications</h2>
	<ul>
		{#each highlights as { pub, venue } (pub.title)}
			<li>
				<a href={pub.link}>{pub.title}</a>
				<p class="venue">{venue}</p>
			</li>
		{/each}
	</ul>
	<p class="foot"><a href="/publications">All publications</a></p>
</section>

<style>
	.mon {
		/* The O fills the window height on wide screens; the five thin capitals share what it leaves,
		   at their real widths. */
		--d: min(100svh, 62.5vw);
		--slot: calc(var(--d) * 0.83);
		--f: calc((100vw - var(--slot)) / 3.02);
		/* Where MACK's baseline sits, measured from the top of the monument. */
		--base: calc(var(--d) / 2 + var(--f) * 0.374);
		/* "Chris" font size as a share of the capitals' size: its width then ends near the W's middle. */
		--first-scale: 0.16;

		position: relative;
		min-height: var(--d);
		/* Room for the headline and bio below the baseline in short, wide windows (about 300 px). */
		padding-bottom: max(0px, calc(var(--base) + 32px + 300px - var(--d)));
	}

	.word {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: var(--d);
		font-size: var(--f);
		font-weight: 100;
		font-stretch: 75%;
		line-height: 1;
		letter-spacing: -0.02em;
	}

	/* Cap line and baseline run edge to edge behind the O. */
	.word::before,
	.word::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		border-top: 1px solid var(--rule);
	}

	.word::before {
		top: calc(50% - var(--f) * 0.324);
	}

	.word::after {
		top: calc(50% + var(--f) * 0.374);
	}

	.word span {
		position: relative;
		z-index: 2;
	}

	/* "Chris", left-aligned with the W and reaching about its middle, just above the cap line. */
	.word .first {
		position: absolute;
		left: calc(var(--f) * 0.02);
		bottom: calc(50% + var(--f) * 0.324 + 10px);
		font-size: max(16px, calc(var(--f) * var(--first-scale)));
		font-weight: 400;
		font-stretch: 100%;
		line-height: 1;
		letter-spacing: 0.02em;
	}

	#o {
		position: relative;
		flex: none;
		width: var(--d);
		height: var(--d);
		margin-inline: calc((var(--slot) - var(--d)) / 2);
		color: var(--ink);
	}

	.still {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.lower {
		position: absolute;
		right: var(--gutter);
		top: calc(var(--base) + 32px);
		width: calc(100vw - var(--gutter) - var(--d) * 1.115);
		z-index: 3;
	}

	/* Opening sequence. html.motion is set in app.html when script runs and motion is allowed;
	   home.js sets --p from 0 to 1 while the monument holds still (steps described in home.js). */
	/* The room the monument holds still for (a sticky box only travels within its parent's content,
	   so this is a real element, not padding). */
	:global(html.motion) .spacer {
		height: 200svh;
	}

	:global(html.motion) .mon {
		position: sticky;
		top: 0;
	}

	:global(html.motion) .lower {
		/* Starts only once the Disc is whole (--p 0.625, DISC_END in home.js); fully in at the release. */
		opacity: clamp(0, calc((var(--p, 0) - 0.625) / 0.375), 1);
	}

	h1 {
		font-size: clamp(38px, 3.4vw, 54px);
		font-weight: 300;
		font-stretch: 85%;
		line-height: 1.1;
		letter-spacing: 0;
	}

	.bio {
		margin-top: 14px;
	}

	.list {
		padding: 56px var(--gutter) 96px;
	}

	.list ul {
		display: grid;
		gap: 36px;
		max-width: 1100px;
	}

	.list li a {
		font-size: clamp(26px, 2.6vw, 38px);
		font-weight: 400;
		font-stretch: 85%;
		line-height: 1.2;
		letter-spacing: 0;
	}

	.venue {
		margin-top: 6px;
		color: var(--muted);
		font-size: 18px;
	}

	.list h2 {
		margin: 0 0 32px;
	}

	.foot {
		margin-top: 56px;
	}

	/* Below about 1180 px the right-hand column gets too narrow beside the O: stack instead. */
	@media (max-width: 1180px) {
		.mon {
			/* Capped by height so the headline still reaches the first screen on small laptops. */
			--d: min(56vw, 52svh);
			display: flex;
			flex-direction: column;
			padding-bottom: 8px;
		}

		.lower {
			position: static;
			width: auto;
			max-width: var(--measure);
			margin-top: 32px;
			padding: 0 var(--gutter);
		}
	}

	@media (max-width: 640px) {
		/* At phone size the hairline is too faint; one step heavier. */
		.word {
			font-weight: 200;
		}

		.list {
			padding: 40px var(--gutter) 64px;
		}

		.list ul {
			gap: 28px;
		}
	}
</style>
