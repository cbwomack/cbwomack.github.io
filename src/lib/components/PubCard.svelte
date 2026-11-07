<!--
	One publication as a card on the tint: year, linked title, authors (Chris's name at 600), venue.
	Wide screens: the card spans the page and the abstract sits in a right-hand column. With a mouse,
	the abstract fades in while the card is hovered or anything in it has keyboard focus. Its space is
	always kept, so nothing moves while the pointer travels down the list. Wide touch screens cannot
	hover, so they show it outright.
	Narrow screens: one column, the summary folded under "Summary" (works without script).
	Only one of the two abstract copies is ever displayed, so screen readers meet it once.
-->
<script lang="ts">
	import { splitAuthors } from '$lib/authors';
	import type { Publication } from '$lib/data/publications';

	let { pub }: { pub: Publication } = $props();
</script>

<div class="card">
	<p class="year muted">{pub.year}</p>
	<div class="main">
		<h3 class="title">
			{#if pub.link}
				<a href={pub.link}>{pub.title}</a>
			{:else}
				{pub.title}
			{/if}
		</h3>
		<p class="authors">
			{#each splitAuthors(pub.authors) as part, i (i)}
				{#if part.bold}<strong>{part.text}</strong>{:else}{part.text}{/if}
			{/each}
		</p>
		<p class="muted venue">{pub.venue}</p>
		{#if pub.abstract}
			<details class="fold">
				<summary>Summary</summary>
				<p>{pub.abstract}</p>
			</details>
		{/if}
	</div>
	{#if pub.abstract}
		<p class="abstract">{pub.abstract}</p>
	{/if}
</div>

<style>
	.card {
		padding: 24px;
		border-radius: 4px;
		background: var(--tint);
	}

	.year {
		font-size: 18px;
		line-height: 1.5;
		font-variant-numeric: tabular-nums;
	}

	.title {
		font-size: 24px;
		font-weight: 400;
		font-stretch: 85%;
		line-height: 1.3;
		letter-spacing: 0;
	}

	.authors {
		margin-top: 8px;
		font-size: 18px;
		line-height: 1.5;
	}

	.venue {
		font-size: 18px;
		line-height: 1.5;
	}

	.fold {
		margin-top: 8px;
	}

	summary {
		display: inline-block;
		min-height: 24px;
		color: var(--link);
		cursor: pointer;
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.18em;
		list-style: none;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	summary::after {
		content: ' +';
		text-decoration: none;
	}

	details[open] summary::after {
		content: ' −';
	}

	.fold p {
		margin-top: 8px;
	}

	.abstract {
		display: none;
	}

	@media (max-width: 640px) {
		.card {
			padding: 20px 16px;
		}
	}

	/* Wide: year | title, authors, venue | abstract. */
	@media (min-width: 1100px) {
		.card {
			display: grid;
			/* Equal shares, so the summary stays about as tall as the title block at every width. */
			grid-template-columns: 4em minmax(0, 1fr) minmax(0, 1fr);
			column-gap: 32px;
			padding: 28px 32px;
		}

		/* Same line box as the title's first line, so the year sits on it. */
		.year {
			line-height: calc(24px * 1.3);
		}

		/* Keep the reading line under 30em on very wide screens. */
		.main {
			max-width: 30em;
		}

		.fold {
			display: none;
		}

		.abstract {
			display: block;
			font-size: 18px;
			line-height: 1.55;
		}
	}

	@media (min-width: 1100px) and (hover: hover) and (pointer: fine) {
		.abstract {
			opacity: 0;
			transition: opacity 160ms var(--ease-out);
		}

		.card:hover .abstract,
		.card:focus-within .abstract {
			opacity: 1;
		}
	}
</style>
