<!--
	Prerendered to build/404.html, which GitHub Pages serves for any unknown address.
	Asset paths are root-absolute (paths.relative: false), so it works at nested URLs too.
-->
<script lang="ts">
	import SeoHead from '$lib/components/SeoHead.svelte';
</script>

<SeoHead title="Page not found" description="This page does not exist." noindex />

<div class="page">
	<h1 class="page-title">Page not found</h1>
	<p class="lead">
		This address has no page. Try <a href="/">Home</a> or <a href="/publications">Publications</a>.
	</p>
</div>

<style>
	.lead {
		margin-top: 24px;
	}
</style>
