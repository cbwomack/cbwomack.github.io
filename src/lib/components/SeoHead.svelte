<script lang="ts">
	import { page } from '$app/state';
	import { site } from '$lib/data/site';

	interface Props {
		/** Page name; omitted on Home, which uses the full site title. */
		title?: string;
		description?: string;
		noindex?: boolean;
	}

	let { title, description = site.bio, noindex = false }: Props = $props();

	// "Climate scientist, ETH Zürich" is interface wording for search results and tabs.
	const siteTitle = `${site.name} · Climate scientist, ETH Zürich`;
	const fullTitle = $derived(title ? `${title} · ${site.name}` : siteTitle);
	// prerender.origin in vite.config.ts makes this https://cbwomack.github.io.
	const url = $derived(new URL(page.url.pathname, page.url.origin).href);
	const image = $derived(new URL('/og.png', page.url.origin).href);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	{#if noindex}
		<meta name="robots" content="noindex" />
	{:else}
		<link rel="canonical" href={url} />
	{/if}
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={image} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta
		property="og:image:alt"
		content="WOMACK, with the Disc, a circle of 357 climate scenarios, as the letter O"
	/>
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>
