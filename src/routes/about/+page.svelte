<!--
	About: the photo of Chris, then who and where, the bio, interests, and Contact (a link that opens an
	email to Chris; every other link is in the header and footer).
	Text from src/lib/data/site.ts: the About bio is site.aboutBio; Home keeps the short site.bio.
	Wide screens: two columns, text left and the portrait right, held in view.
	Phones: one column, the photo after the title.
	The portrait is shown no wider than half its 1600 px file, so it is never stretched on a 2x screen.
	Wide screens, with script: scrolling down to Interests fades the portrait into one of Chris's photos,
	picked at random per visit (static/about.js, list in src/lib/data/photos.ts). Without script, on
	phones, or scrolling back up: the portrait.
-->
<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import portrait from '$lib/assets/portrait.jpg?enhanced';
	import { aboutPhotos } from '$lib/data/photos';
	import { site } from '$lib/data/site';
</script>

<svelte:head>
	<script src="/about.js" defer></script>
</svelte:head>

<SeoHead title="About" />

<div class="page">
	<h1 class="page-title">About</h1>

	<figure class="photo" data-photos={JSON.stringify(aboutPhotos)}>
		<enhanced:img
			src={portrait}
			alt="Chris Womack in a dark jacket on a grassy ridge below a snowy mountain valley"
			sizes="(max-width: 1179px) 100vw, 50vw"
		/>
	</figure>

	<p class="who">{site.name}</p>
	<p class="role">{site.role[0]}<br />{site.role[1]}</p>
	{#each site.aboutBio as paragraph (paragraph)}
		<p class="bio">{paragraph}</p>
	{/each}

	<section aria-labelledby="interests">
		<h2 id="interests" class="section-title">Interests</h2>
		<ul class="interests">
			{#each site.interests as interest (interest)}
				<li>{interest}</li>
			{/each}
		</ul>
	</section>

	<h2 class="section-title contact">
		<a href="mailto:{site.email}">Contact</a> <span class="address">– {site.email}</span>
	</h2>
</div>

<style>
	.page .photo {
		position: relative;
		max-width: 800px;
		margin-top: 32px;
	}

	.photo :global(img) {
		width: 100%;
		height: auto;
		border-radius: 8px;
	}

	.who {
		margin-top: 32px;
		font-weight: 600;
	}

	.role {
		font-size: 18px;
		line-height: 1.5;
	}

	.bio {
		margin-top: 20px;
	}

	/* "Contact" stays the link; the address beside it is plain, so it can be read or copied. */
	.contact .address {
		font-weight: 400;
		overflow-wrap: anywhere;
	}

	.interests {
		display: grid;
		gap: 12px;
		margin-top: 16px;
	}

	.interests li {
		font-size: clamp(26px, 2.6vw, 36px);
		font-weight: 300;
		font-stretch: 85%;
		line-height: 1.2;
		letter-spacing: 0;
	}

	/* The random photo (added by about.js) lies over the portrait, the same 3:2 shape, and fades in. */
	.photo :global(img.swap) {
		position: absolute;
		inset: 0;
		height: 100%;
		object-fit: cover;
		opacity: 0;
		transition: opacity 400ms var(--ease-out);
	}

	.photo:global(.swapped) :global(img.swap) {
		opacity: 1;
	}

	/* Two columns: every text block in the first (the reading measure), the photo beside them. */
	@media (min-width: 1180px) {
		.page {
			display: grid;
			grid-template-columns: minmax(0, var(--measure)) minmax(0, 800px);
			column-gap: 64px;
			align-items: start;
		}

		.page > :global(*) {
			grid-column: 1;
		}

		.page .photo {
			grid-column: 2;
			grid-row: 1 / span 20;
			position: sticky;
			top: 96px;
			margin-top: 0;
		}
	}
</style>
