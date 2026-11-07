<!--
	The site header: the small wordmark (home) and the four destinations, on a tint bar.
	Inner pages: sticky at the top on wide screens; on phones it scrolls away (the footer repeats every link).
	Home (floating): fixed at the top, hidden while the opening sequence runs and shown once the page
	starts scrolling past it (home.js sets html.past). Without script or with reduced motion it is
	simply always there.
-->
<script lang="ts">
	import { page } from '$app/state';
	import { navLinks } from '$lib/data/nav';
	import Wordmark from './Wordmark.svelte';

	let { floating = false }: { floating?: boolean } = $props();
</script>

<header class="bar" class:floating>
	<Wordmark />
	<nav aria-label="Main">
		<ul>
			{#each navLinks as link (link.href)}
				<li>
					<a href={link.href} aria-current={page.url.pathname === link.href ? 'page' : undefined}
						>{link.label}</a
					>
				</li>
			{/each}
		</ul>
	</nav>
</header>

<style>
	.bar {
		position: sticky;
		top: 0;
		z-index: 10;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 8px 32px;
		padding: 14px var(--gutter);
		/* The footer's tint, so the page is framed top and bottom and content slides under a clear edge. */
		background: var(--tint);
	}

	.floating {
		position: fixed;
		left: 0;
		right: 0;
		transition:
			opacity 200ms var(--ease-out),
			transform 200ms var(--ease-out),
			visibility 0s;
	}

	/* Hidden (and out of the keyboard order) until home.js marks the page as scrolled past. */
	:global(html.motion:not(.past)) .floating {
		opacity: 0;
		transform: translateY(-100%);
		visibility: hidden;
		transition:
			opacity 200ms var(--ease-out),
			transform 200ms var(--ease-out),
			visibility 0s 200ms;
	}

	ul {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 24px;
	}

	/* Links in ink without underlines; the current page carries a short blue bar. */
	.bar a {
		color: var(--ink);
		text-decoration: none;
	}

	.bar a[aria-current='page'] {
		font-weight: 600;
		text-decoration: underline;
		text-decoration-color: var(--link);
		text-decoration-thickness: 2px;
		text-underline-offset: 0.35em;
	}

	@media (hover: hover) and (pointer: fine) {
		.bar a:hover {
			color: var(--link);
		}
	}

	@media (max-width: 640px) {
		.bar:not(.floating) {
			position: static;
		}

		.bar {
			padding-top: 16px;
		}

		ul {
			gap: 4px 20px;
		}
	}
</style>
