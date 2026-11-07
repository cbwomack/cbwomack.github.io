<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();

	// Home's header floats in after the opening sequence; every other page has it from the start.
	const isHome = $derived(page.route.id === '/');
</script>

<a class="skip-link" href="#main">Skip to content</a>
<Nav floating={isHome} />
<main id="main">
	{@render children()}
</main>
<Footer />
