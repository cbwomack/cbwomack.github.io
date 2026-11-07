<!--
	Publications in two groups: Articles and preprints, and Theses.
	Newest first within each group. Talks are not listed. Each paper is a PubCard: on wide screens the card spans the page and its
	abstract appears to the right on hover or focus; on phones the abstract is folded (no script needed).
-->
<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { publications, type Publication } from '$lib/data/publications';
	import PubCard from '$lib/components/PubCard.svelte';

	const isThesis = (p: Publication) => /\bThesis\b/.test(p.venue);
	const newestFirst = (a: Publication, b: Publication) => b.year - a.year;

	const groups = [
		{
			id: 'articles',
			title: 'Articles and preprints',
			items: publications.filter(
				(p) => (p.category === 'publication' && !isThesis(p)) || p.category === 'preprint'
			)
		},
		{ id: 'theses', title: 'Theses', items: publications.filter(isThesis) }
	]
		.map((g) => ({ ...g, items: [...g.items].sort(newestFirst) }))
		.filter((g) => g.items.length > 0);
</script>

<SeoHead title="Publications" />

<div class="page">
	<h1 class="page-title">Publications</h1>

	{#each groups as group (group.id)}
		<section aria-labelledby={group.id}>
			<h2 id={group.id} class="section-title">{group.title}</h2>
			<ul class="pubs">
				{#each group.items as pub (pub.title)}
					<li><PubCard {pub} /></li>
				{/each}
			</ul>
		</section>
	{/each}
</div>

<style>
	/* Cards span the page; each card keeps its own text columns to a readable width. */
	.page > section {
		max-width: none;
	}

	.pubs {
		display: grid;
		gap: 16px;
		margin-top: 24px;
	}
</style>
